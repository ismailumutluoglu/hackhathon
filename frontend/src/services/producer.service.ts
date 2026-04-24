import api from './api';
import type { Producer } from '../types';

interface ProducersResponse {
  success: boolean;
  producers: Producer[];
  total: number;
  page: number;
  pages: number;
}

export const producerService = {
  async getProducers(params?: { city?: string; page?: number; limit?: number }) {
    const res = await api.get<ProducersResponse>('/producers', { params });
    return res.data;
  },
};
