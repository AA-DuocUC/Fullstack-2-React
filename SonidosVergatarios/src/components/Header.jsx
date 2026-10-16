import { NavLink, useNavigate } from 'react-router';
import { useTienda } from '../context/TiendaContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { carrito } = useTienda();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <NavLink className="navbar-brand fw-bold text-light" to="/">
        🎸 SonidosVergatarios
      </NavLink>
      
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">Inicio</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/productos">Productos</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
          </li>
          {usuario?.rol === 'admin' && (
            <li className="nav-item">
              <NavLink className="nav-link text-warning fw-bold" to="/admin">
                ⚙️ Panel Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="d-flex align-items-center gap-3">
          <NavLink className="btn btn-outline-light" to="/carrito">
            🛒 Carrito <span className="badge bg-warning text-dark">{totalItems}</span>
          </NavLink>

          {usuario ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-light small">Hola, <strong>{usuario.nombre || 'Admin'}</strong></span>
              <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <NavLink className="btn btn-sm btn-primary" to="/login">
              🔑 Ingresar
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}