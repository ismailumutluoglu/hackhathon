import mongoose, { Document } from 'mongoose';
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
    origin: {
        city: string;
        district?: string;
        farmName?: string;
    };
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
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Product.d.ts.map