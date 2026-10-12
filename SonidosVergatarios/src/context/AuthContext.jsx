import { createContext, useContext, useEffect, useState } from 'react';
import { cargarSesion, guardarSesion } from '../services/almacen_tienda.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(cargarSesion);
  const [errorGuardado, setErrorGuardado] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrorGuardado(!guardarSesion(sesion));
  }, [sesion]);
  function ingresar(usuario, contrasena) {
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
      value={{ sesion, ingresar, cerrarSesion, errorGuardado }}
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
