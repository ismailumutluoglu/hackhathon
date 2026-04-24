import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCountdown } from '../../hooks/useCountdown';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface Props {
  campaignProduct?: Product;
}

export default function CampaignCountdown({ campaignProduct }: Props) {
  const endsAt = campaignProduct?.campaignEndsAt;
  const { days, hours, minutes, seconds, expired } = useCountdown(endsAt);
  const { addItem } = useCartStore();

  if (!campaignProduct || expired) return null;

  const timeUnits = [
    { value: days, label: 'Gün' },
    { value: hours, label: 'Saat' },
    { value: minutes, label: 'Dakika' },
    { value: seconds, label: 'Saniye' },
  ];

  return (
    <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-10 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-100 uppercase tracking-wider">Hasat Kampanyası</p>
              <h2 className="font-display text-2xl font-bold">{campaignProduct.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold">
                  {formatPrice(campaignProduct.discountedPrice ?? campaignProduct.price)}
                </span>
                {campaignProduct.campaignOriginalPrice && (
                  <span className="text-red-200 line-through text-lg">
                    {formatPrice(campaignProduct.campaignOriginalPrice)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Center: countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur rounded-xl w-14 h-14 flex items-center justify-center">
                    <motion.span
                      key={unit.value}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold tabular-nums"
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.span>
                  </div>
                  <span className="text-xs mt-1 text-red-100">{unit.label}</span>
                </div>
                {index < 3 && <span className="text-2xl font-bold text-red-200 mb-4">:</span>}
              </div>
            ))}
          </motion.div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => addItem(campaignProduct)}
              className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-red-50 transition-colors shadow-lg"
            >
              Sepete Ekle
            </button>
            <Link
              to="/urunler?isCampaign=true"
              className="flex items-center gap-1 text-white font-medium hover:underline"
            >
              Tüm Kampanyalar <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
