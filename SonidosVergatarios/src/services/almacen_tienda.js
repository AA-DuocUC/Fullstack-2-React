import { productosIniciales } from '../data/productosIniciales.js';
import { crearEstado } from '../store/TiendaVergataria.js';
 
export const CLAVES = {
  tienda: 'SonidosVergatarios-react-tienda-v2',
  sesion: 'SonidosVergatarios-react-sesion',
  usuarios: 'SonidosVergatarios-react-usuarios',
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

function usuarioValido(u) {
  return (
    u &&
    typeof u.usuario === 'string' &&
    u.usuario.trim() !== '' &&
    typeof u.email === 'string' &&
    typeof u.sal === 'string' &&
    typeof u.clave === 'string'
  );
}

export function cargarUsuarios() {
  const guardados = leerJSON(CLAVES.usuarios, []);
  if (!Array.isArray(guardados)) return [];
  const vistos = new Set();
  return guardados.filter((u) => {
    const clave = usuarioValido(u) ? u.usuario.trim().toLowerCase() : null;
    if (!clave || vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
}

export function guardarUsuarios(usuarios) {
  try {
    localStorage.setItem(CLAVES.usuarios, JSON.stringify(usuarios));
    return true;
  } catch {
    return false;
  }
}

export function cargarSesion() {
  const valor = leerJSON(CLAVES.sesion, null);
  if (valor?.rol === 'admin' && valor?.usuario === 'admin') return valor;
  // Una sesión de cliente solo es válida si esa cuenta todavía existe.
  if (
    valor?.rol === 'cliente' &&
    typeof valor.usuario === 'string' &&
    cargarUsuarios().some((u) => u.usuario === valor.usuario)
  )
    return valor;
  return null;
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
