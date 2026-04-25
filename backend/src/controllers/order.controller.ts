import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generateOrderNumber } from '../utils/orderNumber';

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, shippingAddress, payment, notes, isSubscription, subscriptionFrequency } = req.body;
    if (!items?.length) throw new AppError('Sepet boş olamaz.', 400);

    // Ürünleri doğrula ve fiyatları hesapla
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('producer', '_id');
      if (!product || !product.isActive) throw new AppError(`Ürün bulunamadı: ${item.productId}`, 400);
      if (product.stock < item.quantity) throw new AppError(`"${product.name}" için yeterli stok yok.`, 400);

      const price = product.discountedPrice ?? product.price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        producer: product.producer ? (product.producer as any)._id : undefined,
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
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
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
  } catch (err) { next(err); }
}

export async function getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const isAdmin = req.userRole === 'admin';
    const filter = isAdmin ? {} : { user: req.userId };
    const query = Order.find(filter).sort('-createdAt').select('-__v');
    if (isAdmin) query.populate('user', 'name email');
    const orders = await query;
    res.json({ success: true, orders });
  } catch (err) { next(err); }
}

export async function getOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
    if (!order) throw new AppError('Sipariş bulunamadı.', 404);
    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      throw new AppError('Bu siparişe erişim yetkiniz yok.', 403);
    }
    res.json({ success: true, order });
  } catch (err) { next(err); }
}

export async function cancelOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError('Sipariş bulunamadı.', 404);
    if (order.user.toString() !== req.userId) throw new AppError('Yetkisiz işlem.', 403);
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new AppError('Bu aşamada sipariş iptal edilemez.', 400);
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', message: 'Sipariş müşteri tarafından iptal edildi.', timestamp: new Date() });
    await order.save();

    res.json({ success: true, message: 'Sipariş iptal edildi.', order });
  } catch (err) { next(err); }
}

// Admin
export async function getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError('Sipariş bulunamadı.', 404);

    order.status = status;
    order.statusHistory.push({ status, message: message || `Sipariş durumu: ${status}`, timestamp: new Date(), updatedBy: req.userId as any });

    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    res.json({ success: true, order });
  } catch (err) { next(err); }
}
