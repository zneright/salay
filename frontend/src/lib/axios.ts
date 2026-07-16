import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Placeholders for authentication tokens)
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Translates and formats server errors)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error reporting
    const status = error.response?.status;
    const data = error.response?.data;
    
    const formattedError = {
      status: status || 500,
      message: data?.message || error.message || 'An unexpected error occurred.',
      details: data?.details || null,
      code: data?.error_code || 'NETWORK_ERROR',
    };
    
    return Promise.reject(formattedError);
  }
);
