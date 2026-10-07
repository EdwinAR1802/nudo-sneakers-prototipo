import { renderLayout, statusBadge, formatDate, productSummary, escapeHtml, toast } from './app.js';
import { getOrders, upsertOrder } from './storage.js';

renderLayout('pedidos','Gestión de pedidos','Pedidos recibidos automáticamente desde la tienda web',
  '<button class="btn btn-primary btn-sm" id="btnSimular"><i class="bi bi-cloud-arrow-down me-1"></i>Simular pedido web</button>');

document.getElementById('page-content').innerHTML = `
  <div class="card-clean p-3 mb-3"><div class="row g-2"><div class="col-md-8"><input id="search" class="form-control" placeholder="Buscar por código, cliente o producto"></div><div class="col-md-4"><select id="status" class="form-select"><option value="">Todos los estados</option><option>Confirmado</option><option>Preparado</option><option>Asignado</option><option>En ruta</option><option>Entregado</option></select></div></div></div>
  <div class="card-clean overflow-hidden"><div class="table-responsive"><table class="table table-modern"><thead><tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Fecha</th><th></th></tr></thead><tbody id="rows"></tbody></table></div></div>
  <div class="modal fade" id="detailModal" tabindex="-1"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content border-0 rounded-4"><div class="modal-header"><h5 class="modal-title">Detalle del pedido</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body" id="detailBody"></div></div></div></div>`;

const rows=document.getElementById('rows');
const search=document.getElementById('search');
const status=document.getElementById('status');
function render(){
  const q=search.value.trim().toLowerCase();
  const s=status.value;
  const orders=getOrders().filter(o=>(!s||o.status===s) && (!q||[o.code,o.customer,productSummary(o)].join(' ').toLowerCase().includes(q)));
  rows.innerHTML=orders.length?orders.map(o=>`<tr><td class="fw-bold">${o.code}</td><td>${escapeHtml(o.customer)}<div class="small muted">${escapeHtml(o.district)}</div></td><td>${escapeHtml(productSummary(o))}</td><td>${statusBadge(o.status)}</td><td>${formatDate(o.createdAt)}</td><td><button class="btn btn-outline-primary btn-sm" data-view="${o.code}">Ver detalle</button></td></tr>`).join(''):`<tr><td colspan="6"><div class="empty-state"><i class="bi bi-search"></i>No se encontraron pedidos.</div></td></tr>`;
}
search.addEventListener('input',render); status.addEventListener('change',render);
rows.addEventListener('click',e=>{
  const code=e.target.dataset.view; if(!code)return;
  const o=getOrders().find(x=>x.code===code); if(!o)return;
  document.getElementById('detailBody').innerHTML=`<div class="row g-3"><div class="col-md-6"><b>Código</b><div>${o.code}</div></div><div class="col-md-6"><b>Estado</b><div>${statusBadge(o.status)}</div></div><div class="col-md-6"><b>Cliente</b><div>${escapeHtml(o.customer)}</div></div><div class="col-md-6"><b>Correo</b><div>${escapeHtml(o.email)}</div></div><div class="col-12"><b>Dirección</b><div>${escapeHtml(o.address)} - ${escapeHtml(o.district)}</div></div><div class="col-12"><b>Productos</b>${o.items.map(i=>`<div class="order-item mt-2"><span>${i.brand} ${i.model}</span><span class="product-pill">Talla ${i.size} · ${i.qty} un.</span></div>`).join('')}</div></div>`;
  new window.bootstrap.Modal('#detailModal').show();
});

document.getElementById('btnSimular').addEventListener('click',()=>{
  const templates=[
    ['Valeria Núñez','valeria.nunez@demo.pe','Av. Primavera 701','Surco',{sku:'NK-AM-42',brand:'Nike',model:'Air Max',size:42,qty:1}],
    ['Renato Silva','renato.silva@demo.pe','Av. La Marina 1515','San Miguel',{sku:'VN-OS-40',brand:'Vans',model:'Old Skool',size:40,qty:1}],
    ['Daniela Paz','daniela.paz@demo.pe','Calle Schell 225','Miraflores',{sku:'NB-574-42',brand:'New Balance',model:'574',size:42,qty:1}]
  ];
  const t=templates[Math.floor(Math.random()*templates.length)];
  const code=`PED-${String(Date.now()).slice(-6)}`;
  const at=new Date().toISOString();
  upsertOrder({code,customer:t[0],email:t[1],phone:'999888777',address:t[2],district:t[3],status:'Confirmado',courierId:null,guide:null,createdAt:at,updatedAt:at,items:[t[4]],history:[{status:'Confirmado',detail:'Pedido recibido automáticamente desde la tienda web.',at}]});
  render(); toast('success',`${code} recibido desde la tienda web`);
});
render();
