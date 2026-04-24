# TAZEKÖY — Tam Geliştirme Planı

**Slogan:** "İlaçsız Tarım. Organik. Sağlıklı."

**Goal:** Organik gıda e-ticaret platformu; şeffaf üretici hikayeleri, AI diyetisyen, kampanya sayacı, canlı sipariş takibi ve admin paneli içerir.

**Architecture:** Monorepo (`/frontend` + `/backend`). Backend REST API, Frontend SPA. AI servisi backend üzerinde OpenAI/Anthropic API ile çalışır.

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion + Zustand + React Router v6 | Node.js + Express.js + TypeScript + MongoDB + Mongoose | OpenAI veya Anthropic API | JWT Authentication

---

## BÖLÜM 1 — PROJE KURULUMU

### Dizin Yapısı (Monorepo)

```
hackhathon/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # MongoDB bağlantısı
│   │   │   └── env.ts             # Environment değişkenleri
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Producer.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   └── AIRecommendation.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── producer.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── producer.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── ai.service.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── producer.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts    # JWT doğrulama
│   │   │   ├── admin.middleware.ts   # Admin rol kontrolü
│   │   │   ├── error.middleware.ts   # Global hata yakalama
│   │   │   └── validate.middleware.ts # Zod schema validasyon
│   │   ├── types/
│   │   │   └── express.d.ts          # Express Request tipini genişlet
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── slugify.ts
│   │   │   └── orderNumber.ts
│   │   └── app.ts
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── CampaignCountdown.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── FeaturedProducts.tsx
│   │   │   ├── product/
│   │   │   │   ├── ProducerCard.tsx
│   │   │   │   ├── FarmMap.tsx
│   │   │   │   ├── CertificateBadge.tsx
│   │   │   │   └── HarvestInfo.tsx
│   │   │   ├── ai/
│   │   │   │   ├── DietitianForm.tsx
│   │   │   │   └── RecommendationCard.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── CartItem.tsx
│   │   │   ├── order/
│   │   │   │   ├── OrderTimeline.tsx
│   │   │   │   └── OrderStatusBadge.tsx
│   │   │   └── ui/                   # Shadcn bileşenleri burada
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── ProducerDetailPage.tsx
│   │   │   ├── DietitianPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminProducts.tsx
│   │   │       ├── AdminProducers.tsx
│   │   │       ├── AdminOrders.tsx
│   │   │       └── AdminAILogs.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts      # Zustand
│   │   │   ├── cartStore.ts
│   │   │   └── uiStore.ts
│   │   ├── services/
│   │   │   ├── api.ts            # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── producer.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── ai.service.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCountdown.ts   # Kampanya geri sayımı
│   │   │   └── useDebounce.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   └── utils.ts          # cn() helper (shadcn için)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docs/
│   └── TAZEKÖY_IMPLEMENTATION_PLAN.md
└── README.md
```

---

## BÖLÜM 2 — MONGOOSE ŞEMALARI (TypeScript ile)

### 2.1 User Modeli — `backend/src/models/User.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  title: string;           // "Ev", "İş"
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface IHealthProfile {
  conditions: string[];          // ['diabetes', 'hypertension', 'celiac', 'lactose_intolerance', 'obesity']
  goals: string[];               // ['weight_loss', 'muscle_gain', 'heart_health', 'energy_boost']
  dietaryRestrictions: string[]; // ['vegan', 'vegetarian', 'gluten_free', 'dairy_free', 'halal']
  allergies: string[];           // ['nuts', 'shellfish', 'eggs', 'soy']
  age?: number;
  weight?: number;               // kg
  height?: number;               // cm
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'admin' | 'producer';
  avatar?: string;
  addresses: IAddress[];
  healthProfile: IHealthProfile;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  title:        { type: String, required: true },
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  city:         { type: String, required: true },
  district:     { type: String, required: true },
  neighborhood: { type: String, required: true },
  fullAddress:  { type: String, required: true },
  isDefault:    { type: Boolean, default: false },
}, { _id: true });

const HealthProfileSchema = new Schema<IHealthProfile>({
  conditions:          { type: [String], default: [] },
  goals:               { type: [String], default: [] },
  dietaryRestrictions: { type: [String], default: [] },
  allergies:           { type: [String], default: [] },
  age:                 { type: Number, min: 1, max: 120 },
  weight:              { type: Number, min: 20, max: 300 },
  height:              { type: Number, min: 50, max: 250 },
}, { _id: false });

