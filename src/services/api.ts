import axios from 'axios';

// Cookie utility to get cookie value


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

// Request interceptor
// Não precisamos adicionar o token manualmente, pois o navegador 
// envia automaticamente o cookie HTTP-only para o domínio correto
api.interceptors.request.use(
  (config) => {
    // Não precisamos fazer nada aqui, o navegador cuida do cookie JWT
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
