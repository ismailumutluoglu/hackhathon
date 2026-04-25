import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, Brain, ArrowRight, Sparkles, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import CampaignCountdown from '../components/home/CampaignCountdown';
import FeaturedProducts from '../components/home/FeaturedProducts';
import SpinWheelSection from '../components/home/SpinWheelSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { productService } from '../services/product.service';

const features = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'Şeffaf Kaynak',
    desc: 'Her ürünün çiftçisini, tarlasını ve hasat tarihini görün.',
    iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
  {
    icon: <Brain className="w-7 h-7" />,
    title: 'AI Diyetisyen',
    desc: 'Sağlık profilinize göre kişiselleştirilmiş ürün önerileri.',
    iconClass: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
  {
    icon: <Leaf className="w-7 h-7" />,
    title: 'İlaçsız Tarım',
    desc: 'Sertifikalı organik ürünler, hiçbir kimyasal gübre yoktur.',
    iconClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Yerel Üreticiler',
    desc: "Türkiye'nin dört bir yanından güvenilir çiftçilerle çalışıyoruz.",
    iconClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
];

const stats = [
  { value: '200+', label: 'Sertifikalı Üretici', emoji: '👨‍🌾' },
  { value: '1500+', label: 'Organik Ürün', emoji: '🌿' },
  { value: '50K+', label: 'Mutlu Müşteri', emoji: '😊' },
  { value: '%100', label: 'İlaçsız Güvence', emoji: '✅' },
];

const categories = [
  { emoji: '🥦', label: 'Sebze', value: 'sebze', cardClass: 'bg-gradient-to-b from-green-100 to-emerald-50 border-green-200 hover:border-green-400', labelClass: 'text-green-700' },
  { emoji: '🍎', label: 'Meyve', value: 'meyve', cardClass: 'bg-gradient-to-b from-red-100 to-rose-50 border-red-200 hover:border-red-400', labelClass: 'text-red-700' },
  { emoji: '🌾', label: 'Tahıl', value: 'tahıl', cardClass: 'bg-gradient-to-b from-amber-100 to-yellow-50 border-amber-200 hover:border-amber-400', labelClass: 'text-amber-700' },
  { emoji: '🧀', label: 'Süt Ürünleri', value: 'süt-ürünleri', cardClass: 'bg-gradient-to-b from-yellow-100 to-amber-50 border-yellow-200 hover:border-yellow-400', labelClass: 'text-yellow-700' },
  { emoji: '🍯', label: 'Bal & Reçel', value: 'bal-recel', cardClass: 'bg-gradient-to-b from-orange-100 to-amber-50 border-orange-200 hover:border-orange-400', labelClass: 'text-orange-700' },
  { emoji: '🫒', label: 'Zeytinyağı', value: 'zeytinyağı', cardClass: 'bg-gradient-to-b from-lime-100 to-green-50 border-lime-200 hover:border-lime-400', labelClass: 'text-lime-700' },
  { emoji: '🥜', label: 'Kuruyemiş', value: 'kuruyemiş', cardClass: 'bg-gradient-to-b from-stone-100 to-amber-50 border-stone-200 hover:border-stone-400', labelClass: 'text-stone-700' },
  { emoji: '🫘', label: 'Bakliyat', value: 'bakliyat', cardClass: 'bg-gradient-to-b from-orange-100 to-stone-50 border-orange-200 hover:border-orange-300', labelClass: 'text-orange-800' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const { data: campaignProducts } = useQuery({
    queryKey: ['campaign-products'],
    queryFn: productService.getCampaigns,
  });

  const firstCampaign = campaignProducts?.[0];

  return (
    <div>
      <HeroSection />
      <CampaignCountdown campaignProduct={firstCampaign} />

      {/* ── Stats ── */}
      <section className="py-16 bg-[#fef9ee]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl px-5 py-8 text-center shadow-sm border border-stone-100 hover:border-primary-200 hover:shadow-lg transition-all cursor-default"
              >
                <div className="text-3xl mb-3">{stat.emoji}</div>
                <p className="font-display text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-emerald-500 mb-1">
                  {stat.value}
                </p>
                <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Kategoriler</p>
            <h2 className="font-display text-3xl font-bold text-stone-800">Ne Arıyorsunuz?</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-4 md:grid-cols-8 gap-3"
          >
            {categories.map((cat) => (
              <motion.div key={cat.value} variants={itemVariants}>
                <Link
                  to={`/urunler?category=${cat.value}`}
                  className={`flex flex-col items-center gap-2.5 p-3 lg:p-4 rounded-2xl border ${cat.cardClass} hover:-translate-y-1.5 transition-all group shadow-sm hover:shadow-md`}
                >
                  <span className="text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-200">
                    {cat.emoji}
                  </span>
                  <span className={`text-xs font-semibold ${cat.labelClass} text-center leading-tight`}>{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-[#fef9ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Neden TAZEKÖY?</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-800">
              Farkımız Dürüstlükte
            </h2>
            <p className="text-stone-500 text-base mt-3 max-w-xl mx-auto">
              Sadece ürün satmıyoruz — köyden sofranıza gelen güveni sunuyoruz.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-3xl bg-white p-6 shadow-sm border border-stone-100 hover:shadow-lg transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.iconClass} flex items-center justify-center mb-5 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-stone-800 mb-2 text-base">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Delivery strip ── */}
      <section className="py-5 bg-gradient-to-r from-primary-800 via-primary-700 to-emerald-700">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: <Truck className="w-5 h-5" />, text: '500₺ üzeri ücretsiz kargo' },
              { icon: <Clock className="w-5 h-5" />, text: 'Aynı gün kargo (15:00\'a kadar sipariş)' },
              { icon: <ShieldCheck className="w-5 h-5" />, text: '%100 organik garanti' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2.5 text-sm font-medium text-emerald-100">
                <span className="text-emerald-300">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products Marquee ── */}
      <FeaturedProducts />

      {/* ── Spin Wheel ── */}
      <SpinWheelSection />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── AI CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #012416 0%, #022c22 30%, #064e3b 65%, #0d7761 100%)' }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Blobs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-400 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl pointer-events-none"
        />

        {/* Floating emojis */}
        <div className="absolute top-8 left-12 text-4xl opacity-[0.12] select-none">🤖</div>
        <div className="absolute bottom-8 right-16 text-3xl opacity-[0.10] select-none">🥦</div>
        <div className="absolute top-16 right-24 text-3xl opacity-[0.10] select-none">🍎</div>
        <div className="absolute bottom-16 left-24 text-3xl opacity-[0.08] select-none">🌿</div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-900/50"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium text-emerald-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Yapay Zeka Destekli
            </div>

            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Sana Özel{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                Beslenme Planı
              </span>
            </h2>
            <p className="text-emerald-100/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Diyabetim var, gluten intoleransım var, kilo vermek istiyorum...
              Sağlık profilini gir, yapay zeka diyetisyenin sana özel organik ürünler önersin.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/diyetisyen"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold px-10 py-4 rounded-full hover:shadow-2xl hover:shadow-emerald-500/40 transition-all shadow-lg text-lg"
              >
                <Brain className="w-5 h-5" />
                AI Diyetisyene Sor
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
