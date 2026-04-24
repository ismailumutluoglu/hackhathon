import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Flame, ShoppingCart, Clock, Zap, Tag, ArrowRight, Loader2, PackageX,
} from 'lucide-react';
import { productService } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { useCountdown } from '../hooks/useCountdown';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

type SortKey = 'discount' | 'ending' | 'price';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'discount', label: 'En Yüksek İndirim' },
  { key: 'ending',  label: 'Biten Yakın'        },
  { key: 'price',   label: 'En Düşük Fiyat'     },
];

function discountPct(p: Product) {
  const orig = p.campaignOriginalPrice ?? p.price;
  const curr = p.discountedPrice       ?? p.price;
  return orig > curr ? Math.round((1 - curr / orig) * 100) : 0;
}

function sortProducts(list: Product[], key: SortKey): Product[] {
  return [...list].sort((a, b) => {
    if (key === 'discount') return discountPct(b) - discountPct(a);
    if (key === 'price')    return (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price);
    if (key === 'ending') {
      const ta = a.campaignEndsAt ? new Date(a.campaignEndsAt).getTime() : Infinity;
      const tb = b.campaignEndsAt ? new Date(b.campaignEndsAt).getTime() : Infinity;
      return ta - tb;
    }
    return 0;
  });
}

/* ── Page ── */
export default function CampaignsPage() {
  const [sort, setSort] = useState<SortKey>('discount');

  const { data: products, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => productService.getCampaigns(),
  });

  const sorted = products ? sortProducts(products, sort) : [];
  const totalSavings = products?.reduce((sum, p) => {
    const saved = (p.campaignOriginalPrice ?? p.price) - (p.discountedPrice ?? p.price);
    return sum + Math.max(0, saved);
  }, 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-b-[3rem]"
        style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 45%, #ea580c 80%, #f59e0b 100%)' }}>
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full bg-yellow-300/20 blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-5"
          >
            <Flame className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-md"
          >
            Hasat Kampanyaları
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-red-100 text-lg mb-8"
          >
            Sınırlı süre, doğrudan çiftçiden özel fiyatlar
          </motion.p>

          {/* stats */}
          {!isLoading && products && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-6 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3"
            >
              <Stat icon={<Tag className="w-4 h-4" />}  label="Aktif kampanya" value={String(products.length)} />
              <div className="w-px h-8 bg-white/30" />
              <Stat icon={<Zap className="w-4 h-4" />}  label="Toplam tasarruf"  value={formatPrice(totalSavings)} />
            </motion.div>
          )}
        </div>

      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">

        {/* sort bar */}
        {!isLoading && sorted.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex-shrink-0">Sırala:</span>
            {sortOptions.map(o => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                  sort === o.key
                    ? 'bg-red-500 text-white shadow-md shadow-red-200'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {/* loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
            <p className="text-stone-400 text-sm font-medium">Kampanyalar yükleniyor...</p>
          </div>
        )}

        {/* empty */}
        {!isLoading && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <PackageX className="w-10 h-10 text-stone-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">Şu an aktif kampanya yok</h2>
            <p className="text-stone-400 text-sm mb-6">Yeni kampanyalar için takipte kalın.</p>
            <Link to="/urunler"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-600 transition-colors">
              Tüm Ürünlere Bak <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* grid */}
        {!isLoading && sorted.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CampaignCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Campaign Card ── */
function CampaignCard({ product }: { product: Product }) {
  const { addItem, toggleDrawer } = useCartStore();
  const countdown = useCountdown(product.campaignEndsAt);
  const pct       = discountPct(product);
  const current   = product.discountedPrice ?? product.price;
  const original  = product.campaignOriginalPrice ?? product.price;
  const saved     = original - current;

  function handleCart(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    addItem(product); toggleDrawer();
  }

  return (
    <Link to={`/urunler/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:border-red-200 hover:-translate-y-1 transition-all duration-200">

      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/fef2f2/dc2626?text=🔥'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pct > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            -{pct}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="font-semibold text-stone-500 text-sm">Stok Tükendi</span>
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 p-3">
        <p className="text-stone-800 font-semibold text-sm leading-tight line-clamp-2 mb-2">{product.name}</p>

        {/* prices */}
        <div className="mb-1">
          <span className="font-bold text-red-600 text-base">{formatPrice(current)}</span>
          {pct > 0 && (
            <span className="ml-1.5 text-xs text-stone-400 line-through">{formatPrice(original)}</span>
          )}
        </div>
        {saved > 0 && (
          <p className="text-[11px] text-emerald-600 font-semibold mb-2">{formatPrice(saved)} tasarruf</p>
        )}

        {/* countdown */}
        {product.campaignEndsAt && !countdown.expired && (
          <div className="flex items-center gap-1 mb-3">
            <Clock className="w-3 h-3 text-red-400 flex-shrink-0" />
            <div className="flex gap-0.5 text-[10px] font-bold tabular-nums">
              {countdown.days > 0 && (
                <TimeUnit value={countdown.days}    label="g" />
              )}
              <TimeUnit value={countdown.hours}   label="sa" />
              <TimeUnit value={countdown.minutes} label="dk" />
              <TimeUnit value={countdown.seconds} label="sn" />
            </div>
          </div>
        )}

        {/* cart button */}
        <div className="mt-auto">
          {product.stock > 0 ? (
            <button
              onClick={handleCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 active:scale-95 transition-all shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Sepete Ekle
            </button>
          ) : (
            <div className="w-full py-2 rounded-xl bg-stone-100 text-stone-400 text-xs font-bold text-center">
              Tükendi
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── Helpers ── */
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-white">
      <span className="text-white/70">{icon}</span>
      <div>
        <p className="text-xs text-white/60 leading-none">{label}</p>
        <p className="font-bold text-sm leading-tight">{value}</p>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded">
      {String(value).padStart(2, '0')}{label}
    </span>
  );
}
