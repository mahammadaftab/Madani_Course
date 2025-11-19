// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://madani-course-backend.onrender.com/api';

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('API_BASE_URL:', API_BASE_URL);
}

// Auth token management
export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

// Format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};