const UserSchema = new Schema<IUser>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true, minlength: 8, select: false },
    phone:            { type: String, trim: true },
    role:             { type: String, enum: ['customer', 'admin', 'producer'], default: 'customer' },
    avatar:           { type: String },
    addresses:        { type: [AddressSchema], default: [] },
    healthProfile:    { type: HealthProfileSchema, default: () => ({}) },
    isEmailVerified:  { type: Boolean, default: false },
    isActive:         { type: Boolean, default: true },
    lastLogin:        { type: Date },
  },
  { timestamps: true }
);

// Password hash middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
```

---

### 2.2 Producer (Çiftçi) Modeli — `backend/src/models/Producer.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate {
  name: string;        // "Organik Tarım Sertifikası", "GlobalG.A.P."
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  documentUrl?: string;
  badgeColor?: string; // UI için renk kodu
}

export interface IFarmLocation {
  city: string;
  district: string;
  village?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  farmName: string;
  farmSizeHectares?: number;
  farmDescription?: string;
}

export interface IProducer extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Eğer platforma kayıtlı bir hesabı varsa
  name: string;
  slug: string;
  bio: string;                   // Kısa tanıtım (max 300 karakter)
  story: string;                 // Uzun hikaye (markdown destekli)
  avatar: string;
  coverImage: string;
  location: IFarmLocation;
  certificates: ICertificate[];
  farmImages: string[];          // Tarla görselleri
  videoUrl?: string;             // YouTube/Vimeo tarla tanıtım videosu
  specializations: string[];     // ['sebze', 'meyve', 'bal', 'zeytinyağı', 'tahıl']
  farmingMethods: string[];      // ['permakültür', 'doğal tarım', 'geleneksel yöntem']
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  rating: number;                // 0-5, ortalama
  reviewCount: number;
  totalOrders: number;
  isVerified: boolean;           // Admin tarafından onaylı
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>({
  name:        { type: String, required: true },
  issuedBy:    { type: String, required: true },
  issuedAt:    { type: Date, required: true },
  expiresAt:   { type: Date },
  documentUrl: { type: String },
  badgeColor:  { type: String, default: '#4CAF50' },
}, { _id: true });

const FarmLocationSchema = new Schema<IFarmLocation>({
  city:               { type: String, required: true },
  district:           { type: String, required: true },
  village:            { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  farmName:           { type: String, required: true },
  farmSizeHectares:   { type: Number },
  farmDescription:    { type: String },
}, { _id: false });

const ProducerSchema = new Schema<IProducer>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User' },
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true },
    bio:              { type: String, required: true, maxlength: 300 },
    story:            { type: String, required: true },
    avatar:           { type: String, required: true },
    coverImage:       { type: String, required: true },
    location:         { type: FarmLocationSchema, required: true },
    certificates:     { type: [CertificateSchema], default: [] },
    farmImages:       { type: [String], default: [] },
    videoUrl:         { type: String },
    specializations:  { type: [String], default: [] },
    farmingMethods:   { type: [String], default: [] },
    socialMedia: {
      instagram: String,
      youtube:   String,
      facebook:  String,
    },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
    totalOrders:  { type: Number, default: 0 },
    isVerified:   { type: Boolean, default: false },
    isActive:     { type: Boolean, default: true },
    joinedAt:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProducerSchema.index({ slug: 1 });
ProducerSchema.index({ 'location.city': 1 });
ProducerSchema.index({ isVerified: 1, isActive: 1 });

export const Producer = mongoose.model<IProducer>('Producer', ProducerSchema);
```

---

### 2.3 Product Modeli — `backend/src/models/Product.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface INutritionFacts {
  calories: number;   // kcal / 100g
  protein: number;    // gram
  carbs: number;      // gram
  fat: number;        // gram
  fiber: number;      // gram
  sugar?: number;     // gram
  sodium?: number;    // mg
}

