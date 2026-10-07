import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(process.cwd(), 'index.html'),
        pedidos: resolve(process.cwd(), 'pedidos.html'),
        picking: resolve(process.cwd(), 'picking.html'),
        inventario: resolve(process.cwd(), 'inventario.html'),
        despacho: resolve(process.cwd(), 'despacho.html'),
        courier: resolve(process.cwd(), 'courier.html'),
        seguimiento: resolve(process.cwd(), 'seguimiento.html')
      }
    }
  }
});
