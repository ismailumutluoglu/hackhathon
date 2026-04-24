import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productService } from '../services/product.service';
import ProductCard from '../components/home/ProductCard';
import { useDebounce } from '../hooks/useDebounce';

const categories = [
  { value: '', label: 'Tümü' },
  { value: 'sebze', label: 'Sebze' },
  { value: 'meyve', label: 'Meyve' },
  { value: 'tahıl', label: 'Tahıl' },
  { value: 'süt-ürünleri', label: 'Süt Ürünleri' },
  { value: 'bal-recel', label: 'Bal & Reçel' },
  { value: 'zeytinyağı', label: 'Zeytinyağı' },
  { value: 'kuruyemiş', label: 'Kuruyemiş' },
  { value: 'bakliyat', label: 'Bakliyat' },
];

export default function ProductsPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage]         = useState(1);
  const [sort, setSort]         = useState('-createdAt');

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, search: debouncedSearch, page, sort }],
    queryFn: () => productService.getProducts({ category: category || undefined, search: debouncedSearch || undefined, page, sort }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Organik Ürünler</h1>
        <p className="text-stone-500">Sertifikalı çiftçilerden taze, organik ürünler</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ürün ara..."
            className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-stone-400" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
        >
          <option value="-createdAt">En Yeni</option>
          <option value="price">Fiyat: Düşük-Yüksek</option>
          <option value="-price">Fiyat: Yüksek-Düşük</option>
          <option value="-rating">En Beğenilen</option>
          <option value="-soldCount">En Çok Satan</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setCategory(cat.value); setPage(1); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-stone-600 hover:bg-primary-50 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results info */}
      {data && (
        <p className="text-sm text-stone-500 mb-6">
          {data.total} ürün bulundu
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
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
      ) : data?.products.length === 0 ? (
        <div className="text-center py-20">
          <SlidersHorizontal className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg">Ürün bulunamadı</p>
          <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-primary-600 font-medium">
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {data?.products.map((product) => (
            <motion.div
              key={product._id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(data.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                page === i + 1
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-primary-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
