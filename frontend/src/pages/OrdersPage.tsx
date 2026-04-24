import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/order.service';
import { formatPrice } from '../lib/utils';
import type { OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'Beklemede',    color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Onaylandı',    color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Hazırlanıyor', color: 'bg-purple-100 text-purple-700' },
  shipped:   { label: 'Kargoda',      color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700' },
  refunded:  { label: 'İade Edildi',  color: 'bg-stone-100 text-stone-600' },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/giris" replace />;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-primary-600">Hesabım</p>
        <h1 className="font-display text-3xl font-bold text-stone-800">Siparişlerim</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-stone-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-14 h-14 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg mb-2">Henüz siparişiniz yok</p>
          <p className="text-stone-400 text-sm mb-6">İlk organik alışverişinizi yapın!</p>
          <Link
            to="/urunler"
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
          >
            Ürünleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status];
            return (
              <div key={order._id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-primary-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-semibold text-stone-800 font-mono text-sm">{order.orderNumber}</p>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-stone-700 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.quantity} {item.unit}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex-shrink-0 flex items-center px-3 text-xs text-stone-400">
                      +{order.items.length - 3} daha
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="font-bold text-primary-700">{formatPrice(order.pricing.total)}</span>
                  <Link
                    to={`/siparislerim/${order._id}`}
                    className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700"
                  >
                    Detay
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