export interface IProductReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  story: string;                       // Ürünün kişisel hikayesi (markdown)
  producer: mongoose.Types.ObjectId;
  category: string;                    // 'sebze' | 'meyve' | 'tahıl' | 'süt-ürünleri' | 'bal-recel' | 'zeytinyağı' | 'kuruyemiş'
  subCategory?: string;
  tags: string[];                      // ['domates', 'antioksidan', 'c-vitamini']
  images: string[];
  price: number;                       // TL
  discountedPrice?: number;
  unit: 'kg' | 'adet' | 'litre' | 'gram' | 'demet' | 'kutu';
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  stock: number;
  harvestDate?: Date;
  expiryDate?: Date;
  shelfLifeDays?: number;
  origin: {
    city: string;
    district?: string;
    farmName?: string;
  };
  nutritionFacts?: INutritionFacts;
  healthBenefits: string[];            // ['kan şekerini dengeler', 'bağışıklığı güçlendirir']
  suitableFor: string[];               // ['diabetes', 'heart_health', 'weight_loss'] — AI için
  notSuitableFor: string[];            // ['hypertension'] — AI için
  certificates: string[];             // ['organik', 'GlobalGAP']
  isFeatured: boolean;
  isCampaign: boolean;
  campaignEndsAt?: Date;
  campaignOriginalPrice?: number;
  rating: number;
  reviewCount: number;
  reviews: IProductReview[];
  soldCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionSchema = new Schema<INutritionFacts>({
  calories: { type: Number, required: true },
  protein:  { type: Number, required: true },
  carbs:    { type: Number, required: true },
  fat:      { type: Number, required: true },
  fiber:    { type: Number, required: true },
  sugar:    { type: Number },
  sodium:   { type: Number },
}, { _id: false });

