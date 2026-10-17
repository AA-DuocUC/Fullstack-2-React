import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { sesion, ingresar } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde?.startsWith('/admin')
    ? location.state.desde
    : '/admin';

  if (sesion?.rol === 'admin') return <Navigate to={destino} replace />;

  function enviar(evento) {
    evento.preventDefault();
    if (ingresar(usuario, contrasena)) navigate(destino, { replace: true });
    else setError('Usuario o contraseña incorrectos.');
  }

  return (
    <Container as="section" className="py-4">
      <h1>Inicio de sesión administrador</h1>
      <p>
        Acceso de demostración para el proyecto académico (usuario{' '}
        <strong>admin</strong>, clave <strong>1234</strong>).
      </p>
      <Form className="formulario-login" onSubmit={enviar}>
        <Form.Group controlId="usuario" className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setError('');
            }}
            autoComplete="username"
            required
          />
        </Form.Group>
        <Form.Group controlId="contrasena" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              setError('');
            }}
            autoComplete="current-password"
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit">Ingresar</Button>
      </Form>
    </Container>
  );
}
