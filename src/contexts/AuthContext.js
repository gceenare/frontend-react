import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, refreshToken as apiRefreshToken } from '../api';
import { useToast } from './ToastContext';
import axios from 'axios'; // Import axios directly for interceptor setup

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('role');
      if (storedToken && storedUsername && storedRole) {
        setUser({ token: storedToken, username: storedUsername, role: storedRole });
      }
    } catch (error) {
      console.error("Failed to load user from local storage:", error);
      localStorage.clear(); // Clear potentially corrupted storage
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (username, password) => {
    try {
      const res = await apiLogin({ username, password });
      const { token, username: resUsername, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', resUsername);
      localStorage.setItem('role', role);
      setUser({ token, username: resUsername, role });
      showToast({ message: 'Logged in successfully!', type: 'success' });
      return true;
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Login failed.', type: 'error' });
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    showToast({ message: 'Logged out successfully!', type: 'info' });
  }, [showToast]);

  // Axios Interceptor for Token Refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not a retry, attempt to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark as retried

          try {
            const res = await apiRefreshToken(); // Call your refresh token API
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            setUser(prev => ({ ...prev, token: newToken })); // Update user state
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest); // Retry original request with new token
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout(); // Logout user if refresh fails
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const isAuthenticated = !!user?.token;
  const isAdmin = user?.role === 'admin';

  const contextValue = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}