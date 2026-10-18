import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';

export default function AccesoRestringido() {
  return (
    <Container as="section" className="py-5">
      <h1>Acceso restringido</h1>
      <p>
        Esta sección es solo para administradores. Tu cuenta de cliente puede
        comprar y revisar el catálogo, pero no gestionar productos.
      </p>
      <Link to="/">Volver al inicio</Link>
    </Container>
  );
}
