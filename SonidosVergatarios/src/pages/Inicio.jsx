import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import CarruselProductos from '../components/CarruselProductos.jsx';

export default function Inicio() {
  return (
    <>
      <section className="hero py-5">
        <Container className="py-4">
          <h1 className="display-5 fw-bold">Bienvenido a SonidosVergatarios</h1>
          <p className="lead">Tu tienda de productos musicales favorita y vergataria.</p>

        </Container>
      </section>

      <Container as="section" className="py-5" aria-labelledby="titulo-destacados">
        <h2 id="titulo-destacados" className="text-center mb-4">Productos destacados</h2>
        <CarruselProductos />
          <Button as={Link} to="/productos" variant="warning" size="lg">
            Explorar productos
          </Button>
      </Container>
    </>
  );
}