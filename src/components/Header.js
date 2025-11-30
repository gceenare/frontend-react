import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Removed token and handleLogout as security is removed

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">E-Commerce</Link>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/cart">Cart ({totalItems})</Link></li>
          {/* All links are now visible as security is removed */}
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/admin/products">Admin Products</Link></li>
          <li><Link to="/admin/orders">Admin Orders</Link></li>
        </ul>
      </nav>
    </header>
  );
}