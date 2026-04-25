import { Navigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, ChevronRight, Clock, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/order.service';
import { formatPrice } from '../lib/utils';
import type { OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'Beklemede',     color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Onaylandı',     color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Hazırlanıyor',  color: 'bg-purple-100 text-purple-700' },
  shipped:   { label: 'Kargoda',       color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'İptal Edildi',  color: 'bg-red-100 text-red-700' },
  refunded:  { label: 'İade Edildi',   color: 'bg-stone-100 text-stone-600' },
};

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) return <Navigate to="/giris" replace />;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', isAdmin ? 'all' : user?._id],
    queryFn: () => orderService.getOrders(),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          {isAdmin ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <p className="text-sm uppercase tracking-wider text-primary-600 font-bold">Admin Paneli</p>
              </div>
              <h1 className="font-display text-3xl font-bold text-stone-800">Tüm Siparişler</h1>
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-wider text-primary-600">Hesabım</p>
              <h1 className="font-display text-3xl font-bold text-stone-800">Siparişlerim</h1>
            </>
          )}
        </div>
        {orders && orders.length > 0 && (
          <span className="bg-primary-100 text-primary-700 text-sm font-bold px-3 py-1.5 rounded-full">
            {orders.length} sipariş
          </span>
        )}
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
          <p className="text-stone-500 text-lg mb-2">
            {isAdmin ? 'Henüz hiç sipariş yok' : 'Henüz siparişiniz yok'}
          </p>
          {!isAdmin && (
            <>
              <p className="text-stone-400 text-sm mb-6">İlk organik alışverişinizi yapın!</p>
              <Link
                to="/urunler"
                className="bg-primary-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
              >
                Ürünleri Keşfet
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status];
            return (
              <div key={order._id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-primary-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-stone-800 font-mono text-sm">{order.orderNumber}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      {/* Admin: kullanıcı bilgisi */}
                      {isAdmin && order.user && (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          <User className="w-3 h-3" />
                          <span className="font-medium">{order.user.name}</span>
                          <span className="text-indigo-400">·</span>
                          <span>{order.user.email}</span>
                        </div>
                      )}
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
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <AdminStatusBadge order={order} isAdmin={isAdmin} />
                    )}
                    <Link
                      to={`/siparislerim/${order._id}`}
                      className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700"
                    >
                      Detay
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminStatusBadge({ order, isAdmin }: { order: { _id: string; status: OrderStatus }; isAdmin: boolean }) {
  const queryClient = useQueryClient();

  const nextStatuses: Partial<Record<OrderStatus, { next: OrderStatus; label: string; color: string }>> = {
    pending:   { next: 'confirmed', label: 'Onayla',  color: 'bg-blue-500 hover:bg-blue-600' },
    confirmed: { next: 'preparing', label: 'Hazırla', color: 'bg-purple-500 hover:bg-purple-600' },
    preparing: { next: 'shipped',   label: 'Kargola', color: 'bg-indigo-500 hover:bg-indigo-600' },
    shipped:   { next: 'delivered', label: 'Teslim',  color: 'bg-green-500 hover:bg-green-600' },
  };

  const action = nextStatuses[order.status];
  if (!action || !isAdmin) return null;

  async function handleUpdate() {
    try {
      await orderService.updateOrderStatus(order._id, action!.next);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch { /* ignore */ }
  }

  return (
    <button
      onClick={handleUpdate}
      className={`text-xs font-semibold text-white px-3 py-1.5 rounded-xl transition-colors ${action.color}`}
    >
      {action.label}
    </button>
  );
}
