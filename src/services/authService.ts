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
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Validate response
      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error('Invalid login response');
      }
      
      // Store token and user data in cookies
      setCookie('vitalsync_token', response.data.token, 7);
      setCookie('vitalsync_user', JSON.stringify(response.data.user), 7);
      
      return response.data;
    } catch (error: any) {
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
    return getCookie('vitalsync_token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }
};
