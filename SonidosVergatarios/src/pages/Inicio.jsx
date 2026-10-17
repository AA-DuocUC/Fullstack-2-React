import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CarruselProductos from '../components/CarruselProductos.jsx';

const accesos = [
  {
    titulo: 'Explorar',
    texto:
      'Busca y filtra guitarras, bajos, baterías y teclados por categoría, precio y disponibilidad.',
    ruta: '/productos',
    boton: 'Ver productos',
  },
  {
    titulo: 'Comprar',
    texto: 'Agrega instrumentos al carrito y controla cantidades y stock.',
    ruta: '/carrito',
    boton: 'Ir al carrito',
  },
  {
    titulo: 'Administrar',
    texto: 'Crea, edita y elimina productos en el panel de administración.',
    ruta: '/admin',
    boton: 'Acceso admin',
  },
];

export default function Inicio() {
  return (
    <>
      <section className="hero py-5">
        <Container className="py-4">
          <h1 className="display-5 fw-bold">Bienvenido a SonidosVergatarios</h1>
          <p className="lead">
            Tu tienda de productos musicales favorita y vergataria.
          </p>
        </Container>
      </section>

      <Container
        as="section"
        className="py-5"
        aria-labelledby="titulo-destacados"
      >
        <h2 id="titulo-destacados" className="text-center mb-4">
          Productos destacados
        </h2>
        <CarruselProductos />
        <div className="text-center mt-4">
          <Button as={Link} to="/productos" variant="warning" size="lg">
            Explorar productos
          </Button>
        </div>
      </Container>

      <Container as="section" className="pb-5" aria-labelledby="titulo-accesos">
        <h2 id="titulo-accesos" className="text-center mb-4">
          ¿Qué quieres hacer hoy?
        </h2>
        <Row className="g-4">
          {accesos.map((a) => (
            <Col md={4} key={a.ruta}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h3 className="h5">{a.titulo}</h3>
                  <p>{a.texto}</p>
                  <Button as={Link} to={a.ruta} variant="outline-primary">
                    {a.boton}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
