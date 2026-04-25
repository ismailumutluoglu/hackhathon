import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, Star, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const floatingItems = [
  { emoji: '🥕', top: '12%', left: '4%', delay: 0, size: 'text-4xl' },
  { emoji: '🍅', top: '70%', left: '2%', delay: 1.2, size: 'text-3xl' },
  { emoji: '🌿', top: '22%', right: '4%', delay: 0.6, size: 'text-4xl' },
  { emoji: '🫐', top: '74%', right: '2%', delay: 1.8, size: 'text-3xl' },
  { emoji: '🌾', top: '50%', left: '7%', delay: 2.4, size: 'text-2xl' },
  { emoji: '🍋', top: '42%', right: '7%', delay: 3, size: 'text-2xl' },
];

export default function HeroSection() {
  const { user } = useAuthStore();

  return (
    <section
      className="relative overflow-hidden text-white min-h-[92vh] flex items-center"
      style={{ background: 'linear-gradient(150deg, #012416 0%, #022c22 30%, #064e3b 65%, #0d7761 100%)' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-400 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-teal-500 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-300 blur-3xl pointer-events-none"
      />

      {/* Floating emojis */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -16, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
          transition={{ duration: 3 + item.delay * 0.4, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
          className={`absolute hidden lg:block select-none pointer-events-none ${item.size} opacity-[0.18]`}
          style={{ top: item.top, left: (item as any).left, right: (item as any).right }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Hoş geldin, {user.name.split(' ')[0]}! 👋
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Leaf className="w-4 h-4 text-emerald-300" />
                </motion.span>
                İlaçsız Tarım · Organik · Sağlıklı
              </motion.div>
            )}

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
                className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300"
              >
                Sofranıza
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="block text-3xl lg:text-4xl font-semibold text-white/50 mt-2"
              >
                Taze & Organik
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="text-emerald-100/70 text-lg leading-relaxed mb-10 max-w-md"
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all text-base"
              >
                Alışverişe Başla
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/diyetisyen"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/25 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all hover:-translate-y-0.5 text-base"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                AI Diyetisyen
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap gap-5 mt-10"
            >
              {[
                { icon: <Shield className="w-4 h-4" />, text: 'Sertifikalı Organik' },
                { icon: <Truck className="w-4 h-4" />, text: '500₺ Üzeri Kargo Bedava' },
                { icon: <Star className="w-4 h-4 fill-emerald-300 text-emerald-300" />, text: '4.9 Müşteri Puanı' },
              ].map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-emerald-200/70"
                >
                  {badge.icon}
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-3xl bg-emerald-400 blur-2xl"
              />
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"
                alt="Organik tarla"
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10"
              />

              {/* Floating card - bottom left */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-8 bg-white text-stone-800 rounded-2xl p-4 shadow-2xl border border-stone-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">%100 Organik</p>
                    <p className="text-xs text-stone-400">Sertifikalı ürünler</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card - top right */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-5 -right-7 bg-white text-stone-800 rounded-2xl p-3 shadow-2xl border border-stone-100"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <p className="font-bold text-xs">Doğrudan Üretici</p>
                    <p className="text-xs text-stone-400">Aracısız taze</p>
                  </div>
                </div>
              </motion.div>

              {/* Stat pill - right middle */}
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1/2 -right-10 -translate-y-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl px-4 py-3 shadow-xl"
              >
                <p className="font-display font-bold text-2xl leading-none">200+</p>
                <p className="text-xs text-emerald-100 mt-0.5">Üretici</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path
            d="M0 80L48 69.3C96 58.7 192 37.3 288 32C384 26.7 480 37.3 576 48C672 58.7 768 69.3 864 69.3C960 69.3 1056 58.7 1152 48C1248 37.3 1344 26.7 1392 21.3L1440 16V80H0Z"
            fill="#fef9ee"
          />
        </svg>
      </div>
    </section>
  );
}
