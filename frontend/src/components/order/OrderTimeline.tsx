import { CheckCircle, Clock, Truck, Package, Home, XCircle } from 'lucide-react';
import type { OrderStatus, StatusUpdate } from '../../types';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending:   { label: 'Sipariş Alındı',       icon: <Clock className="w-4 h-4" />,       color: 'text-yellow-600 bg-yellow-100' },
  confirmed: { label: 'Ödeme Onaylandı',       icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-600 bg-blue-100' },
  preparing: { label: 'Çiftlikte Hazırlanıyor',icon: <Package className="w-4 h-4" />,     color: 'text-orange-600 bg-orange-100' },
  shipped:   { label: 'Kargoya Verildi',       icon: <Truck className="w-4 h-4" />,       color: 'text-purple-600 bg-purple-100' },
  delivered: { label: 'Teslim Edildi',         icon: <Home className="w-4 h-4" />,        color: 'text-primary-600 bg-primary-100' },
  cancelled: { label: 'İptal Edildi',          icon: <XCircle className="w-4 h-4" />,     color: 'text-red-600 bg-red-100' },
  refunded:  { label: 'İade Edildi',           icon: <XCircle className="w-4 h-4" />,     color: 'text-gray-600 bg-gray-100' },
};

interface Props {
  statusHistory: StatusUpdate[];
  currentStatus: OrderStatus;
}

export default function OrderTimeline({ statusHistory, currentStatus }: Props) {
  const config = statusConfig[currentStatus];

  return (
    <div className="space-y-3">
      {/* Current status badge */}
      <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium', config.color)}>
        {config.icon}
        {config.label}
      </div>

      {/* History */}
      <div className="relative pl-6 space-y-4">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-stone-200" />

        {[...statusHistory].reverse().map((update, index) => {
          const cfg = statusConfig[update.status];
          return (
            <div key={update._id || index} className="relative flex gap-3">
              <div className={cn('absolute -left-4 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', cfg.color)}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">{cfg.label}</p>
                <p className="text-xs text-stone-500">{update.message}</p>
                <p className="text-xs text-stone-400 mt-0.5">{formatDate(update.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
