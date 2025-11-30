import React from 'react';
import { useToast } from '../contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast(); // Assuming toasts and removeToast are exposed by useToast

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 mb-2 rounded-md shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
          role="alert"
        >
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-4 font-bold">
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}