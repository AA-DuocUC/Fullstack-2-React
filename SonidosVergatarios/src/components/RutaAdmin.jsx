import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import AccesoRestringido from '../pages/AccesoRestringido.jsx';

export default function RutaAdmin() {
  const { sesion } = useAuth();
  const location = useLocation();
  if (sesion?.rol === 'admin') return <Outlet />;
  // Un cliente con sesión no debe ver el panel, pero tampoco tiene sentido
  // enviarlo al login: se le explica que no tiene permiso.
  if (sesion) return <AccesoRestringido />;
  return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
}
