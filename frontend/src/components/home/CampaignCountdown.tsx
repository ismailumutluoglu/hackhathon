import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCountdown } from '../../hooks/useCountdown';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface Props { campaignProduct?: Product }

export default function CampaignCountdown({ campaignProduct }: Props) {
  const endsAt = campaignProduct?.campaignEndsAt;
  const { days, hours, minutes, seconds, expired } = useCountdown(endsAt);
  const { addItem, toggleDrawer } = useCartStore();

  if (!campaignProduct || expired) return null;

  const original = campaignProduct.campaignOriginalPrice ?? campaignProduct.price;
  const current  = campaignProduct.discountedPrice ?? campaignProduct.price;
  const discount = original > current ? Math.round((1 - current / original) * 100) : null;

  const timeUnits = [
    { value: days,    label: 'Gün'    },
    { value: hours,   label: 'Saat'   },
    { value: minutes, label: 'Dakika' },
    { value: seconds, label: 'Saniye' },
  ];

  return (
    <section className="relative overflow-hidden my-6 mx-4 sm:mx-6 lg:mx-8 rounded-3xl"
      style={{ background: 'linear-gradient(135deg, #0a1f0d 0%, #14321a 40%, #1c3d20 65%, #3d2a0a 100%)' }}>

      {/* urgent top bar */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, #ef4444, #f59e0b, transparent)' }} />

      {/* grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-earth-600/15 blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-12 left-1/4 w-48 h-48 rounded-full bg-primary-500/10 blur-[50px] pointer-events-none" />

      <div className="relative px-6 sm:px-10 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* ── Left: Product info ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} className="flex items-center gap-5 flex-1">

            {/* product image */}
            {campaignProduct.images?.[0] && (
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-xl">
                  <img src={campaignProduct.images[0]} alt={campaignProduct.name}
                    className="w-full h-full object-cover" />
                </div>
                {discount && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                    -%{discount}
                  </span>
                )}
              </div>
            )}

            <div>
              {/* badge */}
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded-full mb-2">
                <Tag className="w-3 h-3" /> Flaş Kampanya
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight mb-1.5">
                {campaignProduct.name}
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white">{formatPrice(current)}</span>
                {discount && (
                  <span className="text-white/35 line-through text-base">{formatPrice(original)}</span>
                )}
                <span className="text-xs text-white/40">/ {campaignProduct.unit}</span>
              </div>
            </div>
          </motion.div>

          {/* ── Center: Countdown ── */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Kalan Süre</p>
            <div className="flex items-center gap-2">
              {timeUnits.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl flex items-center justify-center shadow-inner">
                      <motion.span key={unit.value}
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="text-xl sm:text-2xl font-bold tabular-nums text-white">
                        {String(unit.value).padStart(2, '0')}
                      </motion.span>
                    </div>
                    <span className="text-[10px] mt-1.5 text-white/35 font-medium">{unit.label}</span>
                  </div>
                  {i < 3 && <span className="text-white/20 font-bold text-xl mb-5">:</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: CTA ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} className="flex flex-col sm:flex-row lg:flex-col items-center gap-3">
            <button onClick={() => { addItem(campaignProduct); toggleDrawer(); }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all hover:scale-[1.03] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #b87333 0%, #d4994f 100%)', boxShadow: '0 8px 24px rgba(184,115,51,0.35)' }}>
              <ShoppingCart className="w-4 h-4" /> Sepete Ekle
            </button>
            <Link to="/kampanyalar"
              className="flex items-center gap-1.5 text-sm font-semibold text-white/50 hover:text-white transition-colors">
              Tüm Kampanyalar <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
