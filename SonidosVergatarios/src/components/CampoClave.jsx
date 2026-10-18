import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function IconoOjo({ tachado }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {tachado && <path d="M3 3l18 18" />}
    </svg>
  );
}

export default function CampoClave({
  id,
  etiqueta,
  error,
  autoComplete,
  ...resto
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label>{etiqueta}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          isInvalid={Boolean(error)}
          aria-describedby={error ? `error-${id}` : undefined}
          {...resto}
        />
        <button
          type="button"
          className="btn-ojo"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <IconoOjo tachado={visible} />
        </button>
        <Form.Control.Feedback type="invalid" id={`error-${id}`}>
          {error}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}
