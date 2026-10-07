import { jsPDF } from 'jspdf';
import { renderLayout, statusBadge, productSummary, escapeHtml, courierName, success, error, toast } from './app.js';
import { getOrders, getOrder, getCouriers, updateOrder, addHistory } from './storage.js';

renderLayout('despacho','Despacho y guías','Generación automática de guía y asignación de courier');
document.getElementById('page-content').innerHTML=`<div class="card-clean overflow-hidden"><div class="table-responsive"><table class="table table-modern"><thead><tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Estado</th><th>Guía</th><th>Courier</th><th>Acciones</th></tr></thead><tbody id="rows"></tbody></table></div></div>`;
const rows=document.getElementById('rows');
function render(){const couriers=getCouriers();const orders=getOrders().filter(o=>['Preparado','Guía generada','Asignado'].includes(o.status));rows.innerHTML=orders.length?orders.map(o=>`<tr><td class="fw-bold">${o.code}</td><td>${escapeHtml(o.customer)}</td><td>${escapeHtml(productSummary(o))}</td><td>${statusBadge(o.status)}</td><td>${o.guide||'-'}</td><td>${escapeHtml(courierName(couriers,o.courierId))}</td><td><div class="d-flex gap-2 flex-wrap"><button class="btn btn-outline-primary btn-sm" data-guide="${o.code}"><i class="bi bi-file-earmark-pdf me-1"></i>${o.guide?'Descargar guía':'Generar guía'}</button><button class="btn btn-primary btn-sm" data-assign="${o.code}" ${!o.guide?'disabled':''}>Asignar courier</button></div></td></tr>`).join(''):`<tr><td colspan="7"><div class="empty-state"><i class="bi bi-truck"></i>No hay pedidos listos para despacho.</div></td></tr>`;}
function pdfGuide(o){const doc=new jsPDF();doc.setFontSize(18);doc.text('NUDO SNEAKERS - GUÍA DE DESPACHO',20,22);doc.setFontSize(11);doc.text(`Guía: ${o.guide}`,20,36);doc.text(`Pedido: ${o.code}`,20,44);doc.text(`Cliente: ${o.customer}`,20,52);doc.text(`Dirección: ${o.address} - ${o.district}`,20,60);doc.text(`Teléfono: ${o.phone}`,20,68);doc.text('Productos:',20,82);let y=90;o.items.forEach(i=>{doc.text(`- ${i.brand} ${i.model} | Talla ${i.size} | Cantidad ${i.qty}`,24,y);y+=8;});doc.save(`${o.guide}.pdf`);}
rows.addEventListener('click', e=>{
  const code=e.target.closest('[data-guide]')?.dataset.guide;
  if(!code)return;
  let o=getOrder(code);
  if(!o.guide){
    const guide=`GD-${o.code.replace('PED-','')}`;
    updateOrder(code,x=>{x.guide=guide;return addHistory(x,'Guía generada',`Guía ${guide} generada automáticamente con los datos del pedido.`);});
    o=getOrder(code);
    toast('success',`${guide} generada`);
    render();
  }
  pdfGuide(o);
});

// Asignación de courier mediante selector.
rows.addEventListener('click', async e => {
  const btn=e.target.closest('[data-assign]'); if(!btn)return;
  const code=btn.dataset.assign; const o=getOrder(code); if(!o?.guide)return;
  const { default: Swal } = await import('sweetalert2');
  const couriers=getCouriers(); const inputOptions={}; couriers.forEach(c=>inputOptions[c.id]=`${c.name} - ${c.company}`);
  const r=await Swal.fire({title:`Asignar ${code}`,input:'select',inputOptions,inputPlaceholder:'Selecciona un courier',showCancelButton:true,confirmButtonText:'Asignar',cancelButtonText:'Cancelar',inputValidator:v=>!v?'Selecciona un courier':undefined});
  if(r.isConfirmed){const c=couriers.find(x=>x.id===r.value);updateOrder(code,x=>{x.courierId=r.value;return addHistory(x,'Asignado',`Pedido asignado a ${c.name} (${c.company}).`);});await success('Courier asignado',`${code} fue asignado a ${c.name}.`);render();}
});
render();
