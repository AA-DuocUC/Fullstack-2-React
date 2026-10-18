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
  const producto = {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen.trim(),
  };
  // Marca y descripción son opcionales: solo se incluyen si el formulario las envía.
  if (typeof datos.marca === 'string') producto.marca = datos.marca.trim();
  if (typeof datos.descripcion === 'string')
    producto.descripcion = datos.descripcion.trim();
  return producto;
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

const USUARIO_VALIDO = /^[a-zA-Z0-9._-]{3,20}$/;
const EMAIL_VALIDO = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USUARIOS_RESERVADOS = ['admin', 'administrador', 'root'];

export function validarRegistro(datos, usuarios = []) {
  const errores = {};
  const usuario = datos.usuario.trim();
  if (!USUARIO_VALIDO.test(usuario))
    errores.usuario =
      'Usa de 3 a 20 caracteres: letras, números, punto, guion o guion bajo.';
  else if (
    USUARIOS_RESERVADOS.includes(normalizar(usuario)) ||
    usuarios.some((u) => normalizar(u.usuario) === normalizar(usuario))
  )
    errores.usuario = 'Ese nombre de usuario no está disponible.';

  const email = datos.email.trim();
  if (!EMAIL_VALIDO.test(email))
    errores.email = 'Ingresa un correo electrónico válido.';
  else if (usuarios.some((u) => normalizar(u.email) === normalizar(email)))
    errores.email = 'Ya existe una cuenta con ese correo.';

  const clave = datos.contrasena;
  if (
    clave.length < 8 ||
    clave.length > 64 ||
    !/[A-Za-z]/.test(clave) ||
    !/\d/.test(clave)
  )
    errores.contrasena =
      'Usa de 8 a 64 caracteres, con al menos una letra y un número.';

  if (datos.confirmar !== clave)
    errores.confirmar = 'Las contraseñas no coinciden.';
  return errores;
}

export function validarLoginCliente(campos) {
  const errores = {};
  if (!campos.identificador.trim())
    errores.identificador = 'Ingresa tu correo o nombre de usuario.';
  if (!campos.contrasena) errores.contrasena = 'Ingresa tu contraseña.';
  return errores;
}

export function validarLoginAdmin(campos) {
  const errores = {};
  if (!campos.usuario.trim()) errores.usuario = 'Ingresa el usuario.';
  if (!campos.contrasena) errores.contrasena = 'Ingresa la contraseña.';
  return errores;
}
