import { useState } from 'react';
import { useTienda } from '../context/TiendaContext';
import { useAuth } from '../context/AuthContext';
import ConfirmarModal from '../components/ConfirmarModal';

export default function Admin() {
  const { productos, agregarProducto, editarProducto, eliminarProducto } = useTienda();
  const { usuario } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [eliminarId, setEliminarId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: 'Accesorios',
    imagen: '',
    disponibilidad: 'disponible',
  });

  const [errorForm, setErrorForm] = useState('');

  const abrirModalCrear = () => {
    setProductoEditar(null);
    setFormData({
      nombre: '',
      precio: '',
      stock: '',
      categoria: 'Accesorios',
      imagen: '',
      disponibilidad: 'disponible',
    });
    setErrorForm('');
    setModalOpen(true);
  };

  const abrirModalEditar = (prod) => {
    setProductoEditar(prod);
    setFormData({
      nombre: prod.nombre,
      precio: prod.precio,
      stock: prod.stock,
      categoria: prod.categoria || 'Accesorios',
      imagen: prod.imagen || '',
      disponibilidad: prod.disponibilidad || 'disponible',
    });
    setErrorForm('');
    setModalOpen(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setErrorForm('El nombre es obligatorio.');
      return;
    }
    if (Number(formData.precio) <= 0) {
      setErrorForm('El precio debe ser mayor que cero.');
      return;
    }
    if (Number(formData.stock) < 0) {
      setErrorForm('El stock no puede ser negativo.');
      return;
    }

    const nombreExiste = productos.some(
      (p) => p.nombre.toLowerCase() === formData.nombre.trim().toLowerCase() && p.id !== productoEditar?.id
    );

    if (nombreExiste) {
      setErrorForm('Ya existe un producto con ese nombre.');
      return;
    }

    const productoData = {
      nombre: formData.nombre.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      categoria: formData.categoria,
      imagen: formData.imagen || 'https://via.placeholder.com/150',
      disponibilidad: Number(formData.stock) > 0 ? 'disponible' : 'agotado',
    };

    if (productoEditar) {
      editarProducto(productoEditar.id, productoData);
    } else {
      agregarProducto(productoData);
    }

    setModalOpen(false);
  };

  const confirmarEliminar = () => {
    if (eliminarId) {
      eliminarProducto(eliminarId);
      setEliminarId(null);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administración de productos</h2>
        <button className="btn btn-success" onClick={abrirModalCrear}>
          + Nuevo producto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <img
                    src={prod.imagen || 'https://via.placeholder.com/50'}
                    alt={prod.nombre}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td className="fw-bold">{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>${prod.precio.toLocaleString('es-CL')}</td>
                <td>
                  <span className={`badge ${prod.stock > 0 ? 'bg-primary' : 'bg-danger'}`}>
                    {prod.stock} un.
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => abrirModalEditar(prod)}
                    aria-label={`Editar ${prod.nombre}`}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setEliminarId(prod.id)}
                    aria-label={`Eliminar ${prod.nombre}`}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear / Editar */}
      {modalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {productoEditar ? `Editar ${productoEditar.nombre}` : 'Nuevo producto'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <form onSubmit={handleGuardar}>
                <div className="modal-body">
                  {errorForm && <div className="alert alert-danger">{errorForm}</div>}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="nombre-input">Nombre</label>
                    <input
                      id="nombre-input"
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" htmlFor="precio-input">Precio</label>
                      <input
                        id="precio-input"
                        type="number"
                        className="form-control"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" htmlFor="stock-input">Stock</label>
                      <input
                        id="stock-input"
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="categoria-select">Categoría</label>
                    <select
                      id="categoria-select"
                      className="form-control"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    >
                      <option value="Accesorios">Accesorios</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Audio">Audio</option>
                      <option value="Cuerdas">Cuerdas</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="imagen-input">URL de la imagen</label>
                    <input
                      id="imagen-input"
                      type="text"
                      className="form-control"
                      placeholder="https://..."
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {eliminarId && (
        <ConfirmarModal
          titulo="Eliminar producto"
          mensaje="¿Estás seguro de que deseas eliminar este producto?"
          onConfirmar={confirmarEliminar}
          onCancelar={() => setEliminarId(null)}
        />
      )}
    </div>
  );
}