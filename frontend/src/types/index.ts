export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'producer';
  avatar?: string;
  addresses?: Address[];
  healthProfile?: HealthProfile;
}

export interface HealthProfile {
  conditions: string[];
  goals: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  age?: number;
  weight?: number;
  height?: number;
}

export interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface Certificate {
  _id: string;
  name: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  badgeColor?: string;
}

export interface Producer {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  story: string;
  avatar: string;
  coverImage: string;
  location: {
    city: string;
    district: string;
    village?: string;
    coordinates: { lat: number; lng: number };
    farmName: string;
    farmSizeHectares?: number;
    farmDescription?: string;
  };
  certificates: Certificate[];
  farmImages: string[];
  videoUrl?: string;
  specializations: string[];
  farmingMethods: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

export interface ProductReview {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  producer: Producer;
  category: string;
  tags: string[];
  images: string[];
  price: number;
  discountedPrice?: number;
  unit: string;
  minOrderQuantity: number;
  stock: number;
  harvestDate?: string;
  origin: { city: string; district?: string; farmName?: string };
  nutritionFacts?: NutritionFacts;
  healthBenefits: string[];
  certificates: string[];
  isFeatured: boolean;
  isCampaign: boolean;
  campaignEndsAt?: string;
  campaignOriginalPrice?: number;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  soldCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface StatusUpdate {
  _id: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: {
    product: string | Product;
    name: string;
    image: string;
    price: number;
    quantity: number;
    unit: string;
    subtotal: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    fullAddress: string;
  };
  payment: { method: string; status: string };
  pricing: { subtotal: number; shippingFee: number; discount: number; total: number };
  status: OrderStatus;
  statusHistory: StatusUpdate[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  isSubscription: boolean;
  createdAt: string;
}

export interface AIRecommendationResult {
  _id: string;
  response: {
    recommendations: {
      _id: string;
      product: Product;
      reason: string;
      benefitScore: number;
    }[];
    avoidList: {
      _id: string;
      product: Product;
      reason: string;
    }[];
    summary: string;
    dietaryAdvice: string;
    disclaimer: string;
  };
  sessionId: string;
  createdAt: string;
}
