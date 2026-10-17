import { useState } from 'react';
import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ConfirmarModal from '../components/ConfirmarModal.jsx';
import { precioCLP } from '../utils/formato.js';
import { useTienda } from '../context/TiendaContext.jsx';
import { detalleCarrito, resumenCarrito } from '../store/TiendaVergataria.js';

export default function Carrito() {
  const { estado, dispatch } = useTienda();
  const [confirmacion, setConfirmacion] = useState(null);

  const detalle = detalleCarrito(estado);
  const resumen = resumenCarrito(estado);
  const stockCambio = detalle.some((p) => p.cantidad > p.stock);

  const idsEnCarrito = new Set(detalle.map((p) => p.id));
  const sugeridos = estado.productos
    .filter((p) => !idsEnCarrito.has(p.id) && p.stock > 0)
    .slice(0, 2);

  function confirmar() {
    dispatch({ type: confirmacion === 'compra' ? 'COMPRAR' : 'VACIAR' });
    setConfirmacion(null);
  }

  return (
    <Container as="section" className="py-4">
      <h1 className="mb-4">Mi carrito</h1>

      {stockCambio && (
        <Alert variant="warning">
          El stock cambió. Reduce las cantidades o elimina los productos
          agotados.
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={8}>
          <Card>
            <Card.Header className="cart-card-header d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Productos en tu carrito</h2>
              <span>
                (<strong>{resumen.unidades}</strong>) unidades
              </span>
            </Card.Header>

            {!detalle.length ? (
              <Card.Body>
                <Alert variant="info" className="mb-3">
                  Tu carrito está vacío.
                </Alert>
                <Button as={Link} to="/productos" variant="primary">
                  Ir al catálogo
                </Button>
              </Card.Body>
            ) : (
              <>
                <ListGroup variant="flush">
                  {detalle.map((p) => (
                    <ListGroup.Item as="article" key={p.id} className="py-3">
                      <Row className="g-3 align-items-center">
                        <Col xs="auto">
                          <img
                            className="cart-image rounded"
                            src={p.imagen}
                            alt=""
                          />
                        </Col>

                        <Col xs={12} sm>
                          <h3 className="h6 mb-1">
                            <Link to="/productos" className="cart-link">
                              {p.nombre}
                            </Link>
                          </h3>
                          <p className="small text-muted mb-1">
                            {[p.categoria, p.marca].filter(Boolean).join(' · ')}
                          </p>
                          {p.descripcion && <p className="small mb-2">{p.descripcion}</p>}
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-danger"
                            onClick={() =>
                              dispatch({ type: 'QUITAR', id: p.id })
                            }
                          >
                            <span aria-hidden="true">🗑</span> Eliminar{' '}
                            <span className="visually-hidden">{p.nombre}</span>
                          </Button>
                        </Col>

                        <Col
                          xs={12}
                          md="auto"
                          className="d-flex align-items-center gap-3 flex-wrap"
                        >
                          <div className="text-md-end">
                            <div>{precioCLP(p.precio)}</div>
                            <small className="text-muted">
                              Stock: {p.stock}
                            </small>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              aria-label={`Quitar una unidad de ${p.nombre}`}
                              onClick={() =>
                                dispatch({
                                  type: 'CANTIDAD',
                                  id: p.id,
                                  cantidad: Math.min(p.stock, p.cantidad - 1),
                                })
                              }
                            >
                              −
                            </Button>
                            <span
                              className="cart-cantidad"
                              aria-label={`Cantidad de ${p.nombre}`}
                            >
                              {p.cantidad}
                            </span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              aria-label={`Agregar una unidad de ${p.nombre}`}
                              disabled={p.cantidad >= p.stock}
                              onClick={() =>
                                dispatch({
                                  type: 'CANTIDAD',
                                  id: p.id,
                                  cantidad: p.cantidad + 1,
                                })
                              }
                            >
                              +
                            </Button>
                          </div>

                          <h4 className="h5 mb-0 cart-subtotal">
                            {precioCLP(p.precio * p.cantidad)}
                          </h4>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Card.Footer className="d-flex justify-content-between flex-wrap gap-2 bg-white">
                  <Button as={Link} to="/productos" variant="outline-primary">
                    <span aria-hidden="true">←</span> Continuar comprando
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => setConfirmacion('vaciar')}
                  >
                    Vaciar carrito
                  </Button>
                </Card.Footer>
              </>
            )}
          </Card>
        </Col>

        <Col lg={4}>
          {detalle.length > 0 && (
            <Card className="mb-4">
              <Card.Header className="cart-card-header">
                <h2 className="h5 mb-0">Resumen del carrito</h2>
              </Card.Header>
              <Card.Body>
                <dl className="d-flex justify-content-between mb-1">
                  <dt className="fw-normal">Subtotal</dt>
                  <dd className="mb-0">{precioCLP(resumen.subtotal)}</dd>
                </dl>
                <dl className="d-flex justify-content-between mb-2">
                  <dt className="fw-normal">Envío simulado</dt>
                  <dd className="mb-0">{precioCLP(resumen.envio)}</dd>
                </dl>
                <hr />
                <p className="mb-0 text-muted">Total</p>
                <p className="h2 fw-bold">{precioCLP(resumen.total)}</p>
                <Button
                  className="w-100"
                  disabled={stockCambio}
                  onClick={() => setConfirmacion('compra')}
                >
                  <span aria-hidden="true">🛒</span> Finalizar compra
                </Button>
                <p className="small text-muted mt-3 mb-0">
                  Esta compra es una simulación: se descuenta el stock pero no
                  se realiza ningún cobro.
                </p>
              </Card.Body>
            </Card>
          )}

          <Card className="mb-4">
            <Card.Header className="cart-card-header">
              <h2 className="h5 mb-0">Soporte</h2>
            </Card.Header>
            <Card.Body className="text-center">
              <p className="small">
                ¿Tienes dudas sobre tu pedido? Escríbenos y te ayudamos.
              </p>
              <Button as={Link} to="/contacto" variant="outline-primary" size="sm">
                Ir a Contacto
              </Button>
            </Card.Body>
          </Card>

          {sugeridos.length > 0 && (
            <Card>
              <Card.Header className="cart-card-header">
                <h2 className="h5 mb-0">También te puede interesar</h2>
              </Card.Header>
              <ListGroup variant="flush">
                {sugeridos.map((p) => (
                  <ListGroup.Item key={p.id}>
                    <p className="fw-semibold mb-1">{p.nombre}</p>
                    {p.descripcion && (
                      <p className="small text-muted mb-2">{p.descripcion}</p>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{precioCLP(p.precio)}</span>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => dispatch({ type: 'AGREGAR', id: p.id })}
                      >
                        Agregar{' '}
                        <span className="visually-hidden">{p.nombre}</span>
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </Col>
      </Row>

      <ConfirmarModal
        abierto={confirmacion !== null}
        titulo={confirmacion === 'compra' ? 'Confirmar compra' : 'Vaciar carrito'}
        confirmar={confirmar}
        cancelar={() => setConfirmacion(null)}
      >
        {confirmacion === 'compra'
          ? 'Se descontará el stock de los productos y se vaciará el carrito. Esta compra es una simulación.'
          : '¿Deseas retirar todos los productos del carrito?'}
      </ConfirmarModal>
    </Container>
  );
}