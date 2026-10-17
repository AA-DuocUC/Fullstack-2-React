import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { validarContacto } from '../utils/validaciones.js';

const vacio = { email: '', asunto: '', mensaje: '' };

export default function Contacto() {
  const [campos, setCampos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);

  function actualizar(evento) {
    const { name, value } = evento.target;
    const siguientes = { ...campos, [name]: value };
    setCampos(siguientes);
    setTocados((actual) => ({ ...actual, [name]: true }));
    setErrores((actual) => ({
      ...actual,
      [name]: validarContacto(siguientes)[name],
    }));
    setEnviado(false);
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarContacto(campos);
    setErrores(nuevos);
    setTocados({ email: true, asunto: true, mensaje: true });
    if (!Object.keys(nuevos).length) {
      setEnviado(true);
      setCampos(vacio);
      setTocados({});
    }
  }

  return (
    <Container as="section" className="py-4">
      <h1>Contacto</h1>
      <p>
        Formulario de demostración. Se valida en el navegador; no se envía
        correo. También puedes escribirnos a tienda@sonidosvergatarios.com.
      </p>
      {enviado && (
        <Alert variant="success" role="status">
          Mensaje validado correctamente.
        </Alert>
      )}
      <Form className="formulario-contacto" onSubmit={enviar} noValidate>
        {[
          { campo: 'email', texto: 'Correo electrónico', tipo: 'email' },
          { campo: 'asunto', texto: 'Asunto', tipo: 'text' },
          { campo: 'mensaje', texto: 'Mensaje', tipo: 'text' },
        ].map(({ campo, texto, tipo }) => (
          <Form.Group
            key={campo}
            controlId={`contacto-${campo}`}
            className="mb-3"
          >
            <Form.Label>{texto}</Form.Label>
            <Form.Control
              as={campo === 'mensaje' ? 'textarea' : 'input'}
              rows={campo === 'mensaje' ? 5 : undefined}
              type={tipo}
              autoComplete={campo === 'email' ? 'email' : undefined}
              name={campo}
              value={campos[campo]}
              onChange={actualizar}
              isInvalid={Boolean(tocados[campo] && errores[campo])}
              isValid={Boolean(tocados[campo] && !errores[campo])}
              aria-describedby={errores[campo] ? `error-${campo}` : undefined}
            />
            <Form.Control.Feedback type="invalid" id={`error-${campo}`}>
              {errores[campo]}
            </Form.Control.Feedback>
          </Form.Group>
        ))}
        <Button type="submit">Validar mensaje</Button>
      </Form>
    </Container>
  );
}
