import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CarruselProductos from '../components/CarruselProductos.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const accesosBase = [
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
];

// La tercera tarjeta depende de quién esté mirando la página.
function tercerAcceso(sesion) {
  if (sesion?.rol === 'admin')
    return {
      titulo: 'Administrar',
      texto: 'Crea, edita y elimina productos en el panel de administración.',
      ruta: '/admin',
      boton: 'Ir al panel',
    };
  if (sesion)
    return {
      titulo: 'Contacto',
      texto: '¿Dudas sobre un instrumento? Escríbenos y te ayudamos.',
      ruta: '/contacto',
      boton: 'Escribir mensaje',
    };
  return {
    titulo: 'Tu cuenta',
    texto: 'Inicia sesión o crea una cuenta para comprar y recibir novedades.',
    ruta: '/login',
    boton: 'Ingresar',
  };
}

export default function Inicio() {
  const { sesion } = useAuth();
  const accesos = [...accesosBase, tercerAcceso(sesion)];
  return (
    <>
      <section className="hero py-5">
        <Container className="py-4">
          <h1 className="display-5 fw-bold">
            {sesion ? (
              <>
                Bienvenido{' '}
                <span className="usuario-bienvenida">@{sesion.nombre}</span>
              </>
            ) : (
              'Bienvenido a SonidosVergatarios'
            )}
          </h1>
          <p className="lead">
            {sesion?.rol === 'admin'
              ? 'Estás en modo administrador: gestiona el catálogo desde el panel.'
              : sesion
                ? 'Qué bueno verte de nuevo. Encuentra tu próximo instrumento.'
                : 'Tu tienda de productos musicales favorita y vergataria.'}
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
