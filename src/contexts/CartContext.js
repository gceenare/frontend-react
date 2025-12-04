import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { getProduct } from '../api'; // Import getProduct
import { useToast } from './ToastContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'shopping-cart';

export function CartProvider({ children }){
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  async function load(){
    setLoading(true);
    try{
      const res = await api.get('/cart');
      setCart(res.data || []);
    }catch(e){
      setCart([]);
      console.error("Failed to load cart from server:", e);
      showToast({ message: "Failed to sync cart with server.", type: "error" });
    }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function add(productId, qty=1){
    try {
      // Fetch product details for the toast
      const productDetails = await getProduct(productId);

      await api.post('/cart/add', { productId, quantity: qty });
      await load(); // Reload cart to get updated state from server

      showToast({
        message: `${productDetails.name} added to cart!`,
        type: "success",
        product: {
          name: productDetails.name,
          imageUrl: productDetails.imageUrl
        },
        undoAction: () => remove(productId) // Pass a function to undo this specific add
      });
    } catch (e) {
      console.error("Failed to add item to cart:", e);
      showToast({ message: e.response?.data?.message || "Failed to add item to cart.", type: "error" });
    }
  }

  async function remove(productId){
    try {
      await api.post('/cart/remove', { productId });
      await load();
      showToast({ message: "Item removed from cart.", type: "success" });
    } catch (e) {
      console.error("Failed to remove item from cart:", e);
      showToast({ message: e.response?.data?.message || "Failed to remove item from cart.", type: "error" });
    }
  }

  async function update(productId, quantity){
    try {
      await api.post('/cart/update', { productId, quantity });
      await load();
      showToast({ message: "Cart updated.", type: "success" });
    } catch (e) {
      console.error("Failed to update cart:", e);
      showToast({ message: e.response?.data?.message || "Failed to update cart.", type: "error" });
    }
  }

  function clearCart() {
    setCart([]);
    // Optionally, also clear on the backend if needed
    // api.post('/cart/clear');
  }

  return (
    <CartContext.Provider value={{ cart, add, remove, update, load, loading, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}