import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import CampaignCountdown from '../components/home/CampaignCountdown';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { productService } from '../services/product.service';

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Şeffaf Kaynak',
    desc: 'Her ürünün çiftçisini, tarlasını ve hasat tarihini görün.',
    color: 'bg-green-100 text-green-600 group-hover:bg-green-200',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Diyetisyen',
    desc: 'Sağlık profilinize göre kişiselleştirilmiş ürün önerileri.',
    color: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'İlaçsız Tarım',
    desc: 'Sertifikalı organik ürünler, hiçbir kimyasal gübre yoktur.',
    color: 'bg-primary-100 text-primary-600 group-hover:bg-primary-200',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Yerel Üreticiler',
    desc: "Türkiye'nin dört bir yanından güvenilir çiftçilerle çalışıyoruz.",
    color: 'bg-earth-100 text-earth-600 group-hover:bg-earth-200',
  },
];

const stats = [
  { value: '200+', label: 'Sertifikalı Üretici' },
  { value: '1500+', label: 'Organik Ürün' },
  { value: '50K+', label: 'Mutlu Müşteri' },
  { value: '%100', label: 'İlaçsız Güvence' },
];

const categories = [
  { emoji: '🥦', label: 'Sebze', value: 'sebze' },
  { emoji: '🍎', label: 'Meyve', value: 'meyve' },
  { emoji: '🌾', label: 'Tahıl', value: 'tahıl' },
  { emoji: '🧀', label: 'Süt Ürünleri', value: 'süt-ürünleri' },
  { emoji: '🍯', label: 'Bal & Reçel', value: 'bal-recel' },
  { emoji: '🫒', label: 'Zeytinyağı', value: 'zeytinyağı' },
  { emoji: '🥜', label: 'Kuruyemiş', value: 'kuruyemiş' },
  { emoji: '🫘', label: 'Bakliyat', value: 'bakliyat' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

      {/* Stats */}
      <section className="py-16 bg-[#fef9ee] -mt-px">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl px-6 py-8 text-center shadow-sm border border-stone-100 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <p className="font-display text-4xl font-bold text-primary-600 mb-1">{stat.value}</p>
              <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Category quick links */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-2">Kategoriler</p>
            <h2 className="font-display text-3xl font-bold text-stone-800">Ne Arıyorsunuz?</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-4 sm:grid-cols-8 gap-3"
          >
            {categories.map((cat) => (
              <motion.div key={cat.value} variants={itemVariants}>
                <Link
                  to={`/urunler?category=${cat.value}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-primary-50 transition-all group hover:-translate-y-1"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {cat.emoji}
                  </span>
                  <span className="text-xs font-medium text-stone-600 text-center leading-tight">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#fef9ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-2">Neden TAZEKÖY?</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-800">
              Farkımız Dürüstlükte
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee Products */}
      <FeaturedProducts />

      {/* AI CTA */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-600 text-white">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl pointer-events-none"
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Brain className="w-8 h-8" />
            </motion.div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Sana Özel Ürünler
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Diyabetim var, gluten intoleransım var, kilo vermek istiyorum...
              Sağlık profilini gir, yapay zeka diyetisyenin sana özel organik ürünler önersin.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/diyetisyen"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-full hover:bg-primary-50 transition-colors shadow-lg text-lg"
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
