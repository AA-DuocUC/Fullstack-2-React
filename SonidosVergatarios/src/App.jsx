import { useEffect, useReducer } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import { productosIniciales } from './data/productosIniciales.js';
import { crearEstado, tiendaReducer, resumenCarrito } from './store/TiendaVergataria.js';

export default function App() {
  const [estado, dispatch] = useReducer(tiendaReducer, productosIniciales, crearEstado);

const location = useLocation();
useEffect(() => {
  dispatch({ type: 'CERRAR_AVISO' });
}, [location.pathname]);

  const alAgregar = (id) => dispatch({ type: 'AGREGAR', id });
  const quitar = (id) => dispatch({ type: 'QUITAR', id });
  const cambiarCantidad = (id, cantidad) => dispatch({ type: 'CANTIDAD', id, cantidad });
  const { unidades } = resumenCarrito(estado);

return (
    <>
      <Header cantidad={unidades} />
      <main>
        {estado.aviso && (
          <div className={`alert alert-${estado.aviso.tipo}`} role="alert">
            {estado.aviso.texto}{' '}
            <button
              className="btn-close"
              aria-label="Cerrar aviso"
              onClick={() => dispatch({ type: 'CERRAR_AVISO' })}
            />
          </div>
        )}

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos productos={estado.productos} alAgregar={alAgregar} />} />
          <Route path="/carrito" element={
            <Carrito
              productos={estado.productos}
              carrito={estado.carrito}
              quitar={quitar}
              cambiarCantidad={cambiarCantidad}
            />
          } />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={
            <section>
              <h1>Página no encontrada</h1>
              <Link to="/">Volver al inicio</Link>
            </section>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}