import api from './api';
import { Product } from '../types';

interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export const productService = {
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    const res = await api.get<ProductsResponse>('/products', { params });
    return res.data;
  },

  async getFeatured() {
    const res = await api.get<{ success: boolean; products: Product[] }>('/products/featured');
    return res.data.products;
  },

  async getCampaigns() {
    const res = await api.get<{ success: boolean; products: Product[] }>('/products/campaigns');
    return res.data.products;
  },

  async getProduct(slug: string) {
    const res = await api.get<{ success: boolean; product: Product }>(`/products/${slug}`);
    return res.data.product;
  },

  async addReview(productId: string, data: { rating: number; comment: string }) {
    const res = await api.post(`/products/${productId}/reviews`, data);
    return res.data;
  },
};
