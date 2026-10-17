import { Link, NavLink, useNavigate } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTienda } from '../context/TiendaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { resumenCarrito } from '../store/TiendaVergataria.js';

export default function Header() {
  const { estado } = useTienda();
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const { unidades } = resumenCarrito(estado);

  function salir() {
    cerrarSesion();
    navigate('/', { replace: true });
  }

  return (
    <header>
      <Navbar
        expand="lg"
        variant="dark"
        className="cabecera-nav"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span aria-hidden="true">🎸</span> SonidosVergatarios
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="menu-principal"
            label="Abrir navegación"
          />
          <Navbar.Collapse id="menu-principal">
            <Nav className="me-auto" aria-label="Navegación principal">
              <Nav.Link as={NavLink} to="/" end>
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/productos">
                Productos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">
                Contacto
              </Nav.Link>
            </Nav>
            <Nav className="align-items-lg-center">
              <Nav.Link
                as={NavLink}
                to="/carrito"
                aria-label={`Carrito (${unidades})`}
              >
                <span aria-hidden="true">🛒</span> Carrito{' '}
                <Badge bg="warning" text="dark" pill aria-hidden="true">
                  {unidades}
                </Badge>
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin">
                Admin
              </Nav.Link>
              {sesion ? (
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-lg-2"
                  onClick={salir}
                >
                  Cerrar sesión
                </Button>
              ) : (
                <Nav.Link as={NavLink} to="/login">
                  Ingresar
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
