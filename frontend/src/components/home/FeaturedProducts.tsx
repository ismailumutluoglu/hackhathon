import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: productService.getFeatured,
  });

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-2">Seçilmiş Ürünler</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-800">
            Bu Hafta Öne Çıkanlar
          </h2>
        </div>
        <Link
          to="/urunler"
          className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Tümünü Gör <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-stone-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-5 bg-stone-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {(products || []).map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="text-center mt-8 sm:hidden">
        <Link
          to="/urunler"
          className="inline-flex items-center gap-2 text-primary-600 font-medium"
        >
          Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
