import { useEffect, useReducer, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import { productosIniciales } from './data/productosIniciales.js';
import { crearEstado, tiendaReducer, resumenCarrito } from './store/TiendaVergataria.js';

export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || '#/');
  const [estado, dispatch] = useReducer(tiendaReducer, productosIniciales, crearEstado);

useEffect(() => {
  function actualizarRuta() {
    setRuta(window.location.hash || '#/');
    dispatch({ type: 'CERRAR_AVISO' });
  }
  window.addEventListener('hashchange', actualizarRuta);
  return () => window.removeEventListener('hashchange', actualizarRuta);
}, []);

  const alAgregar = (id) => dispatch({ type: 'AGREGAR', id });
  const quitar = (id) => dispatch({ type: 'QUITAR', id });
  const cambiarCantidad = (id, cantidad) => dispatch({ type: 'CANTIDAD', id, cantidad });
  const { unidades } = resumenCarrito(estado);

  let pagina;
  if (ruta === '#/productos') {
    pagina = <Productos productos={estado.productos} alAgregar={alAgregar} />;
  } else if (ruta === '#/carrito') {
  pagina = (
    <Carrito
      productos={estado.productos}
      carrito={estado.carrito}
      quitar={quitar}
      cambiarCantidad={cambiarCantidad} 
    />
  );
  } else if (ruta === '#/contacto') {
    pagina = <Contacto />;
  } else {
    pagina = <Inicio />;
  }

  return (
    <>
      <Header cantidad={unidades} ruta={ruta} />
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
        {pagina}
      </main>
      <Footer />
    </>
  );
}