import { renderLayout, escapeHtml } from './app.js';
import { getInventory } from './storage.js';

renderLayout('inventario','Inventario','Consulta de stock por producto, modelo y talla con alertas de stock bajo');
document.getElementById('page-content').innerHTML=`<div class="card-clean p-3 mb-3"><input id="search" class="form-control" placeholder="Buscar por SKU, marca, modelo o talla"></div><div class="card-clean overflow-hidden"><div class="table-responsive"><table class="table table-modern"><thead><tr><th>SKU</th><th>Marca / Modelo</th><th>Talla</th><th>Stock</th><th>Mínimo</th><th>Estado</th></tr></thead><tbody id="rows"></tbody></table></div></div>`;
const search=document.getElementById('search'); const rows=document.getElementById('rows');
function render(){const q=search.value.toLowerCase();const data=getInventory().filter(i=>[i.sku,i.brand,i.model,i.size].join(' ').toLowerCase().includes(q));rows.innerHTML=data.map(i=>{const low=i.stock<=i.min;return `<tr><td class="fw-bold">${i.sku}</td><td>${escapeHtml(i.brand)} ${escapeHtml(i.model)}</td><td>${i.size}</td><td class="${low?'stock-low':'stock-ok'}">${i.stock}</td><td>${i.min}</td><td>${low?'<span class="badge-soft badge-incidencia"><i class="bi bi-exclamation-triangle me-1"></i>Stock bajo</span>':'<span class="badge-soft badge-entregado">Disponible</span>'}</td></tr>`}).join('');}
search.addEventListener('input',render); render();
