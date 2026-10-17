import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { validarProducto } from '../utils/validaciones.js';

const vacio = {
  nombre: '',
  categoria: '',
  marca: '',
  precio: '',
  stock: '',
  imagen: '',
  descripcion: '',
};

const campos = [
  { clave: 'nombre', etiqueta: 'Nombre del producto', tipo: 'text' },
  { clave: 'categoria', etiqueta: 'Categoría del producto', tipo: 'text' },
  { clave: 'marca', etiqueta: 'Marca (opcional)', tipo: 'text' },
  { clave: 'precio', etiqueta: 'Precio', tipo: 'number' },
  { clave: 'stock', etiqueta: 'Stock', tipo: 'number' },
  { clave: 'imagen', etiqueta: 'URL de imagen', tipo: 'url' },
  { clave: 'descripcion', etiqueta: 'Descripción (opcional)', tipo: 'textarea' },
];

export default function ProductoModal({
  producto,
  productos,
  guardar,
  cerrar,
}) {
  const [form, setForm] = useState(
    producto
      ? {
          nombre: producto.nombre,
          categoria: producto.categoria,
          marca: producto.marca ?? '',
          precio: String(producto.precio),
          stock: String(producto.stock),
          imagen: producto.imagen,
          descripcion: producto.descripcion ?? '',
        }
      : vacio,
  );
  const [errores, setErrores] = useState({});
  const categorias = [...new Set(productos.map((p) => p.categoria))].sort();

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarProducto(form, productos, producto?.id ?? null);
    setErrores(nuevos);
    if (!Object.keys(nuevos).length) guardar(form, producto?.id ?? null);
  }

  return (
    <Modal show onHide={cerrar} centered aria-labelledby="titulo-producto">
      <Modal.Header closeButton>
        <Modal.Title id="titulo-producto">
          {producto ? 'Editar producto' : 'Nuevo producto'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={enviar} noValidate>
        <Modal.Body>
          {campos.map(({ clave, etiqueta, tipo }) => (
            <Form.Group
              controlId={`producto-${clave}`}
              className="mb-3"
              key={clave}
            >
              <Form.Label>{etiqueta}</Form.Label>
              <Form.Control
                as={tipo === 'textarea' ? 'textarea' : 'input'}
                rows={tipo === 'textarea' ? 3 : undefined}
                type={tipo === 'textarea' ? undefined : tipo}
                list={clave === 'categoria' ? 'lista-categorias' : undefined}
                value={form[clave]}
                min={clave === 'stock' ? 0 : undefined}
                step={clave === 'stock' ? 1 : undefined}
                onChange={(e) => {
                  setForm((actual) => ({ ...actual, [clave]: e.target.value }));
                  setErrores((actual) => ({ ...actual, [clave]: undefined }));
                }}
                isInvalid={Boolean(errores[clave])}
                aria-describedby={
                  errores[clave] ? `error-producto-${clave}` : undefined
                }
              />
              <Form.Control.Feedback
                type="invalid"
                id={`error-producto-${clave}`}
              >
                {errores[clave]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <datalist id="lista-categorias">
            {categorias.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit">Guardar producto</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
