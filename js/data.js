import {
  KEYS, saveOrders, saveInventory, saveCouriers, saveNotifications, clearDemoStorage
} from './storage.js';

const now = () => new Date().toISOString();

export const demoInventory = [
  { sku:'NK-AM-42', brand:'Nike', model:'Air Max', size:42, stock:8, min:3 },
  { sku:'AD-FR-41', brand:'Adidas', model:'Forum', size:41, stock:2, min:3 },
  { sku:'VN-OS-40', brand:'Vans', model:'Old Skool', size:40, stock:12, min:3 },
  { sku:'CV-CH-39', brand:'Converse', model:'Chuck Taylor', size:39, stock:4, min:2 },
  { sku:'NB-574-42', brand:'New Balance', model:'574', size:42, stock:6, min:3 }
];

export const demoCouriers = [
  { id:'COU-01', name:'Diego Salazar', company:'Nudo Express', phone:'999 120 101' },
  { id:'COU-02', name:'María Torres', company:'RapidGo', phone:'999 120 102' },
  { id:'COU-03', name:'Luis Ramos', company:'Lima Courier', phone:'999 120 103' }
];

export const demoOrders = [
  {
    code:'PED-1001', customer:'Carlos Pérez', email:'carlos.perez@demo.pe', phone:'987654321',
    address:'Av. Javier Prado 1234', district:'San Isidro', status:'Confirmado', courierId:null, guide:null,
    createdAt:'2026-10-07T09:05:00-05:00', updatedAt:'2026-10-07T09:05:00-05:00',
    items:[{ sku:'NK-AM-42', brand:'Nike', model:'Air Max', size:42, qty:1 }],
    history:[{ status:'Confirmado', detail:'Pedido recibido automáticamente desde la tienda web.', at:'2026-10-07T09:05:00-05:00' }]
  },
  {
    code:'PED-1002', customer:'Andrea Gómez', email:'andrea.gomez@demo.pe', phone:'986111222',
    address:'Av. Brasil 820', district:'Pueblo Libre', status:'Confirmado', courierId:null, guide:null,
    createdAt:'2026-10-07T09:32:00-05:00', updatedAt:'2026-10-07T09:32:00-05:00',
    items:[{ sku:'AD-FR-41', brand:'Adidas', model:'Forum', size:41, qty:1 }],
    history:[{ status:'Confirmado', detail:'Pedido recibido automáticamente desde la tienda web.', at:'2026-10-07T09:32:00-05:00' }]
  },
  {
    code:'PED-1003', customer:'José Medina', email:'jose.medina@demo.pe', phone:'985333444',
    address:'Jr. Las Flores 350', district:'Surco', status:'Preparado', courierId:null, guide:null,
    createdAt:'2026-10-07T08:10:00-05:00', updatedAt:'2026-10-07T10:15:00-05:00', stockDiscounted:true,
    items:[{ sku:'VN-OS-40', brand:'Vans', model:'Old Skool', size:40, qty:1 }],
    history:[
      { status:'Confirmado', detail:'Pedido recibido desde la tienda web.', at:'2026-10-07T08:10:00-05:00' },
      { status:'Preparado', detail:'Picking confirmado por almacén.', at:'2026-10-07T10:15:00-05:00' }
    ]
  },
  {
    code:'PED-1004', customer:'Sofía León', email:'sofia.leon@demo.pe', phone:'984555666',
    address:'Calle Los Cedros 455', district:'Miraflores', status:'Asignado', courierId:'COU-01', guide:'GD-1004',
    createdAt:'2026-10-06T15:20:00-05:00', updatedAt:'2026-10-07T10:25:00-05:00', stockDiscounted:true,
    items:[{ sku:'CV-CH-39', brand:'Converse', model:'Chuck Taylor', size:39, qty:1 }],
    history:[
      { status:'Confirmado', detail:'Pedido recibido desde la tienda web.', at:'2026-10-06T15:20:00-05:00' },
      { status:'Preparado', detail:'Picking confirmado.', at:'2026-10-07T08:30:00-05:00' },
      { status:'Guía generada', detail:'Guía GD-1004 generada.', at:'2026-10-07T09:40:00-05:00' },
      { status:'Asignado', detail:'Pedido asignado a Nudo Express.', at:'2026-10-07T10:25:00-05:00' }
    ]
  },
  {
    code:'PED-1005', customer:'Miguel Ruiz', email:'miguel.ruiz@demo.pe', phone:'983777888',
    address:'Av. Arequipa 2450', district:'Lince', status:'En ruta', courierId:'COU-02', guide:'GD-1005',
    createdAt:'2026-10-06T11:00:00-05:00', updatedAt:'2026-10-07T11:20:00-05:00', stockDiscounted:true,
    items:[{ sku:'NB-574-42', brand:'New Balance', model:'574', size:42, qty:1 }],
    history:[
      { status:'Confirmado', detail:'Pedido recibido desde la tienda web.', at:'2026-10-06T11:00:00-05:00' },
      { status:'Preparado', detail:'Picking confirmado.', at:'2026-10-06T15:10:00-05:00' },
      { status:'Guía generada', detail:'Guía GD-1005 generada.', at:'2026-10-06T16:05:00-05:00' },
      { status:'Asignado', detail:'Pedido asignado a RapidGo.', at:'2026-10-07T08:15:00-05:00' },
      { status:'Recogido', detail:'Courier recogió el pedido.', at:'2026-10-07T10:00:00-05:00' },
      { status:'En ruta', detail:'Pedido en ruta al cliente.', at:'2026-10-07T11:20:00-05:00' }
    ]
  }
];

export function initDemoData() {
  if (!localStorage.getItem(KEYS.orders)) saveOrders(demoOrders);
  if (!localStorage.getItem(KEYS.inventory)) saveInventory(demoInventory);
  if (!localStorage.getItem(KEYS.couriers)) saveCouriers(demoCouriers);
  if (!localStorage.getItem(KEYS.notifications)) saveNotifications([]);
}

export function resetDemoData() {
  clearDemoStorage();
  saveOrders(demoOrders);
  saveInventory(demoInventory);
  saveCouriers(demoCouriers);
  saveNotifications([]);
}
