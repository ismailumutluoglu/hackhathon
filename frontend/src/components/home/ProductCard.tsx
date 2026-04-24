import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, MapPin, CheckCircle } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, toggleDrawer } = useCartStore();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toggleDrawer();
  }

  const discountPercent = product.campaignOriginalPrice
    ? Math.round((1 - (product.discountedPrice ?? product.price) / product.campaignOriginalPrice) * 100)
    : product.discountedPrice
    ? Math.round((1 - product.discountedPrice / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group"
    >
      <Link to={`/urunler/${product.slug}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            <img
              src={product.images[0] || 'https://placehold.co/400x400/e8f5e9/3d8b37?text=🌿'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercent}%
              </div>
            )}
            {product.producer.isVerified && (
              <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full" title="Onaylı Üretici">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="font-semibold text-stone-500">Stok Tükendi</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-stone-800 leading-tight line-clamp-2">{product.name}</h3>
            </div>

            {/* Producer */}
            <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
              <MapPin className="w-3 h-3" />
              <span>{product.producer.name} · {product.producer.location.city}</span>
            </div>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-stone-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400">({product.reviewCount})</span>
              </div>
            )}

            {/* Price & Cart */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary-700">
                    {formatPrice(product.discountedPrice ?? product.price)}
                  </span>
                  {product.discountedPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-500">/ {product.unit}</span>
              </div>

              {product.stock > 0 && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
