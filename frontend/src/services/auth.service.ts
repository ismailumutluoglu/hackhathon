import api from './api';
import type { User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', data);
    return res.data;
  },

  async getMe() {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data.user;
  },
};
