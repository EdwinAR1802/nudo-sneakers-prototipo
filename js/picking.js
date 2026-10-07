import { renderLayout, statusBadge, productSummary, escapeHtml, confirmAction, success, error } from './app.js';
import { getOrders, getOrder, getInventory, saveInventory, updateOrder, addHistory } from './storage.js';

renderLayout('picking','Picking digital','Preparación de pedidos con lista digital actualizada');
const content=document.getElementById('page-content');
content.innerHTML=`<div class="row g-3"><div class="col-lg-5"><div class="card-clean overflow-hidden"><div class="p-3 border-bottom"><h2 class="section-title">Pedidos pendientes</h2></div><div id="orderList" class="p-3"></div></div></div><div class="col-lg-7"><div class="card-clean p-4" id="workArea"><div class="empty-state"><i class="bi bi-check2-square"></i>Selecciona un pedido para iniciar el picking.</div></div></div></div>`;
let selected=null;
function eligible(){return getOrders().filter(o=>['Confirmado','En picking'].includes(o.status));}
function renderList(){
  const list=eligible();
  document.getElementById('orderList').innerHTML=list.length?list.map(o=>`<button class="btn w-100 text-start border mb-2 p-3 ${selected===o.code?'border-primary bg-primary-subtle':''}" data-code="${o.code}"><div class="d-flex justify-content-between"><b>${o.code}</b>${statusBadge(o.status)}</div><div>${escapeHtml(o.customer)}</div><small class="muted">${escapeHtml(productSummary(o))}</small></button>`).join(''):`<div class="empty-state py-4"><i class="bi bi-check-circle"></i>No hay pedidos pendientes de picking.</div>`;
}
function renderWork(){
  if(!selected){renderList();return;}
  const o=getOrder(selected); if(!o || !['Confirmado','En picking'].includes(o.status)){selected=null;document.getElementById('workArea').innerHTML='<div class="empty-state"><i class="bi bi-check-circle"></i>Pedido preparado correctamente.</div>';renderList();return;}
  const inv=getInventory();
  document.getElementById('workArea').innerHTML=`<div class="d-flex justify-content-between align-items-start mb-3"><div><h2 class="section-title">${o.code}</h2><div class="muted">${escapeHtml(o.customer)} · ${escapeHtml(o.district)}</div></div>${statusBadge(o.status)}</div><p class="small muted">Marca cada producto después de verificar modelo, talla y cantidad física.</p><div id="items">${o.items.map((i,idx)=>{const st=inv.find(x=>x.sku===i.sku)?.stock??0;return `<label class="order-item"><span><input class="form-check-input me-2 pick-check" type="checkbox" data-idx="${idx}"><b>${i.brand} ${i.model}</b><div class="small muted">SKU ${i.sku}</div></span><span><span class="product-pill">Talla ${i.size}</span> <span class="product-pill">${i.qty} un.</span> <span class="product-pill">Stock: ${st}</span></span></label>`}).join('')}</div><button id="confirmPick" class="btn btn-primary w-100 mt-3" disabled><i class="bi bi-check2-all me-1"></i>Confirmar picking y preparación</button>`;
  const checks=[...document.querySelectorAll('.pick-check')]; const btn=document.getElementById('confirmPick');
  checks.forEach(c=>c.addEventListener('change',()=>btn.disabled=!checks.every(x=>x.checked)));
  btn.addEventListener('click',confirmPicking);
}
async function confirmPicking(){
  const o=getOrder(selected); const inv=getInventory();
  for(const item of o.items){ const st=inv.find(x=>x.sku===item.sku); if(!st || st.stock<item.qty){ error('Stock insuficiente',`${item.brand} ${item.model} talla ${item.size} no cuenta con stock suficiente.`); return; } }
  const r=await confirmAction('Confirmar preparación','Se descontará el stock y el pedido pasará a estado Preparado.'); if(!r.isConfirmed)return;
  o.items.forEach(item=>{const st=inv.find(x=>x.sku===item.sku); st.stock-=item.qty;}); saveInventory(inv);
  updateOrder(o.code,x=>{x.stockDiscounted=true;return addHistory(x,'Preparado','Picking confirmado por el Operador de Almacén.');});
  await success('Picking confirmado',`${o.code} está listo para despacho.`); renderWork();
}
document.getElementById('orderList').addEventListener('click',e=>{const btn=e.target.closest('[data-code]');if(!btn)return;selected=btn.dataset.code;renderList();renderWork();});
renderList();
