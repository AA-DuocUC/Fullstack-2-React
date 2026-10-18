import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import CampoClave from './CampoClave.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  validarLoginAdmin,
  validarLoginCliente,
} from '../utils/validaciones.js';

function Campo({ id, etiqueta, error, ...resto }) {
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        isInvalid={Boolean(error)}
        aria-describedby={error ? `error-${id}` : undefined}
        {...resto}
      />
      <Form.Control.Feedback type="invalid" id={`error-${id}`}>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

// Estado común de un formulario: valores, errores por campo y mensaje general.
function useFormulario(inicial) {
  const [campos, setCampos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [fallo, setFallo] = useState('');

  function cambiar(evento) {
    const { name, value } = evento.target;
    setCampos((actual) => ({ ...actual, [name]: value }));
    setErrores((actual) => ({ ...actual, [name]: undefined }));
    setFallo('');
  }

  return { campos, errores, setErrores, fallo, setFallo, cambiar };
}

export function FormIngresoCliente({ inicial = '', aviso, irARegistro }) {
  const { ingresarCliente } = useAuth();
  const f = useFormulario({ identificador: inicial, contrasena: '' });

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarLoginCliente(f.campos);
    f.setErrores(nuevos);
    if (Object.keys(nuevos).length) return;
    if (!ingresarCliente(f.campos.identificador, f.campos.contrasena))
      f.setFallo('Usuario o contraseña incorrectos.');
  }

  return (
    <Form onSubmit={enviar} noValidate>
      {aviso && <Alert variant="success">{aviso}</Alert>}
      <Campo
        id="identificador"
        etiqueta="Correo o usuario"
        name="identificador"
        value={f.campos.identificador}
        onChange={f.cambiar}
        error={f.errores.identificador}
        placeholder="tu@correo.com"
        autoComplete="username"
      />
      <CampoClave
        id="contrasena"
        etiqueta="Contraseña"
        name="contrasena"
        value={f.campos.contrasena}
        onChange={f.cambiar}
        error={f.errores.contrasena}
        autoComplete="current-password"
      />
      {f.fallo && (
        <Alert variant="danger" role="alert">
          {f.fallo}
        </Alert>
      )}
      <Button type="submit" className="btn-acceso w-100">
        Ingresar
      </Button>
      <p className="login-cambio">
        ¿Eres nuevo?{' '}
        <button type="button" className="btn-enlace" onClick={irARegistro}>
          Crear una cuenta
        </button>
      </p>
    </Form>
  );
}

export function FormRegistro({ alRegistrar, irAIngreso }) {
  const { registrar } = useAuth();
  const f = useFormulario({
    usuario: '',
    email: '',
    contrasena: '',
    confirmar: '',
  });

  function enviar(evento) {
    evento.preventDefault();
    const resultado = registrar(f.campos);
    if (resultado.ok) alRegistrar(f.campos.usuario.trim());
    else f.setErrores(resultado.errores);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Campo
        id="registro-usuario"
        etiqueta="Nombre de usuario"
        name="usuario"
        value={f.campos.usuario}
        onChange={f.cambiar}
        error={f.errores.usuario}
        placeholder="tu_usuario"
        autoComplete="username"
      />
      <Campo
        id="registro-email"
        etiqueta="Correo electrónico"
        type="email"
        name="email"
        value={f.campos.email}
        onChange={f.cambiar}
        error={f.errores.email}
        placeholder="tu@correo.com"
        autoComplete="email"
      />
      <CampoClave
        id="registro-contrasena"
        etiqueta="Contraseña"
        name="contrasena"
        value={f.campos.contrasena}
        onChange={f.cambiar}
        error={f.errores.contrasena}
        autoComplete="new-password"
      />
      <CampoClave
        id="registro-confirmar"
        etiqueta="Confirmar contraseña"
        name="confirmar"
        value={f.campos.confirmar}
        onChange={f.cambiar}
        error={f.errores.confirmar}
        autoComplete="new-password"
      />
      <Button type="submit" className="btn-acceso w-100">
        Crear cuenta
      </Button>
      <p className="login-cambio">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="btn-enlace" onClick={irAIngreso}>
          Inicia sesión
        </button>
      </p>
    </Form>
  );
}

export function FormIngresoAdmin() {
  const { ingresarAdmin } = useAuth();
  const f = useFormulario({ usuario: '', contrasena: '' });

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarLoginAdmin(f.campos);
    f.setErrores(nuevos);
    if (Object.keys(nuevos).length) return;
    if (!ingresarAdmin(f.campos.usuario, f.campos.contrasena))
      f.setFallo('Usuario o contraseña incorrectos.');
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Campo
        id="admin-usuario"
        etiqueta="Usuario"
        name="usuario"
        value={f.campos.usuario}
        onChange={f.cambiar}
        error={f.errores.usuario}
        autoComplete="username"
      />
      <CampoClave
        id="admin-contrasena"
        etiqueta="Contraseña"
        name="contrasena"
        value={f.campos.contrasena}
        onChange={f.cambiar}
        error={f.errores.contrasena}
        autoComplete="current-password"
      />
      {f.fallo && (
        <Alert variant="danger" role="alert">
          {f.fallo}
        </Alert>
      )}
      <Button type="submit" className="btn-acceso w-100">
        Ingresar como administrador
      </Button>
      <p className="login-cambio">
        Acceso de demostración: usuario <strong>admin</strong>, clave{' '}
        <strong>1234</strong>.
      </p>
    </Form>
  );
}
