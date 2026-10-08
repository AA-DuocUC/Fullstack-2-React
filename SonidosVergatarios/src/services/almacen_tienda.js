import { productosIniciales } from '../data/productosIniciales.js';
import { crearEstado } from '../store/TiendaVergataria.js';
 
export const CLAVES = {
  tienda: 'SonidosVergatarios-react-tienda-v2',
  sesion: 'SonidosVergatarios-react-sesion',
};
export function leerJSON(clave, alternativa) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? alternativa : JSON.parse(valor);
  } catch {
    return alternativa;
  }
}
 
function productoValido(p) {
  return (
    p &&
    Number.isInteger(p.id) &&
    p.id > 0 &&
    typeof p.nombre === 'string' &&
    typeof p.categoria === 'string' &&
    typeof p.imagen === 'string' &&
    Number.isFinite(p.precio) &&
    p.precio > 0 &&
    Number.isInteger(p.stock) &&
    p.stock >= 0
  );
}
 
export function cargarTienda() {
  const guardado = leerJSON(CLAVES.tienda, null);
  // Recupera también el trabajo guardado por la primera versión React.
  const candidatos =
    guardado?.productos ??
    leerJSON('SonidosVergatarios-react-productos', productosIniciales);
  const productos =
    Array.isArray(candidatos) &&
    candidatos.every(productoValido) &&
    new Set(candidatos.map((p) => p.id)).size === candidatos.length
      ? candidatos
      : productosIniciales.map((p) => ({ ...p }));
  const candidatosCarrito =
    guardado?.carrito ?? leerJSON('SonidosVergatarios-react-carrito', []);
  const ids = new Set();
  const carrito = (Array.isArray(candidatosCarrito) ? candidatosCarrito : [])
    .filter((item) => {
      const valido =
        item &&
        Number.isInteger(item.id) &&
        !ids.has(item.id) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        productos.some((p) => p.id === item.id);
      if (valido) ids.add(item.id);
      return valido;
    })
    .map((item) => ({ id: item.id, cantidad: item.cantidad }));
  return crearEstado(productos, carrito);
}
 
export function guardarTienda(estado) {
  try {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: estado.productos, carrito: estado.carrito }),
    );
    return true;
  } catch {
    return false;
  }
}
export function cargarSesion() {
  const valor = leerJSON(CLAVES.sesion, null);
  return valor?.usuario === 'admin' && valor?.rol === 'admin' ? valor : null;
}
export function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(CLAVES.sesion, JSON.stringify(sesion));
    else localStorage.removeItem(CLAVES.sesion);
    return true;
  } catch {
    return false;
  }
}