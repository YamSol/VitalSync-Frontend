import axios from 'axios';
import type { ApiResponse } from '../types';

// Configure axios base instance
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3001', // Alterar para URL do backend
  timeout: 10000,
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vitalsync_token');
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
      localStorage.removeItem('vitalsync_token');
      localStorage.removeItem('vitalsync_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
