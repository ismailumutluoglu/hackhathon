"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NutritionSchema = new mongoose_1.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: Number,
    sodium: Number,
}, { _id: false });
const ReviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    story: { type: String, default: '' },
    producer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Producer', required: true },
    category: { type: String, required: true, enum: ['sebze', 'meyve', 'tahıl', 'süt-ürünleri', 'bal-recel', 'zeytinyağı', 'kuruyemiş', 'bakliyat'] },
    subCategory: String,
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: Number,
    unit: { type: String, required: true, enum: ['kg', 'adet', 'litre', 'gram', 'demet', 'kutu'] },
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: Number,
    stock: { type: Number, required: true, min: 0, default: 0 },
    harvestDate: Date,
    expiryDate: Date,
    shelfLifeDays: Number,
    origin: {
        city: { type: String, required: true },
        district: String,
        farmName: String,
    },
    nutritionFacts: NutritionSchema,
    healthBenefits: { type: [String], default: [] },
    suitableFor: { type: [String], default: [] },
    notSuitableFor: { type: [String], default: [] },
    certificates: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isCampaign: { type: Boolean, default: false },
    campaignEndsAt: Date,
    campaignOriginalPrice: Number,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    reviews: { type: [ReviewSchema], default: [] },
    soldCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ producer: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ isCampaign: 1, campaignEndsAt: 1 });
ProductSchema.index({ suitableFor: 1 });
ProductSchema.index({ notSuitableFor: 1 });
exports.Product = mongoose_1.default.model('Product', ProductSchema);
//# sourceMappingURL=Product.js.map