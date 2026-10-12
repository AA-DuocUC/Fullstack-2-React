import React from 'react';
import { createRoot } from 'react-dom/client';
import { TiendaProvider } from './context/TiendaContext.jsx';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TiendaProvider>
        <App />
      </TiendaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
