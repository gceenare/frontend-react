import React from 'react';
import { useToast } from '../contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
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
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              {toast.product && (
                <div className="flex items-center mb-2">
                  <img src={toast.product.imageUrl} alt={toast.product.name} className="w-10 h-10 object-cover rounded mr-2" />
                  <span className="font-semibold">{toast.product.name}</span>
                </div>
              )}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="ml-4 font-bold text-lg leading-none">
              &times;
            </button>
          </div>
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction();
                removeToast(toast.id);
              }}
              className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors text-sm"
            >
              Undo
            </button>
          )}
        </div>
      ))}
    </div>
  );
}