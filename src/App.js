import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
// import ProtectedRoute from './components/ProtectedRoute'; // Removed ProtectedRoute import
import ToastContainer from './components/ToastContainer';

export default function App(){
  return (
    <div className="app container">
      <Header />
      <main style={{paddingTop:20}}>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/products" element={<ProductListPage/>} />
          <Route path="/product/:id" element={<ProductDetailsPage/>} />
          <Route path="/cart" element={<CartPage/>} />
          {/* Removed ProtectedRoute wrapper */}
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />

          {/* Admin routes - now directly accessible */}
          <Route path="/admin/products" element={<AdminProducts/>} />
          <Route path="/admin/orders" element={<AdminOrders/>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}