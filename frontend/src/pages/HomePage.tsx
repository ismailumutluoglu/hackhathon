import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, Brain } from 'lucide-react';
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
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Diyetisyen',
    desc: 'Sağlık profilinize göre kişiselleştirilmiş ürün önerileri.',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'İlaçsız Tarım',
    desc: 'Sertifikalı organik ürünler, hiçbir kimyasal gübre yoktur.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Yerel Üreticiler',
    desc: 'Türkiye\'nin dört bir yanından güvenilir çiftçilerle çalışıyoruz.',
  },
];

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

      {/* Features */}
      <section className="py-16 bg-white">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-cream hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* AI Dietitian CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Sana Özel Ürünler
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Diyabetim var, gluten intoleransım var, kilo vermek istiyorum... Sağlık profilini gir,
              yapay zeka diyetisyenin sana özel organik ürünler önersin.
            </p>
            <Link
              to="/diyetisyen"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-full hover:bg-primary-50 transition-colors shadow-lg text-lg"
            >
              <Brain className="w-5 h-5" />
              AI Diyetisyene Sor
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
