import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  producer?: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

export interface IStatusUpdate {
  _id?: mongoose.Types.ObjectId;
  status: OrderStatus;
  message: string;
  timestamp: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string;
    fullAddress: string;
  };
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
  parentOrderId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  producer: { type: Schema.Types.ObjectId, ref: 'Producer' },
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

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items:       { type: [OrderItemSchema], required: true },
    shippingAddress: {
      fullName:     { type: String, required: true },
      phone:        { type: String, required: true },
      city:         { type: String, required: true },
      district:     { type: String, required: true },
      neighborhood: String,
      fullAddress:  { type: String, required: true },
    },
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
    status:                { type: String, enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending' },
    statusHistory:         { type: [StatusUpdateSchema], default: [] },
    trackingNumber:        String,
    estimatedDelivery:     Date,
    deliveredAt:           Date,
    notes:                 String,
    isSubscription:        { type: Boolean, default: false },
    subscriptionFrequency: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
    nextOrderDate:         Date,
    parentOrderId:         { type: Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
