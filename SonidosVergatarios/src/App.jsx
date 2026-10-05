import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || '#/');
  useEffect(() => {
    function actualizarRuta() { setRuta(window.location.hash || '#/'); }
    window.addEventListener('hashchange', actualizarRuta);
    return () => window.removeEventListener('hashchange', actualizarRuta);
  }, []);
  return (
    <><Header /><main>
      {ruta === '#/productos' ? <Productos /> : <Inicio />}
    </main><Footer /></>
  );
}