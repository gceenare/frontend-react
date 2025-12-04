import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (options) => {
    const id = uuidv4();
    const { message, type = 'info', duration = 3000, product = null, undoAction = null } = options;

    setToasts((prevToasts) => [...prevToasts, { id, message, type, product, undoAction }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}