import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginError {
  message: string;
  errorType?: 'email' | 'password';
}

export interface User {
  id: string;
  email: string;
}

export const authService = {
  // Login
  login: async (credentials: LoginCredentials) => {
    console.log('[AUTH] Attempting login with credentials:', {
      email: credentials.email,
      // Don't log password for security
    });
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      console.log('[AUTH] Login response:', response);
      return response;
    } catch (error: any) {
      console.error('[AUTH] Login error:', error);
      
      // Extract error details from the response
      if (error.response && error.response.data) {
        const errorData: LoginError = error.response.data;
        throw new Error(errorData.message || 'Login failed');
      }
      
      throw new Error('An error occurred during login');
    }
  },

  // Logout
  logout: () => {
    console.log('[AUTH] Logging out');
    apiClient.removeToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log('[AUTH] Checking authentication status, token exists:', !!token);
    return !!token;
  },

  // Get token
  getToken: () => {
    const token = localStorage.getItem('token');
    console.log('[AUTH] Getting token, exists:', !!token);
    return token;
  },

  // Get current user info
  getCurrentUser: () => {
    console.log('[AUTH] Getting current user info');
    return apiClient.get<{ success: boolean; user: User }>('/auth/me');
  }
};