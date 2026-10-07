const KEYS = {
  orders: 'nudo_orders_v1',
  inventory: 'nudo_inventory_v1',
  couriers: 'nudo_couriers_v1',
  notifications: 'nudo_notifications_v1'
};

function read(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); return value; }

export const getOrders = () => read(KEYS.orders, []);
export const saveOrders = orders => write(KEYS.orders, orders);
export const getInventory = () => read(KEYS.inventory, []);
export const saveInventory = items => write(KEYS.inventory, items);
export const getCouriers = () => read(KEYS.couriers, []);
export const saveCouriers = items => write(KEYS.couriers, items);
export const getNotifications = () => read(KEYS.notifications, []);
export const saveNotifications = items => write(KEYS.notifications, items);

export function getOrder(code) { return getOrders().find(o => o.code === code); }
export function upsertOrder(order) {
  const orders = getOrders();
  const i = orders.findIndex(o => o.code === order.code);
  if (i >= 0) orders[i] = order; else orders.unshift(order);
  saveOrders(orders);
  return order;
}
export function updateOrder(code, updater) {
  const order = getOrder(code);
  if (!order) return null;
  const updated = updater(structuredClone(order)) || order;
  updated.updatedAt = new Date().toISOString();
  return upsertOrder(updated);
}
export function addHistory(order, status, detail = '') {
  order.history ||= [];
  order.history.push({ status, detail, at: new Date().toISOString() });
  order.status = status;
  return order;
}
export function addNotification({ orderCode, email, status, message }) {
  const list = getNotifications();
  list.unshift({
    id: `NTF-${Date.now()}`,
    orderCode,
    email,
    status,
    message,
    sentAt: new Date().toISOString()
  });
  saveNotifications(list);
}
export function clearDemoStorage() { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); }
export { KEYS };
