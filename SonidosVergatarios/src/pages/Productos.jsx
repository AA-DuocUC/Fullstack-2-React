import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ProductoCard from '../components/ProductoCard.jsx';
import { normalizar } from '../utils/formato.js';
import { useTienda } from '../context/TiendaContext.jsx';
 
export default function Productos() {
  const { estado, dispatch } = useTienda();
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [maximo, setMaximo] = useState('');
  const categorias = [
    ...new Set(estado.productos.map((p) => p.categoria)),
  ].sort();
  const visibles = estado.productos.filter(
    (p) =>
      normalizar(p.nombre).includes(normalizar(texto)) &&
      (!categoria || p.categoria === categoria) &&
      (!disponibilidad ||
        (disponibilidad === 'disponible' ? p.stock > 0 : p.stock === 0)) &&
      (maximo === '' || p.precio <= Number(maximo)),
  );
  function limpiar() {
    setTexto('');
    setCategoria('');
    setDisponibilidad('');
    setMaximo('');
  }
  return (
    <Container as="section" className="py-4">
      <h1>Catálogo de productos</h1>
      <Row className="g-3 align-items-end mb-4">
        <Col sm={6} lg={3}>
          <Form.Group controlId="buscar">
            <Form.Label>Buscar producto</Form.Label>
            <Form.Control
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Nombre"
            />
          </Form.Group>
        </Col>
        <Col sm={6} lg={3}>
          <Form.Group controlId="categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Group controlId="disponibilidad">
            <Form.Label>Disponibilidad</Form.Label>
            <Form.Select
              value={disponibilidad}
              onChange={(e) => setDisponibilidad(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="agotado">Sin stock</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Group controlId="maximo">
            <Form.Label>Precio máximo</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={maximo}
              onChange={(e) => setMaximo(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg={2}>
          <Button variant="outline-secondary" onClick={limpiar}>
            Limpiar filtros
          </Button>
        </Col>
      </Row>
      <p role="status">{visibles.length} productos encontrados</p>
      {!visibles.length ? (
        <Alert variant="info">No encontramos productos con esos filtros.</Alert>
      ) : (
        <Row className="g-4">
          {visibles.map((p) => (
            <Col sm={6} lg={4} key={p.id}>
              <ProductoCard
                producto={p}
                alAgregar={(id) => dispatch({ type: 'AGREGAR', id })}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}