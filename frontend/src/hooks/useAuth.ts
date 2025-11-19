import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { authService } from '../services/authService';
import { getToken, setToken as saveToken, removeToken } from '../utils';

interface User {
  id: string;
  email: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      console.log('[AUTH HOOK] Verifying token...');
      const token = getToken();
      if (token) {
        try {
          // Set token in apiClient for authenticated requests
          apiClient.setToken(token);
          
          // Verify token and get user info
          const response = await authService.getCurrentUser();
          
          if (response.success) {
            console.log('[AUTH HOOK] Token verified, user authenticated');
            setIsAuthenticated(true);
            setUser(response.user);
          } else {
            console.log('[AUTH HOOK] Token verification failed, removing token');
            // Token is invalid, remove it
            removeToken();
            apiClient.removeToken();
          }
        } catch (error) {
          console.log('[AUTH HOOK] Error verifying token, removing token', error);
          // Error verifying token, remove it
          removeToken();
          apiClient.removeToken();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('[AUTH HOOK] Attempting login...');
    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        console.log('[AUTH HOOK] Login successful');
        saveToken(response.token);
        apiClient.setToken(response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        return { success: true };
      } else {
        console.log('[AUTH HOOK] Login failed: Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.log('[AUTH HOOK] Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    console.log('[AUTH HOOK] Logging out');
    removeToken();
    apiClient.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    // Clear all cached queries to ensure protected data is cleared
    queryClient.clear();
  };

  return { user, isAuthenticated, loading, login, logout };
};