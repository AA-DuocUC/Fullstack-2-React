import { normalizar } from './formato.js';
 
export function validarProducto(datos, productos, id = null) {
  const errores = {};
  if (datos.nombre.trim().length < 3)
    errores.nombre = 'Ingresa al menos 3 caracteres.';
  else if (
    productos.some(
      (p) => p.id !== id && normalizar(p.nombre) === normalizar(datos.nombre),
    )
  )
    errores.nombre = 'Ya existe un producto con ese nombre.';
  if (datos.categoria.trim().length < 3)
    errores.categoria = 'Ingresa al menos 3 caracteres.';
  if (
    String(datos.precio).trim() === '' ||
    !Number.isFinite(Number(datos.precio)) ||
    Number(datos.precio) <= 0
  )
    errores.precio = 'El precio debe ser mayor que cero.';
  if (
    String(datos.stock).trim() === '' ||
    !Number.isInteger(Number(datos.stock)) ||
    Number(datos.stock) < 0
  )
    errores.stock = 'El stock debe ser un entero mayor o igual a cero.';
  try {
    if (!['http:', 'https:'].includes(new URL(datos.imagen.trim()).protocol))
      throw new Error();
  } catch {
    errores.imagen = 'Ingresa una URL de imagen http o https.';
  }
  return errores;
}
 
export function convertirProducto(datos) {
  return {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen.trim(),
  };
}
 
export function validarContacto(campos) {
  const errores = {};
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      campos.email.trim(),
    )
  )
    errores.email = 'Ingresa un correo electrónico válido.';
  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'-]{5,100}$/.test(campos.asunto.trim()))
    errores.asunto = 'El asunto debe tener entre 5 y 100 caracteres válidos.';
  if (
    !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'"\-():;]{10,500}$/.test(
      campos.mensaje.trim(),
    )
  )
    errores.mensaje =
      'El mensaje debe tener entre 10 y 500 caracteres válidos.';
  return errores;
}