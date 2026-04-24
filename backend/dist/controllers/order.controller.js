"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.getOrder = getOrder;
exports.cancelOrder = cancelOrder;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const error_middleware_1 = require("../middlewares/error.middleware");
const orderNumber_1 = require("../utils/orderNumber");
async function createOrder(req, res, next) {
    try {
        const { items, shippingAddress, payment, notes, isSubscription, subscriptionFrequency } = req.body;
        if (!items?.length)
            throw new error_middleware_1.AppError('Sepet boş olamaz.', 400);
        // Ürünleri doğrula ve fiyatları hesapla
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product_1.Product.findById(item.productId).populate('producer', '_id');
            if (!product || !product.isActive)
                throw new error_middleware_1.AppError(`Ürün bulunamadı: ${item.productId}`, 400);
            if (product.stock < item.quantity)
                throw new error_middleware_1.AppError(`"${product.name}" için yeterli stok yok.`, 400);
            const price = product.discountedPrice ?? product.price;
            const itemSubtotal = price * item.quantity;
            subtotal += itemSubtotal;
            orderItems.push({
                product: product._id,
                producer: product.producer._id,
                name: product.name,
                image: product.images[0] || '',
                price,
                quantity: item.quantity,
                unit: product.unit,
                subtotal: itemSubtotal,
            });
            // Stok düş
            product.stock -= item.quantity;
            product.soldCount += item.quantity;
            await product.save({ validateBeforeSave: false });
        }
        const shippingFee = subtotal >= 500 ? 0 : 29.90;
        const total = subtotal + shippingFee;
        const orderNumber = await (0, orderNumber_1.generateOrderNumber)();
        const order = await Order_1.Order.create({
            orderNumber,
            user: req.userId,
            items: orderItems,
            shippingAddress,
            payment,
            pricing: { subtotal, shippingFee, discount: 0, total },
            status: 'pending',
            statusHistory: [{ status: 'pending', message: 'Siparişiniz alındı, ödeme bekleniyor.', timestamp: new Date() }],
            notes,
            isSubscription: isSubscription || false,
            subscriptionFrequency,
        });
        res.status(201).json({ success: true, order });
    }
    catch (err) {
        next(err);
    }
}
async function getUserOrders(req, res, next) {
    try {
        const orders = await Order_1.Order.find({ user: req.userId }).sort('-createdAt').select('-__v');
        res.json({ success: true, orders });
    }
    catch (err) {
        next(err);
    }
}
async function getOrder(req, res, next) {
    try {
        const order = await Order_1.Order.findById(req.params.id).populate('items.product', 'name images slug');
        if (!order)
            throw new error_middleware_1.AppError('Sipariş bulunamadı.', 404);
        if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
            throw new error_middleware_1.AppError('Bu siparişe erişim yetkiniz yok.', 403);
        }
        res.json({ success: true, order });
    }
    catch (err) {
        next(err);
    }
}
async function cancelOrder(req, res, next) {
    try {
        const order = await Order_1.Order.findById(req.params.id);
        if (!order)
            throw new error_middleware_1.AppError('Sipariş bulunamadı.', 404);
        if (order.user.toString() !== req.userId)
            throw new error_middleware_1.AppError('Yetkisiz işlem.', 403);
        if (!['pending', 'confirmed'].includes(order.status)) {
            throw new error_middleware_1.AppError('Bu aşamada sipariş iptal edilemez.', 400);
        }
        order.status = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', message: 'Sipariş müşteri tarafından iptal edildi.', timestamp: new Date() });
        await order.save();
        res.json({ success: true, message: 'Sipariş iptal edildi.', order });
    }
    catch (err) {
        next(err);
    }
}
// Admin
async function getAllOrders(req, res, next) {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [orders, total] = await Promise.all([
            Order_1.Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)),
            Order_1.Order.countDocuments(filter),
        ]);
        res.json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
    }
    catch (err) {
        next(err);
    }
}
async function updateOrderStatus(req, res, next) {
    try {
        const { status, message } = req.body;
        const order = await Order_1.Order.findById(req.params.id);
        if (!order)
            throw new error_middleware_1.AppError('Sipariş bulunamadı.', 404);
        order.status = status;
        order.statusHistory.push({ status, message: message || `Sipariş durumu: ${status}`, timestamp: new Date(), updatedBy: req.userId });
        if (status === 'delivered')
            order.deliveredAt = new Date();
        await order.save();
        res.json({ success: true, order });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=order.controller.js.map