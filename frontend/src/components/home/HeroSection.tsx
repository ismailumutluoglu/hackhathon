import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, Star } from 'lucide-react';

const floatingItems = [
  { emoji: '🥕', top: '15%', left: '5%', delay: 0, size: 'text-3xl' },
  { emoji: '🍅', top: '70%', left: '3%', delay: 1.2, size: 'text-2xl' },
  { emoji: '🌿', top: '30%', right: '5%', delay: 0.6, size: 'text-3xl' },
  { emoji: '🫐', top: '75%', right: '3%', delay: 1.8, size: 'text-2xl' },
  { emoji: '🌾', top: '55%', left: '8%', delay: 2.4, size: 'text-2xl' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700 text-white min-h-[88vh] flex items-center">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-earth-400 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-primary-300 blur-3xl"
        />
      </div>

      {/* Floating emojis */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -14, 0], rotate: [0, item.delay % 2 === 0 ? 8 : -8, 0] }}
          transition={{ duration: 3 + item.delay, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
          className={`absolute hidden lg:block select-none pointer-events-none ${item.size} opacity-30`}
          style={{ top: item.top, left: (item as any).left, right: (item as any).right }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
            >
<<<<<<< HEAD
              <Leaf className="w-4 h-4" />
              Doğadan, Sağlıklı Yaşam.
=======
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Leaf className="w-4 h-4 text-earth-300" />
              </motion.span>
              İlaçsız Tarım · Organik · Sağlıklı
>>>>>>> 02f3b533b0169472aab058898e59abc544f00a84
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              Topraktan
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="block text-earth-300"
              >
                Sofranıza
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="text-primary-100 text-lg leading-relaxed mb-8 max-w-md"
            >
              Üreticisini, tarlasını ve hasat zamanını bildiğiniz organik ürünler.
              Şeffaf, dürüst ve doğal bir alışveriş deneyimi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/urunler"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-full font-semibold hover:bg-primary-50 transition-all hover:shadow-xl hover:-translate-y-0.5 shadow-lg"
              >
                Alışverişe Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/diyetisyen"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                AI Diyetisyen
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { icon: <Shield className="w-4 h-4" />, text: 'Sertifikalı Organik' },
                { icon: <Truck className="w-4 h-4" />, text: '500₺ Üzeri Kargo Bedava' },
<<<<<<< HEAD
                { icon: <Leaf className="w-4 h-4" />, text: 'İlaç Yok' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-sm text-primary-200">
=======
                { icon: <Star className="w-4 h-4 fill-earth-300 text-earth-300" />, text: '4.9 Müşteri Puanı' },
              ].map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-primary-200"
                >
>>>>>>> 02f3b533b0169472aab058898e59abc544f00a84
                  {badge.icon}
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow ring */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-3xl bg-white/10 blur-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"
                alt="Organik tarla"
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
              />

              {/* Floating card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
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

              {/* Floating card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 bg-white text-stone-800 rounded-2xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <div>
                    <p className="font-semibold text-xs">Doğrudan Üretici</p>
                    <p className="text-xs text-stone-500">Aracısız taze</p>
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
