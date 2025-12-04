import { useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const ApiInterceptorSetup = () => {
  const { showToast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Do not handle 401 here, AuthContext's interceptor handles token refresh/logout
        if (error.response && error.response.status !== 401) {
          const message = error.response.data?.message || error.message || 'An unexpected error occurred.';
          showToast({ message, type: 'error' });
        } else if (!error.response && error.request) {
          // Network error (no response from server)
          showToast({ message: 'Network error: Please check your internet connection.', type: 'error' });
        } else if (!error.response) {
          // Something happened in setting up the request that triggered an Error
          showToast({ message: 'Request setup error: ' + error.message, type: 'error' });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [showToast, logout]);

  return null; // This component doesn't render anything
};

export default ApiInterceptorSetup;