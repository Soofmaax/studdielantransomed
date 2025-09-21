import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available (client-side only)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token');
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
      headers['Authorization'] = `Bearer ${token}`;
      config.headers = headers;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      window.localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;