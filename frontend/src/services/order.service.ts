import api from './api';
import type { Order } from '../types';

export const orderService = {
  async createOrder(data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: object;
    payment: { method: string };
    notes?: string;
    isSubscription?: boolean;
    subscriptionFrequency?: string;
  }) {
    const res = await api.post<{ success: boolean; order: Order }>('/orders', data);
    return res.data.order;
  },

  async getOrders() {
    const res = await api.get<{ success: boolean; orders: Order[] }>('/orders');
    return res.data.orders;
  },

  async getOrder(id: string) {
    const res = await api.get<{ success: boolean; order: Order }>(`/orders/${id}`);
    return res.data.order;
  },

  async cancelOrder(id: string) {
    const res = await api.patch(`/orders/${id}/cancel`);
    return res.data;
  },
};
