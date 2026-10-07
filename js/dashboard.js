import { renderLayout, statusBadge, formatDate, productSummary, confirmAction, success } from './app.js';
import { getOrders, getInventory } from './storage.js';
import { resetDemoData } from './data.js';

renderLayout('inicio','Dashboard operativo','Resumen del flujo de Gestión y Despacho de Pedidos Online',
  '<button class="btn btn-outline-secondary btn-sm" id="btnReset"><i class="bi bi-arrow-counterclockwise me-1"></i>Restablecer demo</button>');

function render() {
  const orders = getOrders();
  const inv = getInventory();
  const low = inv.filter(i=>i.stock<=i.min).length;
  const transit = orders.filter(o=>['Asignado','Recogido','En ruta'].includes(o.status)).length;
  const delivered = orders.filter(o=>o.status==='Entregado').length;
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="row g-3 mb-4">
      ${stat('bi-bag-check','Pedidos',orders.length)}
      ${stat('bi-exclamation-triangle','Stock bajo',low)}
      ${stat('bi-truck','En distribución',transit)}
      ${stat('bi-check-circle','Entregados',delivered)}
    </div>
    <div class="card-clean overflow-hidden">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div><h2 class="section-title">Pedidos recientes</h2><div class="muted small">Información centralizada del proceso</div></div>
        <a class="btn btn-primary btn-sm" href="pedidos.html">Ver todos</a>
      </div>
      <div class="table-responsive"><table class="table table-modern align-middle"><thead><tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Actualización</th></tr></thead><tbody>
        ${orders.slice(0,6).map(o=>`<tr><td class="fw-bold">${o.code}</td><td>${o.customer}</td><td>${productSummary(o)}</td><td>${statusBadge(o.status)}</td><td>${formatDate(o.updatedAt)}</td></tr>`).join('')}
      </tbody></table></div>
    </div>`;
}
function stat(icon,label,value){ return `<div class="col-12 col-sm-6 col-xl-3"><div class="card-clean stat-card d-flex align-items-center gap-3"><div class="stat-icon"><i class="bi ${icon}"></i></div><div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div></div></div>`; }
render();
document.getElementById('btnReset').addEventListener('click', async()=>{
  const r=await confirmAction('¿Restablecer datos?','Se recuperarán los datos iniciales del prototipo.');
  if(r.isConfirmed){ resetDemoData(); render(); success('Datos restablecidos'); }
});
