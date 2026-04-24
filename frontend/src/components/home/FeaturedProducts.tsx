import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['all-products-marquee'],
    queryFn: () => productService.getProducts({ limit: 24, sort: '-createdAt' }),
  });

  const items = data?.products ?? [];
  const filled = items.length === 0 ? [] : items.length < 5
    ? [...items, ...items, ...items, ...items]
    : [...items, ...items];

  return (
    <section className="py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-2">Tüm Ürünler</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-800">
            Taze Gelenler
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
        <div className="flex gap-6 px-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-56 bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-stone-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-5 bg-stone-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filled.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 text-center py-10 text-stone-400">
          Henüz ürün eklenmemiş.
        </div>
      ) : (
        <div className="marquee-track relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fef9ee] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fef9ee] to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee gap-6 w-max py-2 px-4">
            {filled.map((product, i) => (
              <div key={`${product._id}-${i}`} className="flex-shrink-0 w-56">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-8 sm:hidden max-w-7xl mx-auto px-4">
        <Link to="/urunler" className="inline-flex items-center gap-2 text-primary-600 font-medium">
          Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
