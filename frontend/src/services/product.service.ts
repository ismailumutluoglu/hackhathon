import api from './api';
import type { Product } from '../types';

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
    isCampaign?: boolean;
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

  async createProduct(data: {
    name: string;
    description: string;
    producer?: string;
    category: string;
    price: number;
    unit: string;
    stock: number;
    origin: { city: string; district?: string; farmName?: string };
    images?: string[];
    tags?: string[];
    healthBenefits?: string[];
    isFeatured?: boolean;
    isCampaign?: boolean;
    discountedPrice?: number;
    campaignOriginalPrice?: number;
    campaignEndsAt?: string;
  }) {
    const res = await api.post<{ success: boolean; product: Product }>('/products', data);
    return res.data.product;
  },
};
