import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import '../css/styles.css';
import { initDemoData } from './data.js';

window.bootstrap = bootstrap;
initDemoData();

const nav = [
  ['inicio','index.html','bi-grid-1x2-fill','Dashboard'],
  ['pedidos','pedidos.html','bi-bag-check-fill','Pedidos'],
  ['picking','picking.html','bi-check2-square','Picking digital'],
  ['inventario','inventario.html','bi-box-seam-fill','Inventario'],
  ['despacho','despacho.html','bi-truck-front-fill','Despacho'],
  ['courier','courier.html','bi-geo-alt-fill','Courier'],
  ['seguimiento','seguimiento.html','bi-signpost-split-fill','Seguimiento']
];

export function renderLayout(active, title, subtitle = '', actions = '') {
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <img src="./assets/logonudo.png" class="brand-logo" alt="Nudo Sneakers" onerror="this.style.display='none'">
          <div class="brand-copy">
            <div class="brand-title">NUDO<br>SNEAKERS</div>
            <div class="brand-subtitle">Gestión de despachos</div>
          </div>
        </div>
        <div class="nav-label">Operación</div>
        <nav>${nav.map(([id,url,icon,label]) => `
          <a class="nav-link ${active===id?'active':''}" href="${url}"><i class="bi ${icon}"></i><span>${label}</span></a>
        `).join('')}</nav>
        <div class="mt-4 px-2 brand-copy"><small class="text-secondary">Prototipo académico<br>Tópicos de Ingeniería de Software</small></div>
      </aside>
      <div class="main-wrap">
        <header class="topbar">
          <div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>
          <div>${actions}</div>
        </header>
        <main class="page-content" id="page-content"></main>
      </div>
    </div>`;
}

export function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-PE', { dateStyle:'short', timeStyle:'short' }).format(new Date(value));
}
export function statusClass(status='') {
  const s = status.toLowerCase();
  if (s==='confirmado') return 'badge-confirmado';
  if (s.includes('picking')) return 'badge-picking';
  if (s==='preparado') return 'badge-preparado';
  if (s.includes('guía') || s.includes('guia')) return 'badge-guia';
  if (s==='asignado') return 'badge-asignado';
  if (s==='recogido') return 'badge-recogido';
  if (s==='en ruta') return 'badge-ruta';
  if (s==='entregado') return 'badge-entregado';
  if (s==='incidencia') return 'badge-incidencia';
  return 'bg-secondary-subtle text-secondary';
}
export function statusBadge(status) { return `<span class="badge-soft ${statusClass(status)}">${escapeHtml(status)}</span>`; }
export function productSummary(order) { return order.items.map(i => `${i.brand} ${i.model} T${i.size} ×${i.qty}`).join(', '); }
export function courierName(couriers, id) { return couriers.find(c=>c.id===id)?.name || 'Sin asignar'; }
export async function confirmAction(title, text) {
  return Swal.fire({ icon:'question', title, text, showCancelButton:true, confirmButtonText:'Confirmar', cancelButtonText:'Cancelar', reverseButtons:true });
}
export function success(title, text='') { return Swal.fire({ icon:'success', title, text, confirmButtonText:'Aceptar' }); }
export function error(title, text='') { return Swal.fire({ icon:'error', title, text, confirmButtonText:'Aceptar' }); }
export function toast(icon, title) { return Swal.fire({ toast:true, position:'top-end', icon, title, showConfirmButton:false, timer:2200, timerProgressBar:true }); }
