import { Link, useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Package, MapPin, CreditCard,
  Clock, Hash, Truck,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/order.service';
import { formatPrice, formatDate } from '../lib/utils';
import OrderTimeline from '../components/order/OrderTimeline';
import type { OrderStatus } from '../types';

const paymentLabels: Record<string, string> = {
  credit_card:      'Kredi / Banka Kartı',
  bank_transfer:    'Havale / EFT',
  cash_on_delivery: 'Kapıda Ödeme',
};

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'Beklemede',     color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Onaylandı',     color: 'bg-blue-100 text-blue-700 border-blue-200' },
  preparing: { label: 'Hazırlanıyor',  color: 'bg-purple-100 text-purple-700 border-purple-200' },
  shipped:   { label: 'Kargoda',       color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'İptal Edildi',  color: 'bg-red-100 text-red-700 border-red-200' },
  refunded:  { label: 'İade Edildi',   color: 'bg-stone-100 text-stone-600 border-stone-200' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/giris" replace />;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-stone-100">
            <div className="h-4 bg-stone-100 rounded w-1/3 mb-3" />
            <div className="h-3 bg-stone-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-500 mb-4">Sipariş bulunamadı.</p>
        <Link to="/siparislerim" className="text-primary-600 font-semibold hover:underline">
          Siparişlere Dön
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/siparislerim"
          className="w-9 h-9 bg-white border border-stone-200 rounded-xl flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-stone-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-primary-600 font-bold">Sipariş Detayı</p>
          <h1 className="font-display text-xl font-bold text-stone-800 font-mono">{order.orderNumber}</h1>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Info bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: Clock,  label: 'Sipariş Tarihi', value: formatDate(order.createdAt) },
          { icon: Hash,   label: 'Sipariş No',     value: order.orderNumber },
          { icon: Truck,  label: 'Takip No',       value: order.trackingNumber || '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white border border-stone-100 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3.5 h-3.5 text-stone-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
            </div>
            <p className="text-sm font-semibold text-stone-700 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-50">
          <Package className="w-4 h-4 text-primary-500" />
          <h2 className="font-semibold text-stone-700 text-sm">Ürünler</h2>
          <span className="ml-auto text-xs text-stone-400">{order.items.length} ürün</span>
        </div>
        <div className="divide-y divide-stone-50">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-stone-100" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 text-xl">🌿</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                <p className="text-xs text-stone-500">{item.quantity} × {item.unit} — {formatPrice(item.price)}/{item.unit}</p>
              </div>
              <p className="text-sm font-bold text-stone-800 flex-shrink-0">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="px-5 py-4 bg-stone-50/50 border-t border-stone-100 space-y-2">
          <div className="flex justify-between text-sm text-stone-500">
            <span>Ara Toplam</span>
            <span>{formatPrice(order.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Kargo</span>
            <span>{order.pricing.shippingFee === 0 ? <span className="text-green-600 font-medium">Ücretsiz</span> : formatPrice(order.pricing.shippingFee)}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>İndirim</span>
              <span>-{formatPrice(order.pricing.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-stone-800 pt-2 border-t border-stone-200">
            <span>Toplam</span>
            <span className="text-primary-700">{formatPrice(order.pricing.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold text-stone-700 text-sm">Teslimat Adresi</h2>
          </div>
          <p className="font-semibold text-stone-800 text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-stone-500 mt-0.5">{order.shippingAddress.phone}</p>
          <p className="text-sm text-stone-500 mt-1">{order.shippingAddress.fullAddress}</p>
          <p className="text-sm text-stone-500">{order.shippingAddress.district}, {order.shippingAddress.city}</p>
        </div>

        <div className="bg-white border border-stone-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold text-stone-700 text-sm">Ödeme</h2>
          </div>
          <p className="text-sm font-semibold text-stone-800">{paymentLabels[order.payment.method] ?? order.payment.method}</p>
          <span className={`inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${
            order.payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.payment.status === 'paid' ? '✓ Ödendi' : 'Ödeme Bekleniyor'}
          </span>
        </div>
      </div>

      {/* Timeline */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-white border border-stone-100 rounded-2xl p-5">
          <h2 className="font-semibold text-stone-700 text-sm mb-4">Sipariş Durumu</h2>
          <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.status} />
        </div>
      )}
    </div>
  );
}
