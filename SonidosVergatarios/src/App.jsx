import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import { resumenCarrito } from './store/TiendaVergataria.js';
import { useTienda } from './context/TiendaContext.jsx';

export default function App() {
  const { estado, dispatch } = useTienda();

  const location = useLocation();
  useEffect(() => {
    dispatch({ type: 'CERRAR_AVISO' });
  }, [location.pathname, dispatch]);

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
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
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