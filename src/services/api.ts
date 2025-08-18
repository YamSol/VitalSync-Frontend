import axios from 'axios';
import type { ApiResponse } from '../types';

// Cookie utility to get cookie value
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Cookie utility to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Configure axios base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001', // URL do backend
  timeout: 10000,
  withCredentials: true, // Enable cookies
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = getCookie('vitalsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      deleteCookie('vitalsync_token');
      deleteCookie('vitalsync_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
