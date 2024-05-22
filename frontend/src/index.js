import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar desde 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';
import './index.css';
import Modal from 'react-modal';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Usar createRoot para crear la raíz
Modal.setAppElement(rootElement);

root.render( // Usar root.render en lugar de ReactDOM.render
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
