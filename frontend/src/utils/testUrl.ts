import { API_BASE_URL } from './index';

console.log('API_BASE_URL:', API_BASE_URL);

// Test URL construction
const baseUrl = API_BASE_URL;
const endpoint = '/auth/login';

// Ensure baseUrl ends with a trailing slash
const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
// Ensure endpoint starts with a slash
const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
const url = `${normalizedBaseUrl.slice(0, -1)}${normalizedEndpoint}`;

console.log('Constructed URL:', url);