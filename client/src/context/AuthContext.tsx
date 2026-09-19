import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: 'SUPER_ADMIN' | 'SELLER' | 'STAFF' | 'CUSTOMER') => Promise<void>;
  registerUser: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hercart_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('hercart_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('hercart_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: 'SUPER_ADMIN' | 'SELLER' | 'STAFF' | 'CUSTOMER') => {
    let email = 'admin@hercart.demo';
    let password = 'Admin@123';

    if (role === 'SELLER') {
      email = 'seller@hercart.demo';
      password = 'Seller@123';
    } else if (role === 'STAFF') {
      email = 'staff@hercart.demo';
      password = 'Staff@123';
    } else if (role === 'CUSTOMER') {
      email = 'customer@hercart.demo';
      password = 'Customer@123';
    }

    await login(email, password);
  };

  const registerUser = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        localStorage.setItem('hercart_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('hercart_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        demoLogin,
        registerUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
