import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import Search from './Search';

export default function Header() {
  const { cart } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const ThemeToggleButton = ({ onClick, isMobile = false }) => (
    <button
      onClick={onClick}
      className={`flex items-center ${isMobile ? 'py-3 px-4 text-lg' : ''} hover:bg-gray-700 rounded transition-colors`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
      )}
      {isMobile && <span className="ml-2">Toggle Theme</span>}
    </button>
  );

  const commonNavLinks = (closeMenu) => (
    <>
      <li><Link to="/products" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Products</Link></li>
      <li><Link to="/wishlist" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Wishlist</Link></li>
      <li><Link to="/cart" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Cart ({totalItems})</Link></li>
    </>
  );

  const authNavLinks = (closeMenu) => (
    <>
      <hr className="my-2 border-gray-600"/>
      <li><Link to="/profile" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Profile</Link></li>
      {isAdmin && (
        <li><Link to="/admin" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Admin Dashboard</Link></li>
      )}
      <li><button onClick={handleLogout} className="block w-full text-left py-3 px-4 text-lg hover:bg-gray-700 rounded">Logout</button></li>
    </>
  );

  const guestNavLinks = (closeMenu) => (
    <>
      <hr className="my-2 border-gray-600"/>
      <li><Link to="/login" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Login</Link></li>
      <li><Link to="/register" className="block py-3 px-4 text-lg hover:bg-gray-700 rounded" onClick={closeMenu}>Register</Link></li>
    </>
  );

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">E-Commerce</Link>

        {/* Desktop Search & Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Search />
          <nav>
            <ul className="flex space-x-4 items-center">
              {commonNavLinks(() => {})}
              {isAuthenticated ? authNavLinks(() => {}) : guestNavLinks(() => {})}
              <li><ThemeToggleButton onClick={toggleTheme} /></li> {/* Desktop theme toggle */}
            </ul>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="mr-4 relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-95 z-40 flex flex-col pt-16">
          <div className="p-4">
            <Search />
          </div>
          <nav className="flex-grow">
            <ul className="flex flex-col space-y-1 p-4">
              {commonNavLinks(() => setIsMenuOpen(false))}
              {isAuthenticated ? authNavLinks(() => setIsMenuOpen(false)) : guestNavLinks(() => setIsMenuOpen(false))}
              <li><ThemeToggleButton onClick={() => { toggleTheme(); setIsMenuOpen(false); }} isMobile={true} /></li> {/* Mobile theme toggle */}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}