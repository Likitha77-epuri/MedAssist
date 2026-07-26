import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getApiError = (err, defaultMsg = 'An error occurred') => {
  if (!err.response) {
    return `Network Error: Cannot connect to backend (${API_URL}). Check VITE_API_URL in Vercel settings.`;
  }
  return err.response?.data?.detail || defaultMsg;
};

export default api;
