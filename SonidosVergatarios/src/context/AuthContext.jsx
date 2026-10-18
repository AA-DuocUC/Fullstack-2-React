import { createContext, useContext, useEffect, useState } from 'react';
import {
  cargarSesion,
  guardarSesion,
  cargarUsuarios,
  guardarUsuarios,
} from '../services/almacen_tienda.js';
import { validarRegistro } from '../utils/validaciones.js';
import { crearSal, hashClave } from '../utils/claves.js';
import { normalizar } from '../utils/formato.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(cargarUsuarios);
  const [sesion, setSesion] = useState(cargarSesion);
  const [errorGuardado, setErrorGuardado] = useState(false);

  useEffect(() => {
    const sesionGuardada = guardarSesion(sesion);
    const usuariosGuardados = guardarUsuarios(usuarios);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrorGuardado(!(sesionGuardada && usuariosGuardados));
  }, [sesion, usuarios]);

  // Crea una cuenta de cliente. No inicia sesión: el cliente ingresa después.
  function registrar(datos) {
    const errores = validarRegistro(datos, usuarios);
    if (Object.keys(errores).length) return { ok: false, errores };
    const sal = crearSal();
    setUsuarios((actuales) => [
      ...actuales,
      {
        id: actuales.reduce((mayor, u) => Math.max(mayor, u.id ?? 0), 0) + 1,
        usuario: datos.usuario.trim(),
        email: datos.email.trim().toLowerCase(),
        sal,
        clave: hashClave(datos.contrasena, sal),
      },
    ]);
    return { ok: true };
  }

  // Acepta correo o nombre de usuario.
  function ingresarCliente(identificador, contrasena) {
    const buscado = normalizar(identificador);
    const cuenta = usuarios.find(
      (u) => normalizar(u.usuario) === buscado || normalizar(u.email) === buscado,
    );
    if (!cuenta || cuenta.clave !== hashClave(contrasena, cuenta.sal))
      return false;
    setSesion({
      nombre: cuenta.usuario,
      usuario: cuenta.usuario,
      email: cuenta.email,
      rol: 'cliente',
      logueado: true,
    });
    return true;
  }

  function ingresarAdmin(usuario, contrasena) {
    if (usuario.trim() !== 'admin' || contrasena !== '1234') return false;
    setSesion({
      nombre: 'Administrador',
      usuario: 'admin',
      rol: 'admin',
      logueado: true,
    });
    return true;
  }

  const cerrarSesion = () => setSesion(null);

  return (
    <AuthContext.Provider
      value={{
        sesion,
        registrar,
        ingresarCliente,
        ingresarAdmin,
        cerrarSesion,
        errorGuardado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return contexto;
}
