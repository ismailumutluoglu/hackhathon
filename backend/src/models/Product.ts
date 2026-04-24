import mongoose, { Document, Schema } from 'mongoose';

export interface INutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

export interface IProductReview {
  _id?: mongoose.Types.ObjectId;
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
  story: string;
  producer: mongoose.Types.ObjectId;
  category: string;
  subCategory?: string;
  tags: string[];
  images: string[];
  price: number;
  discountedPrice?: number;
  unit: string;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  stock: number;
  harvestDate?: Date;
  expiryDate?: Date;
  shelfLifeDays?: number;
  origin: { city: string; district?: string; farmName?: string };
  nutritionFacts?: INutritionFacts;
  healthBenefits: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  certificates: string[];
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
  sugar:    Number,
  sodium:   Number,
}, { _id: false });

const ReviewSchema = new Schema<IProductReview>({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const ProductSchema = new Schema<IProduct>(
  {
    name:                  { type: String, required: true, trim: true },
    slug:                  { type: String, required: true, unique: true, lowercase: true },
    description:           { type: String, required: true },
    story:                 { type: String, default: '' },
    producer:              { type: Schema.Types.ObjectId, ref: 'Producer' },
    category:              { type: String, required: true, enum: ['sebze', 'meyve', 'tahıl', 'süt-ürünleri', 'bal-recel', 'zeytinyağı', 'kuruyemiş', 'bakliyat'] },
    subCategory:           String,
    tags:                  { type: [String], default: [] },
    images:                { type: [String], default: [] },
    price:                 { type: Number, required: true, min: 0 },
    discountedPrice:       Number,
    unit:                  { type: String, required: true, enum: ['kg', 'adet', 'litre', 'gram', 'demet', 'kutu'] },
    minOrderQuantity:      { type: Number, default: 1 },
    maxOrderQuantity:      Number,
    stock:                 { type: Number, required: true, min: 0, default: 0 },
    harvestDate:           Date,
    expiryDate:            Date,
    shelfLifeDays:         Number,
    origin: {
      city:     { type: String, required: true },
      district: String,
      farmName: String,
    },
    nutritionFacts:        NutritionSchema,
    healthBenefits:        { type: [String], default: [] },
    suitableFor:           { type: [String], default: [] },
    notSuitableFor:        { type: [String], default: [] },
    certificates:          { type: [String], default: [] },
    isFeatured:            { type: Boolean, default: false },
    isCampaign:            { type: Boolean, default: false },
    campaignEndsAt:        Date,
    campaignOriginalPrice: Number,
    rating:                { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:           { type: Number, default: 0 },
    reviews:               { type: [ReviewSchema], default: [] },
    soldCount:             { type: Number, default: 0 },
    isActive:              { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ producer: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ isCampaign: 1, campaignEndsAt: 1 });
ProductSchema.index({ suitableFor: 1 });
ProductSchema.index({ notSuitableFor: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
