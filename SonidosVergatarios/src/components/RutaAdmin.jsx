import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function RutaAdmin() {
  const { sesion } = useAuth();
  const location = useLocation();
  return sesion?.rol === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ desde: location.pathname }} />
  );
}
