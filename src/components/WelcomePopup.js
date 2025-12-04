import React, { useState, useEffect } from 'react';

const WelcomePopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShow(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Our Store!</h2>
        <p className="text-gray-600 mb-6">
          Discover amazing products and enjoy a seamless shopping experience.
        </p>
        <button
          onClick={() => setShow(false)}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;