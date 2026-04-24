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
exports.Producer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CertificateSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    issuedBy: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date },
    documentUrl: { type: String },
    badgeColor: { type: String, default: '#4CAF50' },
}, { _id: true });
const ProducerSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    bio: { type: String, required: true, maxlength: 300 },
    story: { type: String, required: true },
    avatar: { type: String, required: true },
    coverImage: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        district: { type: String, required: true },
        village: String,
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        farmName: { type: String, required: true },
        farmSizeHectares: Number,
        farmDescription: String,
    },
    certificates: { type: [CertificateSchema], default: [] },
    farmImages: { type: [String], default: [] },
    videoUrl: String,
    specializations: { type: [String], default: [] },
    farmingMethods: { type: [String], default: [] },
    socialMedia: {
        instagram: String,
        youtube: String,
        facebook: String,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });
ProducerSchema.index({ 'location.city': 1 });
ProducerSchema.index({ isVerified: 1, isActive: 1 });
exports.Producer = mongoose_1.default.model('Producer', ProducerSchema);
//# sourceMappingURL=Producer.js.map