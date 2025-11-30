import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';
import { useToast } from './ToastContext'; // Import useToast

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }){
  const [cart, setCart] = useState([]); // Renamed 'items' to 'cart'
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast(); // Get showToast function

  async function load(){
    // Removed token check as security is no longer enforced
    setLoading(true);
    try{
      const res = await api.get('/cart');
      setCart(res.data || []); // Use setCart
    }catch(e){
      // If loading cart fails, clear it and show an error
      setCart([]); // Use setCart
      console.error("Failed to load cart:", e);
      showToast("Failed to load cart.", "error");
    }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function add(productId, qty=1){
    try {
      await api.post('/cart/add', { productId, quantity: qty });
      await load();
      showToast("Item added to cart!", "success");
    } catch (e) {
      console.error("Failed to add item to cart:", e);
      showToast(e.response?.data || "Failed to add item to cart.", "error");
    }
  }

  async function remove(productId){
    try {
      await api.post('/cart/remove', { productId });
      await load();
      showToast("Item removed from cart.", "success");
    } catch (e) {
      console.error("Failed to remove item from cart:", e);
      showToast(e.response?.data || "Failed to remove item from cart.", "error");
    }
  }

  async function update(productId, quantity){
    try {
      await api.post('/cart/update', { productId, quantity });
      await load();
      showToast("Cart updated.", "success");
    } catch (e) {
      console.error("Failed to update cart:", e);
      showToast(e.response?.data || "Failed to update cart.", "error");
    }
  }

  return (
    <CartContext.Provider value={{ cart, add, remove, update, load, loading }}> {/* Expose 'cart' */}
      {children}
    </CartContext.Provider>
  );
}