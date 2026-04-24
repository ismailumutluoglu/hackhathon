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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    producer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Producer', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    subtotal: { type: Number, required: true },
}, { _id: true });
const StatusUpdateSchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { _id: true });
const OrderSchema = new mongoose_1.Schema({
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        neighborhood: String,
        fullAddress: { type: String, required: true },
    },
    payment: {
        method: { type: String, enum: ['credit_card', 'bank_transfer', 'cash_on_delivery'], required: true },
        status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
        transactionId: String,
        paidAt: Date,
    },
    pricing: {
        subtotal: { type: Number, required: true },
        shippingFee: { type: Number, required: true, default: 0 },
        discount: { type: Number, default: 0 },
        couponCode: String,
        total: { type: Number, required: true },
    },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending' },
    statusHistory: { type: [StatusUpdateSchema], default: [] },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    notes: String,
    isSubscription: { type: Boolean, default: false },
    subscriptionFrequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
    nextOrderDate: Date,
    parentOrderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
exports.Order = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map