import mongoose, { Document } from 'mongoose';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export interface IOrderItem {
    _id?: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    producer: mongoose.Types.ObjectId;
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
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Order.d.ts.map