import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to add the JWT token (handled by ApiInterceptorSetup now)
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Response interceptor for global error handling (handled by ApiInterceptorSetup now)
/*
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        // This will now be handled by AuthContext's interceptor
      } else {
        // Handled by ApiInterceptorSetup
      }
    } else if (error.request) {
      // Handled by ApiInterceptorSetup
    } else {
      // Handled by ApiInterceptorSetup
    }
    return Promise.reject(error);
  }
);
*/

// --- API Functions ---

// Auth
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = () => api.post('/auth/refresh'); // Export refreshToken

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const searchProducts = (query) => api.get(`/products/search`, { params: { query } });
export const addReview = (productId, review) => api.post(`/products/${productId}/reviews`, review);

// User
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const getAddresses = () => api.get('/address');
export const addAddress = (data) => api.post('/address', data);
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);
export const deleteAddress = (id) => api.delete('/address/${id}');

// Cart
export const applyCoupon = (code) => api.post('/cart/apply-coupon', { code });

// Orders
export const getOrders = () => api.get('/orders');
export const getOrderInvoice = (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' });

// Wishlist
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post('/wishlist/add', { productId });

export default api;