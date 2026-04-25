import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, MapPin, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import type { Order } from '../types';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order: Order | undefined = location.state?.order;

  useEffect(() => {
    if (!order) navigate('/', { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  const paymentLabels: Record<string, string> = {
    credit_card: 'Kredi / Banka Kartı',
    bank_transfer: 'Havale / EFT',
    cash_on_delivery: 'Kapıda Ödeme',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-cream-50 to-stone-50 flex flex-col items-center justify-start py-12 px-4">

      {/* Success animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="relative mb-8"
      >
        {/* Outer pulse rings */}
        <span className="absolute inset-0 rounded-full bg-primary-200 animate-ping" style={{ animationDuration: '2s' }} />
        <span className="absolute inset-2 rounded-full bg-primary-100" />
        <div className="relative w-28 h-28 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-300">
          <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary-500 mb-2">Tebrikler!</p>
        <h1 className="font-display text-4xl font-bold text-stone-800 mb-3">Siparişiniz Alındı</h1>
        <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed">
          Siparişiniz başarıyla oluşturuldu. Kargoya verildiğinde size bildirim göndereceğiz.
        </p>
      </motion.div>

      {/* Order number badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-3 bg-white border border-primary-100 px-6 py-3 rounded-2xl shadow-sm">
          <Package className="w-5 h-5 text-primary-500" />
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Sipariş No</p>
            <p className="font-bold text-stone-800 text-lg tracking-wide">{order.orderNumber}</p>
          </div>
        </div>
      </motion.div>

      {/* Order detail card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-6"
      >
        {/* Items */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> Sipariş İçeriği
          </p>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name}
                    className="w-11 h-11 rounded-xl object-cover border border-stone-100 flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 text-lg">
                    🌿
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                  <p className="text-xs text-stone-400">{item.quantity} × {item.unit}</p>
                </div>
                <span className="text-sm font-bold text-stone-700">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 space-y-1.5">
          <div className="flex justify-between text-sm text-stone-500">
            <span>Ara Toplam</span>
            <span>{formatPrice(order.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Kargo</span>
            {order.pricing.shippingFee === 0
              ? <span className="text-green-600 font-semibold">Ücretsiz</span>
              : <span>{formatPrice(order.pricing.shippingFee)}</span>
            }
          </div>
          <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-200">
            <span>Toplam</span>
            <span className="text-primary-700 text-base">{formatPrice(order.pricing.total)}</span>
          </div>
        </div>

        {/* Delivery & Payment info */}
        <div className="px-6 py-4 space-y-3 border-t border-stone-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-0.5">Teslimat Adresi</p>
              <p className="text-sm font-semibold text-stone-700">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                {order.shippingAddress.fullAddress}, {order.shippingAddress.district} / {order.shippingAddress.city}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-0.5">Ödeme Yöntemi</p>
              <p className="text-sm font-semibold text-stone-700">
                {paymentLabels[order.payment.method] ?? order.payment.method}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <Link to="/siparislerim"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-500 text-white rounded-2xl font-bold text-sm
            hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200">
          <Package className="w-4 h-4" />
          Siparişlerimi Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white text-stone-700 rounded-2xl font-bold text-sm
            border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors">
          <Home className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
      </motion.div>

      {/* Estimated delivery note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-xs text-stone-400 text-center max-w-xs"
      >
        Siparişiniz genellikle <span className="font-semibold text-stone-500">2-4 iş günü</span> içinde teslim edilir. Kargo takip bilgisi e-posta ile gönderilecektir.
      </motion.p>
    </div>
  );
}
