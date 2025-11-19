import { API_BASE_URL } from '../utils';

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    // Remove trailing slash if present to avoid double slashes
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Construct URL without double slashes
    const url = `${this.baseUrl}${normalizedEndpoint}`;
    
    console.log(`[API] Making request to: ${url}`, { method: options.method || 'GET' });
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      console.log(`[API] Response received from ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (response.status === 204 || response.status === 200) {
          // Return empty object for successful responses with no content
          return {} as T;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // Handle empty response body
      const text = await response.text();
      console.log(`[API] Response body from ${url}:`, text);
      
      if (!text) {
        return {} as T;
      }
      
      return JSON.parse(text);
    } catch (error) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Method for handling FormData requests (e.g., file uploads)
  upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const config: RequestInit = {
      method: 'POST',
      body: formData,
    };

    if (this.token) {
      config.headers = {
        'Authorization': `Bearer ${this.token}`,
      };
    }

    return this.request<T>(endpoint, config);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);