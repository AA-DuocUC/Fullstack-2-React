import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { precioCLP, estadoStock } from '../utils/formato.js';
 
export default function ProductoCard({ producto, alAgregar }) {
  const stock = estadoStock(producto.stock);
  return (
    <Card as="article" className="h-100 shadow-sm producto-card">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        loading="lazy"
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between gap-2 mb-2">
          <Badge bg="secondary">{producto.categoria}</Badge>
          <Badge
            bg={stock.variante}
            text={stock.variante === 'warning' ? 'dark' : undefined}
          >
            {stock.texto}
          </Badge>
        </div>
        <Card.Title as="h2" className="h5">
          {producto.nombre}
        </Card.Title>
        <p className="fw-bold fs-5">{precioCLP(producto.precio)}</p>
        <p className="text-secondary">Stock actual: {producto.stock}</p>
        <Button
          type="button"
          className="mt-auto"
          disabled={producto.stock === 0}
          onClick={() => alAgregar(producto.id)}
        >
          {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </Card.Body>
    </Card>
  );
}