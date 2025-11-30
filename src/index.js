import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext'; // Import ToastProvider
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ToastProvider> {/* Wrap with ToastProvider */}
      <CartProvider>
        <App />
      </CartProvider>
    </ToastProvider>
  </BrowserRouter>
);