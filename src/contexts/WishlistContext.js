import React, { createContext, useState, useContext, useEffect } from 'react';
import { getWishlist, addToWishlist } from '../api';
import { useToast } from './ToastContext';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const WISHLIST_STORAGE_KEY = 'wishlist';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error("Could not parse wishlist from localStorage", error);
      return [];
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    getWishlist().then(data => {
      setWishlist(data || []);
    }).catch(() => {
      showToast("Could not sync wishlist.", "error");
    });
  }, []);

  const add = (productId) => {
    addToWishlist(productId).then(() => {
      setWishlist(prev => [...prev, productId]);
      showToast("Added to wishlist!", "success");
    }).catch(() => {
      showToast("Failed to add to wishlist.", "error");
    });
  };

  const remove = (productId) => {
    // Assuming a backend endpoint exists for this
    // api.post('/wishlist/remove', { productId }).then(() => {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast("Removed from wishlist.", "success");
    // }).catch(() => {
    //   showToast("Failed to remove from wishlist.", "error");
    // });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ add, remove, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}