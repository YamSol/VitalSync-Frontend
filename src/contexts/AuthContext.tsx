import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';
import type { User, LoginCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Primeiro tenta obter o usuário do cookie
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
        }
        
        // Depois verifica no servidor se o cookie de autenticação é válido
        const serverUser = await authService.checkAuthStatus();
        if (serverUser) {
          // Se o servidor retornar o usuário, atualize o estado
          setUser(serverUser);
        } else if (currentUser) {
          // Se temos usuário no cookie mas o servidor não reconhece, logout
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Em caso de erro, não deixa o usuário autenticado
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Only set user if response is valid and has user data
      if (response && response.user) {
        setUser(response.user);
      } else {
        throw new Error('Login failed - invalid response');
      }
    } catch (error) {
      // Don't save anything if login fails
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Logout locally even if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
