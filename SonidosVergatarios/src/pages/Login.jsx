import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [usuarioInput, setUsuarioInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuarioInput || !passwordInput) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Validación de administrador
    if (usuarioInput === 'admin' && passwordInput === '1234') {
      login({ nombre: 'Administrador', rol: 'admin' });
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="card-title text-center mb-4 fw-bold">Inicio de sesión administrador</h3>
        
        {error && <div className="alert alert-danger p-2 text-center small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              className="form-control"
              placeholder="Ej: admin"
              value={usuarioInput}
              onChange={(e) => setUsuarioInput(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}