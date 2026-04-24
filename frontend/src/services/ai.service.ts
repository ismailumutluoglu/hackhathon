import api from './api';
import type { AIRecommendationResult } from '../types';

export const aiService = {
  async getRecommendations(userQuery?: string) {
    const res = await api.post<{ success: boolean; recommendation: AIRecommendationResult }>('/ai/recommend', { userQuery });
    return res.data.recommendation;
  },

  async getHistory() {
    const res = await api.get<{ success: boolean; history: AIRecommendationResult[] }>('/ai/history');
    return res.data.history;
  },

  async submitFeedback(id: string, rating: number, feedback?: string) {
    const res = await api.patch(`/ai/${id}/feedback`, { rating, feedback });
    return res.data;
  },
};
