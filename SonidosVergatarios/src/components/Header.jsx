import { Container, Nav, Navbar, Badge } from 'react-bootstrap';

export default function Header({ cantidad = 0, ruta = '#/' }) {
    return (
        <header>
            <Navbar expand="lg" variant="dark" className="cabecera-nav" aria-label="Navegación principal">
                <Container>
                    <Navbar.Brand href="#/">🎸 SonidosVergatarios</Navbar.Brand>
                    <Navbar.Toggle aria-controls="menu-principal" />
                    <Navbar.Collapse id="menu-principal">
                        <Nav className="me-auto" activeKey={ruta}>
                            <Nav.Link href="#/" eventKey="#/">Inicio</Nav.Link>
                            <Nav.Link href="#/productos" eventKey="#/productos">Productos</Nav.Link>
                            <Nav.Link href="#/contacto" eventKey="#/contacto">Contacto</Nav.Link>
                        </Nav>
                        <Nav activeKey={ruta}>
                            <Nav.Link href="#/carrito" eventKey="#/carrito">
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