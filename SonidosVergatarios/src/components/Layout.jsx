import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useTienda } from '../context/TiendaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const TITULOS = {
  '/': 'Inicio',
  '/productos': 'Productos',
  '/carrito': 'Carrito',
  '/contacto': 'Contacto',
  '/login': 'Ingreso',
  '/admin': 'Administración',
};

export default function Layout() {
  const { estado, dispatch, errorGuardado } = useTienda();
  const { errorGuardado: errorSesion } = useAuth();
  const { pathname } = useLocation();
  const main = useRef(null);

  useEffect(() => {
    document.title = `${TITULOS[pathname] ?? 'Página no encontrada'} | SonidosVergatarios`;
    main.current?.focus();
    dispatch({ type: 'CERRAR_AVISO' });
  }, [pathname, dispatch]);

  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} ref={main}>
        <Container>
          {(errorGuardado || errorSesion) && (
            <Alert variant="warning" className="mt-3">
              No se pudo guardar en este navegador. Los cambios funcionan
              mientras esta página permanezca abierta.
            </Alert>
          )}
          {estado.aviso && (
            <Alert
              className="mt-3"
              variant={estado.aviso.tipo}
              dismissible
              onClose={() => dispatch({ type: 'CERRAR_AVISO' })}
              role="status"
            >
              {estado.aviso.texto}
            </Alert>
          )}
        </Container>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
