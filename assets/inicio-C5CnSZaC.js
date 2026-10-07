import{a as e,c as t,d as n,h as r,l as i,o as a,s as o,t as s,v as c}from"./app-ik39gZbn.js";o(`inicio`,`Dashboard operativo`,`Resumen del flujo de Gestión y Despacho de Pedidos Online`,`<button class="btn btn-outline-secondary btn-sm" id="btnReset"><i class="bi bi-arrow-counterclockwise me-1"></i>Restablecer demo</button>`);function l(){let n=c(),i=r().filter(e=>e.stock<=e.min).length,o=n.filter(e=>[`Asignado`,`Recogido`,`En ruta`].includes(e.status)).length,s=n.filter(e=>e.status===`Entregado`).length,l=document.getElementById(`page-content`);l.innerHTML=`
    <div class="row g-3 mb-4">
      ${u(`bi-bag-check`,`Pedidos`,n.length)}
      ${u(`bi-exclamation-triangle`,`Stock bajo`,i)}
      ${u(`bi-truck`,`En distribución`,o)}
      ${u(`bi-check-circle`,`Entregados`,s)}
    </div>
    <div class="card-clean overflow-hidden">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div><h2 class="section-title">Pedidos recientes</h2><div class="muted small">Información centralizada del proceso</div></div>
        <a class="btn btn-primary btn-sm" href="pedidos.html">Ver todos</a>
      </div>
      <div class="table-responsive"><table class="table table-modern align-middle"><thead><tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Actualización</th></tr></thead><tbody>
        ${n.slice(0,6).map(n=>`<tr><td class="fw-bold">${n.code}</td><td>${n.customer}</td><td>${a(n)}</td><td>${t(n.status)}</td><td>${e(n.updatedAt)}</td></tr>`).join(``)}
      </tbody></table></div>
    </div>`}function u(e,t,n){return`<div class="col-12 col-sm-6 col-xl-3"><div class="card-clean stat-card d-flex align-items-center gap-3"><div class="stat-icon"><i class="bi ${e}"></i></div><div><div class="stat-value">${n}</div><div class="stat-label">${t}</div></div></div></div>`}l(),document.getElementById(`btnReset`).addEventListener(`click`,async()=>{(await s(`¿Restablecer datos?`,`Se recuperarán los datos iniciales del prototipo.`)).isConfirmed&&(n(),l(),i(`Datos restablecidos`))});