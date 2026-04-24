import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ShoppingCart, Star, MapPin, Calendar, CheckCircle, Leaf, ChevronLeft, User,
} from 'lucide-react';
import { productService } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { formatPrice, formatDate } from '../lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, toggleDrawer } = useCartStore();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProduct(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-stone-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-200 rounded w-1/2" />
            <div className="h-20 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-stone-500">Ürün bulunamadı.</div>;

  const price = product.discountedPrice ?? product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link to="/urunler" className="inline-flex items-center gap-1 text-stone-500 hover:text-primary-600 text-sm mb-6">
        <ChevronLeft className="w-4 h-4" /> Ürünlere Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-stone-100"
          >
            <img
              src={product.images[selectedImage] || 'https://placehold.co/600x600/e8f5e9/3d8b37?text=🌿'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Category & badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium bg-primary-100 text-primary-700 px-3 py-1 rounded-full capitalize">
              {product.category}
            </span>
            {product.producer.isVerified && (
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Onaylı Üretici
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">{product.name}</h1>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}`}
                />
              ))}
              <span className="text-sm font-medium text-stone-700">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-stone-400">({product.reviewCount} yorum)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary-700">{formatPrice(price)}</span>
            {product.discountedPrice && (
              <span className="text-lg text-stone-400 line-through">{formatPrice(product.price)}</span>
            )}
            <span className="text-stone-500">/ {product.unit}</span>
          </div>

          {/* Producer info */}
          <Link
            to={`/ureticiler/${product.producer.slug}`}
            className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl hover:bg-primary-50 transition-colors mb-6 group"
          >
            <img
              src={product.producer.avatar || 'https://placehold.co/48x48/e8f5e9/3d8b37?text=🧑‍🌾'}
              alt={product.producer.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-stone-800 group-hover:text-primary-700">{product.producer.name}</p>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <MapPin className="w-3.5 h-3.5" />
                {product.producer.location.city} · {product.producer.location.farmName}
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 rotate-180" />
          </Link>

          {/* Harvest & origin */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.harvestDate && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                <Calendar className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-stone-500">Hasat Tarihi</p>
                  <p className="text-sm font-medium text-stone-800">{formatDate(product.harvestDate)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 bg-earth-50 rounded-xl">
              <MapPin className="w-4 h-4 text-earth-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-stone-500">Menşei</p>
                <p className="text-sm font-medium text-stone-800">
                  {product.origin.district ? `${product.origin.district}, ` : ''}{product.origin.city}
                </p>
              </div>
            </div>
          </div>

          {/* Certificates */}
          {product.certificates.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.certificates.map((cert) => (
                <span key={cert} className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 rounded-full">
                  <Leaf className="w-3 h-3" /> {cert}
                </span>
              ))}
            </div>
          )}

          {/* Add to cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-stone-300 rounded-full overflow-hidden">
              <button
                onClick={() => setQty(Math.max(product.minOrderQuantity, qty - 1))}
                className="px-4 py-3 hover:bg-stone-100 font-semibold"
              >
                -
              </button>
              <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-4 py-3 hover:bg-stone-100 font-semibold"
              >
                +
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { addItem(product, qty); toggleDrawer(); }}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-3.5 rounded-full font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Stok Tükendi' : 'Sepete Ekle'}
            </motion.button>
          </div>

          {product.stock > 0 && product.stock < 10 && (
            <p className="text-sm text-orange-600 font-medium mb-4">⚡ Son {product.stock} {product.unit} kaldı!</p>
          )}

          {/* Description */}
          <div className="border-t border-stone-100 pt-6">
            <h3 className="font-semibold text-stone-800 mb-3">Ürün Hakkında</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>
            {product.story && (
              <p className="text-stone-500 text-sm leading-relaxed mt-3 italic">"{product.story}"</p>
            )}
          </div>

          {/* Health benefits */}
          {product.healthBenefits.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-stone-800 mb-3">Sağlık Faydaları</h3>
              <ul className="space-y-1.5">
                {product.healthBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition */}
          {product.nutritionFacts && (
            <div className="mt-6 p-4 bg-stone-50 rounded-2xl">
              <h3 className="font-semibold text-stone-800 mb-3">Besin Değerleri <span className="text-xs text-stone-400 font-normal">(100g)</span></h3>
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { label: 'Kalori', value: `${product.nutritionFacts.calories} kcal` },
                  { label: 'Protein', value: `${product.nutritionFacts.protein}g` },
                  { label: 'Karbonhidrat', value: `${product.nutritionFacts.carbs}g` },
                  { label: 'Yağ', value: `${product.nutritionFacts.fat}g` },
                  { label: 'Lif', value: `${product.nutritionFacts.fiber}g` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-bold text-stone-800">{item.value}</p>
                    <p className="text-xs text-stone-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-stone-800 mb-6">Müşteri Yorumları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl p-5 border border-stone-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-stone-800">{review.user.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-stone-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
