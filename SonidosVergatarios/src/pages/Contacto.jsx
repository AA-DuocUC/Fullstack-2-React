import { useState } from 'react';
import { validarContacto } from '../utils/validaciones.js';

const VACIO = { email: '', asunto: '', mensaje: '' };

export default function Contacto() {
  const [campos, setCampos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
    setEnviado(false);
  }

  function enviar(e) {
    e.preventDefault();
    const nuevosErrores = validarContacto(campos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setCampos(VACIO);
    }
  }

  return (
    <section>
      <h1>Contacto</h1>
      <p>
        Escríbenos a tienda@sonidosvergatarios.com o usa este formulario.
      </p>

      {enviado && (
        <div className="alert alert-success" role="status">
          Mensaje enviado. ¡Gracias por escribirnos!
        </div>
      )}

      <form onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errores.email ? 'is-invalid' : ''}`}
            value={campos.email}
            onChange={cambiar}
          />
          {errores.email && <div className="invalid-feedback">{errores.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="asunto" className="form-label">Asunto</label>
          <input
            id="asunto"
            name="asunto"
            type="text"
            className={`form-control ${errores.asunto ? 'is-invalid' : ''}`}
            value={campos.asunto}
            onChange={cambiar}
          />
          {errores.asunto && <div className="invalid-feedback">{errores.asunto}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
            value={campos.mensaje}
            onChange={cambiar}
          />
          {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Enviar mensaje</button>
      </form>
    </section>
  );
}