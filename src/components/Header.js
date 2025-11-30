import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <h1>EcomTech</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
  );
}

export default Header;
