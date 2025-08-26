import api from './api';
import type { LoginCredentials, LoginResponse, User } from '../types';

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

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

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<{success: boolean; message: string; data: {user: User}}>('/auth/login', credentials);
      
      // Validate response
      if (!response.data || response.data.success !== true || !response.data.data?.user) {
        throw new Error('Invalid login response');
      }
      
      // No need to set token cookie - backend handles it as HTTP-only
      // Just store user data in cookie for UI purposes
      setCookie('vitalsync_user', JSON.stringify(response.data.data.user), 7);
      
      // Return LoginResponse format expected by the app
      return {
        user: response.data.data.user,
        token: 'http-only' // placeholder, not actually used
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      deleteCookie('vitalsync_token');
      deleteCookie('vitalsync_user');
    }
  },

  getCurrentUser(): User | null {
    const userString = getCookie('vitalsync_user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        deleteCookie('vitalsync_user');
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    // O token agora é gerenciado pelo navegador como HTTP-only cookie
    // Não podemos acessá-lo diretamente, mas podemos verificar se o usuário está autenticado
    return 'http-only'; // placeholder
  },

  isAuthenticated(): boolean {
    // Como o token é HTTP-only, verificamos apenas se temos dados do usuário
    const user = this.getCurrentUser();
    return !!user;
  },
  
  // Verifica o status da autenticação no servidor
  async checkAuthStatus(): Promise<User | null> {
    try {
      const response = await api.get('/auth/check');
      if (response.data?.success && response.data?.data?.isAuthenticated && response.data?.data?.user) {
        // Atualiza o cookie do usuário com os dados mais recentes
        setCookie('vitalsync_user', JSON.stringify(response.data.data.user), 7);
        return response.data.data.user as User;
      }
      return null;
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    }
  }
};
