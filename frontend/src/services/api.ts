import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname === '/giris' || window.location.pathname === '/kayit';
    if (error.response?.status === 401 && !isAuthPage) {
      useAuthStore.getState().logout();
      window.location.href = '/giris';
    }
    return Promise.reject(error);
  }
);

export default api;
