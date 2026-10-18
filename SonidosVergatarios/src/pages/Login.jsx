import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  FormIngresoAdmin,
  FormIngresoCliente,
  FormRegistro,
} from '../components/FormulariosAcceso.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const TEXTOS = {
  ingresar: {
    titulo: 'Iniciar sesión',
    subtitulo: 'Qué bueno verte de nuevo.',
  },
  registro: {
    titulo: 'Crear cuenta',
    subtitulo: 'Únete y compra tus instrumentos favoritos.',
  },
  admin: {
    titulo: 'Acceso administrador',
    subtitulo: 'Gestiona el catálogo de la tienda.',
  },
};

export default function Login() {
  const { sesion } = useAuth();
  const location = useLocation();
  const desde = location.state?.desde ?? '';
  const pideAdmin = desde.startsWith('/admin');

  const [rol, setRol] = useState(pideAdmin ? 'admin' : 'cliente');
  const [modo, setModo] = useState('ingresar');
  const [recienCreada, setRecienCreada] = useState('');

  if (sesion) {
    const destino =
      sesion.rol === 'admin'
        ? pideAdmin
          ? desde
          : '/admin'
        : desde && !pideAdmin
          ? desde
          : '/';
    return <Navigate to={destino} replace />;
  }

  const clave = rol === 'admin' ? 'admin' : modo;
  const { titulo, subtitulo } = TEXTOS[clave];

  function elegirRol(nuevo) {
    setRol(nuevo);
    setModo('ingresar');
    setRecienCreada('');
  }

  return (
    <section className="login-escena" aria-labelledby="titulo-login">
      <span className="login-mancha login-mancha-1" aria-hidden="true" />
      <span className="login-mancha login-mancha-2" aria-hidden="true" />
      <Container className="login-contenido">
        <Row className="align-items-center g-5">
          <Col lg={6} className="login-lado">
            <p className="login-marca">
              <span aria-hidden="true">🎸</span> SonidosVergatarios
            </p>
            <p className="login-etiqueta">Tienda de instrumentos musicales</p>
            <p className="login-lema">
              Tu próximo instrumento te está esperando.
            </p>
            <ul className="login-chips" aria-label="Lo que encontrarás">
              <li>
                <span className="punto punto-rosa" aria-hidden="true" />
                Guitarras
              </li>
              <li>
                <span className="punto punto-naranja" aria-hidden="true" />
                Baterías
              </li>
              <li>
                <span className="punto punto-turquesa" aria-hidden="true" />
                Teclados
              </li>
            </ul>
            <div className="login-ecualizador" aria-hidden="true">
              {Array.from({ length: 16 }, (_, i) => (
                <span key={i} style={{ '--i': i }} />
              ))}
            </div>
          </Col>

          <Col lg={5} className="ms-lg-auto">
            <div className="login-tarjeta">
              <div
                className="login-tabs"
                role="group"
                aria-label="Tipo de acceso"
              >
                <button
                  type="button"
                  aria-pressed={rol === 'cliente'}
                  onClick={() => elegirRol('cliente')}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  aria-pressed={rol === 'admin'}
                  onClick={() => elegirRol('admin')}
                >
                  Administrador
                </button>
              </div>

              <h1 id="titulo-login" className="login-titulo">
                {titulo}
              </h1>
              <p className="login-subtitulo">{subtitulo}</p>

              {rol === 'admin' && <FormIngresoAdmin />}
              {rol === 'cliente' && modo === 'ingresar' && (
                <FormIngresoCliente
                  key={recienCreada || 'nuevo'}
                  inicial={recienCreada}
                  aviso={
                    recienCreada
                      ? 'Cuenta creada. Ahora inicia sesión.'
                      : undefined
                  }
                  irARegistro={() => {
                    setRecienCreada('');
                    setModo('registro');
                  }}
                />
              )}
              {rol === 'cliente' && modo === 'registro' && (
                <FormRegistro
                  alRegistrar={(usuario) => {
                    setRecienCreada(usuario);
                    setModo('ingresar');
                  }}
                  irAIngreso={() => setModo('ingresar')}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
