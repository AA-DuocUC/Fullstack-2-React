import { convertirProducto, validarProducto } from '../utils/validaciones.js';
 
export const COSTO_ENVIO = 3990;
export function crearEstado(productos, carrito = []) {
  return { productos, carrito, aviso: null };
}
 
export function detalleCarrito(estado) {
  return estado.carrito
    .map((item) => {
      const producto = estado.productos.find((p) => p.id === item.id);
      return producto ? { ...producto, cantidad: item.cantidad } : null;
    })
    .filter(Boolean);
}
 
export function resumenCarrito(estado) {
  const detalle = detalleCarrito(estado);
  const subtotal = detalle.reduce(
    (total, p) => total + p.precio * p.cantidad,
    0,
  );
  const envio = detalle.length ? COSTO_ENVIO : 0;
  const unidades = detalle.reduce((total, p) => total + p.cantidad, 0);
  return { subtotal, envio, unidades, total: subtotal + envio };
}
 
function conAviso(estado, texto, tipo = 'success') {
  return { ...estado, aviso: { texto, tipo } };
}
 
// Función pura: calcula el siguiente estado sin tocar DOM ni localStorage.
export function tiendaReducer(estado, accion) {
  switch (accion.type) {
    case 'AGREGAR': {
      const producto = estado.productos.find((p) => p.id === accion.id);
      const item = estado.carrito.find((i) => i.id === accion.id);
      if (!producto || (item?.cantidad ?? 0) >= producto.stock)
        return conAviso(
          estado,
          'No hay más stock disponible de ese producto.',
          'warning',
        );
      const carrito = item
        ? estado.carrito.map((i) =>
            i.id === accion.id ? { ...i, cantidad: i.cantidad + 1 } : i,
          )
        : [...estado.carrito, { id: accion.id, cantidad: 1 }];
      return conAviso(
        { ...estado, carrito },
        `${producto.nombre} agregado al carrito.`,
      );
    }
    case 'CANTIDAD': {
      const producto = estado.productos.find((p) => p.id === accion.id);
      if (
        !producto ||
        !Number.isInteger(accion.cantidad) ||
        accion.cantidad < 0 ||
        accion.cantidad > producto.stock
      )
        return conAviso(
          estado,
          'La cantidad debe ser un entero y no superar el stock.',
          'warning',
        );
      const carrito = estado.carrito
        .map((i) =>
          i.id === accion.id ? { ...i, cantidad: accion.cantidad } : i,
        )
        .filter((i) => i.cantidad > 0);
      return { ...estado, carrito, aviso: null };
    }
    case 'QUITAR':
      return conAviso(
        {
          ...estado,
          carrito: estado.carrito.filter((i) => i.id !== accion.id),
        },
        'Producto retirado del carrito.',
        'info',
      );
    case 'VACIAR':
      return conAviso(
        { ...estado, carrito: [] },
        'El carrito quedó vacío.',
        'info',
      );
    case 'COMPRAR': {
      if (!estado.carrito.length)
        return conAviso(estado, 'El carrito está vacío.', 'warning');
      const valido = estado.carrito.every((item) => {
        const producto = estado.productos.find((p) => p.id === item.id);
        return (
          producto &&
          Number.isInteger(item.cantidad) &&
          item.cantidad > 0 &&
          item.cantidad <= producto.stock
        );
      });
      if (!valido)
        return conAviso(
          estado,
          'El stock cambió. Revisa las cantidades antes de comprar.',
          'danger',
        );
      const productos = estado.productos.map((p) => ({
        ...p,
        stock:
          p.stock - (estado.carrito.find((i) => i.id === p.id)?.cantidad ?? 0),
      }));
      return conAviso(
        { ...estado, productos, carrito: [] },
        'Compra simulada completada. Stock actualizado.',
      );
    }
    case 'GUARDAR_PRODUCTO': {
      if (
        Object.keys(validarProducto(accion.datos, estado.productos, accion.id))
          .length
      )
        return conAviso(estado, 'Revisa los datos del producto.', 'danger');
      const datos = convertirProducto(accion.datos);
      if (
        accion.id !== null &&
        !estado.productos.some((p) => p.id === accion.id)
      )
        return conAviso(estado, 'El producto ya no existe.', 'warning');
      const nuevoId = estado.productos.length
        ? Math.max(...estado.productos.map((p) => p.id)) + 1
        : 1;
      const productos =
        accion.id === null
          ? [...estado.productos, { ...datos, id: nuevoId }]
          : estado.productos.map((p) =>
              p.id === accion.id ? { ...p, ...datos } : p,
            );
      return conAviso(
        { ...estado, productos },
        accion.id === null ? 'Producto creado.' : 'Producto actualizado.',
      );
    }
    case 'ELIMINAR_PRODUCTO':
      return conAviso(
        {
          ...estado,
          productos: estado.productos.filter((p) => p.id !== accion.id),
          carrito: estado.carrito.filter((i) => i.id !== accion.id),
        },
        'Producto eliminado del catálogo y del carrito.',
        'info',
      );
    case 'CERRAR_AVISO':
      return { ...estado, aviso: null };
    default:
      return estado;
  }
}