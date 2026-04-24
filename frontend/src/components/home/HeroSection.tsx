import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white min-h-[85vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-earth-400 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Leaf className="w-4 h-4" />
              Doğadan, Sağlıklı Yaşam.
            </motion.div>

            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Topraktan
              <span className="block text-earth-300">Sofranıza</span>
            </h1>

            <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-md">
              Üreticisini, tarlasını ve hasat zamanını bildiğiniz organik ürünler.
              Şeffaf, dürüst ve doğal bir alışveriş deneyimi.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/urunler"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-full font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                Alışverişe Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/diyetisyen"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/25 transition-colors"
              >
                AI Diyetisyen
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: <Shield className="w-4 h-4" />, text: 'Sertifikalı Organik' },
                { icon: <Truck className="w-4 h-4" />, text: '500₺ Üzeri Kargo Bedava' },
                { icon: <Leaf className="w-4 h-4" />, text: 'İlaç Yok' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-sm text-primary-200">
                  {badge.icon}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero image / illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"
                alt="Organik tarla"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white text-stone-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">%100 Organik</p>
                    <p className="text-xs text-stone-500">Sertifikalı ürünler</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
