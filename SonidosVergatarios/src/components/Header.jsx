import { Container, Nav, Navbar, Badge } from 'react-bootstrap';
import { Link, NavLink } from 'react-router';

export default function Header({ cantidad = 0 }) {
    return (
        <header>
            <Navbar expand="lg" variant="dark" className="cabecera-nav" aria-label="Navegación principal">
                <Container>
                    <Navbar.Brand as={Link} to="/">🎸 SonidosVergatarios</Navbar.Brand>
                    <Navbar.Toggle aria-controls="menu-principal" />
                    <Navbar.Collapse id="menu-principal">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
                            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
                            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link as={NavLink} to="/carrito">
                                🛒 Carrito{' '}
                                <Badge bg="warning" text="dark" pill>{cantidad}</Badge>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}