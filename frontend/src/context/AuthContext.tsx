import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserResponse, LoginResponse } from '../services/authService';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  setUser: (user: UserResponse | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Перевіряємо токен при завантаженні
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Токен існує, користувач авторизований
      // У реальному додатку можна виконати GET /me для отримання даних користувача
      setUser({ id: 0, email: '', is_active: true });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const data = response.data as LoginResponse;
      localStorage.setItem('access_token', data.access_token);
      setUser({ id: 0, email, is_active: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await authService.register(email, password);
      const data = response.data as UserResponse;
      setUser(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!localStorage.getItem('access_token'),
        isLoading,
        login,
        logout,
        register,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