const ReviewSchema = new Schema<IProductReview>({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const ProductSchema = new Schema<IProduct>(
  {
    name:                 { type: String, required: true, trim: true },
    slug:                 { type: String, required: true, unique: true, lowercase: true },
    description:          { type: String, required: true },
    story:                { type: String, default: '' },
    producer:             { type: Schema.Types.ObjectId, ref: 'Producer', required: true },
    category:             { type: String, required: true, enum: ['sebze', 'meyve', 'tahıl', 'süt-ürünleri', 'bal-recel', 'zeytinyağı', 'kuruyemiş', 'bakliyat'] },
    subCategory:          { type: String },
    tags:                 { type: [String], default: [] },
    images:               { type: [String], default: [] },
    price:                { type: Number, required: true, min: 0 },
    discountedPrice:      { type: Number },
    unit:                 { type: String, required: true, enum: ['kg', 'adet', 'litre', 'gram', 'demet', 'kutu'] },
    minOrderQuantity:     { type: Number, default: 1 },
    maxOrderQuantity:     { type: Number },
    stock:                { type: Number, required: true, min: 0, default: 0 },
    harvestDate:          { type: Date },
    expiryDate:           { type: Date },
    shelfLifeDays:        { type: Number },
    origin: {
      city:     { type: String, required: true },
      district: { type: String },
      farmName: { type: String },
    },
    nutritionFacts:       NutritionSchema,
    healthBenefits:       { type: [String], default: [] },
    suitableFor:          { type: [String], default: [] },
    notSuitableFor:       { type: [String], default: [] },
    certificates:         { type: [String], default: [] },
    isFeatured:           { type: Boolean, default: false },
    isCampaign:           { type: Boolean, default: false },
    campaignEndsAt:       { type: Date },
    campaignOriginalPrice:{ type: Number },
    rating:               { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:          { type: Number, default: 0 },
    reviews:              { type: [ReviewSchema], default: [] },
    soldCount:            { type: Number, default: 0 },
    isActive:             { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ producer: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ isCampaign: 1, campaignEndsAt: 1 });
ProductSchema.index({ suitableFor: 1 });       // AI sorguları için
ProductSchema.index({ notSuitableFor: 1 });    // AI sorguları için
ProductSchema.index({ tags: 1 });
ProductSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

---

### 2.4 Order Modeli — `backend/src/models/Order.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import { IAddress } from './User';

export interface IOrderItem {
  product:     mongoose.Types.ObjectId;
  producer:    mongoose.Types.ObjectId;
  name:        string;
  image:       string;
  price:       number;   // Sipariş anındaki fiyat
  quantity:    number;
  unit:        string;
  subtotal:    number;
}

export type OrderStatus =
  | 'pending'     // Sipariş alındı, ödeme bekleniyor
  | 'confirmed'   // Ödeme onaylandı
  | 'preparing'   // Çiftlikte hazırlanıyor
  | 'shipped'     // Kargoya verildi
  | 'delivered'   // Teslim edildi
  | 'cancelled'   // İptal edildi
  | 'refunded';   // İade edildi

export interface IStatusUpdate {
  status: OrderStatus;
  message: string;       // "Siparişiniz çiftlikten yola çıktı!"
  timestamp: Date;
  updatedBy?: mongoose.Types.ObjectId; // Admin ID
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;       // TAZE-2024-00001
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  payment: {
    method: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
  };
  pricing: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    couponCode?: string;
    total: number;
  };
  status: OrderStatus;
  statusHistory: IStatusUpdate[];
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  isSubscription: boolean;
  subscriptionFrequency?: 'weekly' | 'biweekly' | 'monthly';
  nextOrderDate?: Date;
  parentOrderId?: mongoose.Types.ObjectId; // Abonelik tekrarı ise önceki sipariş
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  producer: { type: Schema.Types.ObjectId, ref: 'Producer', required: true },
  name:     { type: String, required: true },
  image:    { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit:     { type: String, required: true },
  subtotal: { type: Number, required: true },
}, { _id: true });

const StatusUpdateSchema = new Schema<IStatusUpdate>({
  status:    { type: String, required: true },
  message:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { _id: true });

// IAddress schema için inline (User'daki ile aynı yapı)
const AddressSnapshot = new Schema({
  title:        String,
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  city:         { type: String, required: true },
  district:     { type: String, required: true },
  neighborhood: String,
  fullAddress:  { type: String, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber:      { type: String, required: true, unique: true },
    user:             { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items:            { type: [OrderItemSchema], required: true },
    shippingAddress:  { type: AddressSnapshot, required: true },
    payment: {
      method:        { type: String, enum: ['credit_card', 'bank_transfer', 'cash_on_delivery'], required: true },
      status:        { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      transactionId: String,
      paidAt:        Date,
    },
    pricing: {
      subtotal:    { type: Number, required: true },
      shippingFee: { type: Number, required: true, default: 0 },
      discount:    { type: Number, default: 0 },
      couponCode:  String,
      total:       { type: Number, required: true },
    },
    status:               { type: String, enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending' },
    statusHistory:        { type: [StatusUpdateSchema], default: [] },
    trackingNumber:       String,
    estimatedDelivery:    Date,
    deliveredAt:          Date,
    notes:                String,
    isSubscription:       { type: Boolean, default: false },
    subscriptionFrequency:{ type: String, enum: ['weekly', 'biweekly', 'monthly'] },
    nextOrderDate:        Date,
    parentOrderId:        { type: Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ isSubscription: 1, nextOrderDate: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
```

---

### 2.5 AIRecommendation Modeli — `backend/src/models/AIRecommendation.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import { IHealthProfile } from './User';

export interface IProductRecommendation {
  product:      mongoose.Types.ObjectId;
  productName:  string;    // Snapshot (ürün silinse de log kalır)
  reason:       string;    // "Düşük glisemik indeksi nedeniyle diyabetliler için uygundur."
  benefitScore: number;    // 1-10
}

export interface IAvoidProduct {
  product:     mongoose.Types.ObjectId;
  productName: string;
  reason:      string;     // "Yüksek şeker içeriği nedeniyle diyabetliler için önerilmez."
}

export interface IAIRecommendation extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  sessionId: string;               // Aynı oturumun takibi için
  healthProfileSnapshot: IHealthProfile; // İstek anındaki profil kopyası
  userQuery?: string;              // Kullanıcının serbest metin sorusu
  builtPrompt: string;             // AI'a gönderilen tam prompt (debug için)
  response: {
    recommendations: IProductRecommendation[];
    avoidList: IAvoidProduct[];
    summary: string;               // AI'ın genel özeti
    dietaryAdvice: string;         // Ek beslenme önerileri
    disclaimer: string;            // "Bu öneriler tıbbi tavsiye değildir."
  };
  aiProvider: 'openai' | 'anthropic';
  aiModel: string;                 // 'gpt-4o', 'claude-sonnet-4-6'
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  processingTimeMs: number;
  cost?: number;                   // USD cinsinden tahmini maliyet
  isSuccessful: boolean;
  errorMessage?: string;
  userRating?: number;             // Kullanıcı öneri kalitesini puanladı mı (1-5)
  userFeedback?: string;
  createdAt: Date;
}

const ProductRecommendationSchema = new Schema<IProductRecommendation>({
  product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName:  { type: String, required: true },
  reason:       { type: String, required: true },
  benefitScore: { type: Number, required: true, min: 1, max: 10 },
}, { _id: true });

const AvoidProductSchema = new Schema<IAvoidProduct>({
  product:     { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  reason:      { type: String, required: true },
}, { _id: true });

const HealthProfileSnapshotSchema = new Schema({
  conditions:          [String],
  goals:               [String],
  dietaryRestrictions: [String],
  allergies:           [String],
  age:                 Number,
  weight:              Number,
  height:              Number,
}, { _id: false });

const AIRecommendationSchema = new Schema<IAIRecommendation>(
  {
    user:                   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId:              { type: String, required: true },
    healthProfileSnapshot:  { type: HealthProfileSnapshotSchema, required: true },
    userQuery:              String,
    builtPrompt:            { type: String, required: true, select: false }, // Güvenlik: default gizli
    response: {
      recommendations:  { type: [ProductRecommendationSchema], default: [] },
      avoidList:        { type: [AvoidProductSchema], default: [] },
      summary:          { type: String, required: true },
      dietaryAdvice:    { type: String, required: true },
      disclaimer:       { type: String, default: 'Bu öneriler tıbbi tavsiye değildir. Lütfen doktorunuza danışın.' },
    },
    aiProvider:         { type: String, enum: ['openai', 'anthropic'], required: true },
    aiModel:            { type: String, required: true },
    tokensUsed: {
      input:  { type: Number, default: 0 },
      output: { type: Number, default: 0 },
      total:  { type: Number, default: 0 },
    },
    processingTimeMs: { type: Number, required: true },
    cost:             Number,
    isSuccessful:     { type: Boolean, required: true },
    errorMessage:     String,
    userRating:       { type: Number, min: 1, max: 5 },
    userFeedback:     String,
  },
  { timestamps: true }
);

AIRecommendationSchema.index({ user: 1, createdAt: -1 });
AIRecommendationSchema.index({ isSuccessful: 1 });
AIRecommendationSchema.index({ aiProvider: 1, aiModel: 1 });

export const AIRecommendation = mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
```

---

## BÖLÜM 3 — BACKEND MİMARİSİ

### 3.1 Environment Değişkenleri — `backend/.env.example`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tazekoy
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=another_secret_for_refresh
REFRESH_TOKEN_EXPIRES_IN=30d
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=anthropic
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### 3.2 Express App Kurulumu — `backend/src/app.ts`

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import authRoutes     from './routes/auth.routes';
import userRoutes     from './routes/user.routes';
import productRoutes  from './routes/product.routes';
import producerRoutes from './routes/producer.routes';
import orderRoutes    from './routes/order.routes';
import aiRoutes       from './routes/ai.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Güvenlik middleware'leri
app.use(helmet());
app.use(mongoSanitize()); // NoSQL injection koruması

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,
  message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
});
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 10, // AI endpoint'i daha kısıtlı
});
app.use('/api/', limiter);
app.use('/api/ai', aiLimiter);

app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/producers',producerRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/ai',       aiRoutes);

app.use(errorMiddleware);

export default app;
```

---

### 3.3 RESTful API Endpoint Planı

#### AUTH — `/api/auth`
| Method | Endpoint              | Açıklama                        | Auth |
|--------|-----------------------|---------------------------------|------|
| POST   | `/register`           | Yeni kullanıcı kaydı            | —    |
| POST   | `/login`              | JWT token al                    | —    |
| POST   | `/logout`             | Token geçersizleştir            | ✓    |
| POST   | `/refresh-token`      | Yeni access token al            | —    |
| GET    | `/me`                 | Aktif kullanıcı bilgisi         | ✓    |

#### USERS — `/api/users`
| Method | Endpoint                    | Açıklama                         | Auth  |
|--------|-----------------------------|----------------------------------|-------|
| GET    | `/profile`                  | Profil bilgilerini getir         | ✓     |
| PATCH  | `/profile`                  | Profil güncelle                  | ✓     |
| PATCH  | `/health-profile`           | Sağlık profilini güncelle        | ✓     |
| POST   | `/addresses`                | Yeni adres ekle                  | ✓     |
| PATCH  | `/addresses/:id`            | Adresi güncelle                  | ✓     |
| DELETE | `/addresses/:id`            | Adresi sil                       | ✓     |

#### PRODUCTS — `/api/products`
| Method | Endpoint                    | Açıklama                                       | Auth   |
|--------|-----------------------------|------------------------------------------------|--------|
| GET    | `/`                         | Tüm ürünler (filtre + sayfalama + arama)       | —      |
| GET    | `/featured`                 | Öne çıkan ürünler                              | —      |
| GET    | `/campaigns`                | Aktif kampanya ürünleri                        | —      |
| GET    | `/:slug`                    | Tek ürün detayı (producer populate)            | —      |
| POST   | `/`                         | Yeni ürün ekle                                 | Admin  |
| PATCH  | `/:id`                      | Ürün güncelle                                  | Admin  |
| DELETE | `/:id`                      | Ürün sil (soft delete)                         | Admin  |
| POST   | `/:id/reviews`              | Ürüne yorum ekle                               | ✓      |

#### PRODUCERS — `/api/producers`
| Method | Endpoint                    | Açıklama                         | Auth   |
|--------|-----------------------------|----------------------------------|--------|
| GET    | `/`                         | Tüm çiftçiler                    | —      |
| GET    | `/:slug`                    | Çiftçi detayı + ürünleri         | —      |
| POST   | `/`                         | Yeni çiftçi ekle                 | Admin  |
| PATCH  | `/:id`                      | Çiftçi güncelle                  | Admin  |
| DELETE | `/:id`                      | Çiftçi sil                       | Admin  |

#### ORDERS — `/api/orders`
| Method | Endpoint                    | Açıklama                          | Auth   |
|--------|-----------------------------|-----------------------------------|--------|
| GET    | `/`                         | Kullanıcının siparişleri           | ✓      |
| GET    | `/:id`                      | Sipariş detayı                    | ✓      |
| POST   | `/`                         | Yeni sipariş oluştur              | ✓      |
| PATCH  | `/:id/cancel`               | Sipariş iptal                     | ✓      |
| GET    | `/admin/all`                | Tüm siparişler (admin)            | Admin  |
| PATCH  | `/admin/:id/status`         | Sipariş durumu güncelle           | Admin  |

#### AI — `/api/ai`
| Method | Endpoint                    | Açıklama                              | Auth |
|--------|-----------------------------|---------------------------------------|------|
| POST   | `/recommend`                | Sağlık profiline göre öneri al        | ✓    |
| GET    | `/history`                  | Kullanıcının AI öneri geçmişi         | ✓    |
| PATCH  | `/:id/feedback`             | Öneriye puan/geri bildirim            | ✓    |
| GET    | `/admin/logs`               | Tüm AI logları (admin)                | Admin|

---

### 3.4 AI Servis Mantığı — `backend/src/services/ai.service.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { IHealthProfile } from '../models/User';
import { Product } from '../models/Product';
import { AIRecommendation } from '../models/AIRecommendation';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateRecommendations(
  userId: string,
  healthProfile: IHealthProfile,
  userQuery?: string
) {
  const startTime = Date.now();

  // 1. Veritabanından aktif ürünleri çek
  const products = await Product.find({ isActive: true })
    .populate('producer', 'name location.city')
    .select('name slug category tags healthBenefits suitableFor notSuitableFor nutritionFacts price unit');

  // 2. Ürün listesini AI'a anlamlı biçimde aktar
  const productList = products.map(p => ({
    id: p._id.toString(),
    name: p.name,
    category: p.category,
    suitableFor: p.suitableFor,
    notSuitableFor: p.notSuitableFor,
    healthBenefits: p.healthBenefits,
    nutritionFacts: p.nutritionFacts,
  }));

  // 3. Prompt oluştur
  const systemPrompt = `Sen TAZEKÖY organik gıda platformunun yapay zeka diyetisyenisin.
Görevin: Kullanıcının sağlık profiline ve sorduğu soruya göre platform ürünleri arasından kişiselleştirilmiş öneriler sunmak.
Önerilerini Türkçe, samimi ve anlaşılır bir dille yap.
ÖNEMLI: Yanıtını her zaman geçerli JSON formatında döndür.`;

  const userPrompt = `
Kullanıcı Sağlık Profili:
- Sağlık durumları: ${healthProfile.conditions.join(', ') || 'belirtilmemiş'}
- Hedefler: ${healthProfile.goals.join(', ') || 'belirtilmemiş'}
- Diyet kısıtlamaları: ${healthProfile.dietaryRestrictions.join(', ') || 'yok'}
- Alerjiler: ${healthProfile.allergies.join(', ') || 'yok'}
${healthProfile.age ? `- Yaş: ${healthProfile.age}` : ''}
${userQuery ? `\nKullanıcının sorusu: "${userQuery}"` : ''}

Mevcut Ürünler:
${JSON.stringify(productList, null, 2)}

Aşağıdaki JSON formatında yanıt ver:
{
  "recommendations": [
    {
      "productId": "...",
      "productName": "...",
      "reason": "Bu ürünü neden önerdiğini açıkla (1-2 cümle)",
      "benefitScore": 8
    }
  ],
  "avoidList": [
    {
      "productId": "...",
      "productName": "...",
      "reason": "Neden kaçınması gerektiğini açıkla"
    }
  ],
  "summary": "Genel özet (2-3 cümle)",
  "dietaryAdvice": "Ek beslenme önerileri"
}

Maksimum 6 öneri, 3 kaçınılacak ürün ver.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const processingTimeMs = Date.now() - startTime;
  const rawContent = message.content[0].type === 'text' ? message.content[0].text : '';
  const parsed = JSON.parse(rawContent);

  // 4. Ürün ID'lerini MongoDB ObjectId ile eşleştir
  const recommendations = parsed.recommendations.map((r: any) => {
    const prod = products.find(p => p._id.toString() === r.productId);
    return {
      product: prod!._id,
      productName: r.productName,
      reason: r.reason,
      benefitScore: r.benefitScore,
    };
  });

  const avoidList = parsed.avoidList.map((a: any) => {
    const prod = products.find(p => p._id.toString() === a.productId);
    return {
      product: prod!._id,
      productName: a.productName,
      reason: a.reason,
    };
  });

  // 5. Log kaydet
  const sessionId = `${userId}-${Date.now()}`;
  await AIRecommendation.create({
    user: userId,
    sessionId,
    healthProfileSnapshot: healthProfile,
    userQuery,
    builtPrompt: userPrompt,
    response: {
      recommendations,
      avoidList,
      summary: parsed.summary,
      dietaryAdvice: parsed.dietaryAdvice,
      disclaimer: 'Bu öneriler tıbbi tavsiye değildir. Lütfen doktorunuza danışın.',
    },
    aiProvider: 'anthropic',
    aiModel: 'claude-sonnet-4-6',
    tokensUsed: {
      input: message.usage.input_tokens,
      output: message.usage.output_tokens,
      total: message.usage.input_tokens + message.usage.output_tokens,
    },
    processingTimeMs,
    isSuccessful: true,
  });

  return { recommendations, avoidList, summary: parsed.summary, dietaryAdvice: parsed.dietaryAdvice };
}
```

---

## BÖLÜM 4 — FRONTEND MİMARİSİ

### 4.1 Temel Tip Tanımları — `frontend/src/types/index.ts`

```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'producer';
  avatar?: string;
  addresses: Address[];
  healthProfile: HealthProfile;
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
    coordinates: { lat: number; lng: number };
    farmName: string;
  };
  certificates: Certificate[];
  farmImages: string[];
  specializations: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface Certificate {
  _id: string;
  name: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  badgeColor?: string;
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
  stock: number;
  harvestDate?: string;
  origin: { city: string; district?: string; farmName?: string };
  nutritionFacts?: NutritionFacts;
  healthBenefits: string[];
  certificates: string[];
  isFeatured: boolean;
  isCampaign: boolean;
  campaignEndsAt?: string;
  rating: number;
  reviewCount: number;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory: StatusUpdate[];
  pricing: { subtotal: number; shippingFee: number; discount: number; total: number };
  estimatedDelivery?: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

export interface StatusUpdate {
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface AIRecommendationResult {
  recommendations: {
    product: Product;
    reason: string;
    benefitScore: number;
  }[];
  avoidList: {
    product: Product;
    reason: string;
  }[];
  summary: string;
  dietaryAdvice: string;
}
```

---

### 4.2 Zustand Store'lar

#### Auth Store — `frontend/src/store/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'tazekoy-auth' }
  )
);
```

#### Cart Store — `frontend/src/store/cartStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  get total(): number;
  get itemCount(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product._id === product._id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.product._id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map(i =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      get total() {
        return get().items.reduce((sum, item) => {
          const price = item.product.discountedPrice ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'tazekoy-cart' }
  )
);
```

---

### 4.3 Axios API Servis — `frontend/src/services/api.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor: JWT ekle
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 → logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4.4 Tailwind Renk Paleti — `frontend/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ana marka renkleri
        primary: {
          50:  '#f0fdf0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#3d8b37',  // Ana yeşil
          600: '#2d6a27',
          700: '#1e4a1a',
          800: '#14321a',
          900: '#0a1f0d',
        },
        // Toprak tonları
        earth: {
          50:  '#fdf8f0',
          100: '#f9edd8',
          200: '#f1d9aa',
          300: '#e8c07a',
          400: '#d4994f',
          500: '#b87333',  // Toprak kahvesi
          600: '#8b5a2b',
          700: '#6b3f1e',
          800: '#4a2b12',
          900: '#2d1a0a',
        },
        // Krem/ekru arka plan
        cream: {
          50:  '#fffef7',
          100: '#fffbeb',
          200: '#fef3c7',
          DEFAULT: '#fef9ee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Başlıklar için
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

### 4.5 React Router Yapısı — `frontend/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProducerDetailPage from './pages/ProducerDetailPage';
import DietitianPage     from './pages/DietitianPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrdersPage        from './pages/OrdersPage';
import ProfilePage       from './pages/ProfilePage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminProducts     from './pages/admin/AdminProducts';
import AdminOrders       from './pages/admin/AdminOrders';
import AdminProducers    from './pages/admin/AdminProducers';
import AdminAILogs       from './pages/admin/AdminAILogs';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="urunler" element={<ProductsPage />} />
          <Route path="urunler/:slug" element={<ProductDetailPage />} />
          <Route path="ureticiler/:slug" element={<ProducerDetailPage />} />
          <Route path="diyetisyen" element={<DietitianPage />} />
          <Route path="sepet" element={<CartPage />} />
          <Route path="giris" element={<LoginPage />} />
          <Route path="kayit" element={<RegisterPage />} />

          {/* Korumalı rotalar */}
          <Route path="odeme" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="siparislerim" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin panel */}
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/urunler" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="admin/ureticiler" element={<AdminRoute><AdminProducers /></AdminRoute>} />
          <Route path="admin/siparisler" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="admin/ai-loglar" element={<AdminRoute><AdminAILogs /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## BÖLÜM 5 — GELİŞTİRME ADIMLARI (Sıralı)

### Adım 1 — Backend Kurulumu
```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet express-rate-limit express-mongo-sanitize @anthropic-ai/sdk zod
npm install -D typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken @types/cors nodemon ts-node
npx tsc --init
```

### Adım 2 — Frontend Kurulumu
```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios zustand react-router-dom framer-motion @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init
```

### Adım 3 — Geliştirme Sırası
1. Backend: Config + Models + Error middleware
2. Backend: Auth routes (register, login, /me)
3. Backend: Product + Producer CRUD API
4. Backend: Order API + status güncellemeleri
5. Backend: AI Service + /recommend endpoint
6. Frontend: Layout (Header + Footer) + Routing
7. Frontend: HomePage (Hero + Kampanya sayacı + Ürün kartları)
8. Frontend: ProductDetailPage (Üretici bilgisi + Hasat tarihi + Harita)
9. Frontend: DietitianPage (Form + AI öneri sonuçları)
10. Frontend: Cart + Checkout akışı
11. Frontend: OrdersPage + Canlı takip
12. Frontend: Admin Panel

---

## BÖLÜM 6 — ÖNEMLİ NOTLAR VE GELİŞTİRME PRENSİPLERİ

### Güvenlik
- Şifreler her zaman bcrypt ile hash (salt rounds: 12)
- JWT: access token 7 gün, httpOnly cookie tercih et
- Mongoose `mongoSanitize` ile NoSQL injection engelle
- `helmet` ile HTTP header güvenliği
- Rate limiting: genel API 100 req/15min, AI 10 req/saat
- Input validation için Zod şemaları (frontend + backend)

### Performans
- Sık sorgulanan alanlara MongoDB index (slug, category, suitableFor)
- AI servisi yüklü ürün listesini önbelleğe alabilir (Redis opsiyonel)
- Frontend: React.lazy + Suspense ile code splitting
- Görseller için Cloudinary CDN

### UI/UX Kuralları
- Primary yeşil: `#3d8b37`, toprak kahvesi: `#b87333`, arka plan: `#fef9ee`
- Başlıklar: Playfair Display (serif), gövde metin: Inter
- Ürün kartlarında hover'da Framer Motion scale animasyonu
- Kampanya sayacı kırmızı/turuncu renk geçişi ile dikkat çeker
- Sipariş takibi: dikey timeline, aktif adım vurgulu

### Veritabanı İpuçları
- `suitableFor` ve `notSuitableFor` alanları AI filtreleme için kritik — ürün eklenirken mutlaka doldurulmalı
- Sipariş anındaki fiyatı `OrderItem.price` içinde saklıyoruz (Product.price değişse bile tarihsel kayıt korunur)
- `AIRecommendation.builtPrompt` alanı `select: false` — normal sorgularda gelmez, admin debug için açılır

---

*Plan Tarihi: 2026-04-24 | Versiyon: 1.0*
