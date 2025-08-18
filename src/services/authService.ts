import api from './api';
import type { LoginCredentials, LoginResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Store token and user data
      localStorage.setItem('vitalsync_token', response.data.token);
      localStorage.setItem('vitalsync_user', JSON.stringify(response.data.user));
      
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
      localStorage.removeItem('vitalsync_token');
      localStorage.removeItem('vitalsync_user');
    }
  },

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('vitalsync_user');
    return userString ? JSON.parse(userString) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('vitalsync_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
