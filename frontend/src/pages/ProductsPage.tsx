import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/product.service';
import ProductCard from '../components/home/ProductCard';
import { useDebounce } from '../hooks/useDebounce';

const categories = [
  { value: '',              label: 'Tümü',         emoji: '🌿' },
  { value: 'sebze',         label: 'Sebze',         emoji: '🥦' },
  { value: 'meyve',         label: 'Meyve',         emoji: '🍎' },
  { value: 'tahıl',         label: 'Tahıl',         emoji: '🌾' },
  { value: 'süt-ürünleri',  label: 'Süt Ürünleri',  emoji: '🥛' },
  { value: 'bal-recel',     label: 'Bal & Reçel',   emoji: '🍯' },
  { value: 'zeytinyağı',    label: 'Zeytinyağı',    emoji: '🫒' },
  { value: 'kuruyemiş',     label: 'Kuruyemiş',     emoji: '🌰' },
  { value: 'bakliyat',      label: 'Bakliyat',      emoji: '🫘' },
];

const sortOptions = [
  { value: '-createdAt', label: 'En Yeni'              },
  { value: 'price',      label: 'Fiyat: Düşük → Yüksek' },
  { value: '-price',     label: 'Fiyat: Yüksek → Düşük' },
  { value: '-rating',    label: 'En Beğenilen'          },
  { value: '-soldCount', label: 'En Çok Satan'          },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [page,     setPage]     = useState(1);
  const [sort,     setSort]     = useState('-createdAt');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) setCategory(categoryParam);
  }, [searchParams]);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, search: debouncedSearch, page, sort }],
    queryFn: () => productService.getProducts({
      category: category || undefined,
      search:   debouncedSearch || undefined,
      page,
      sort,
    }),
  });

  const activeCat  = categories.find(c => c.value === category);
  const activeSortLabel = sortOptions.find(s => s.value === sort)?.label ?? 'Sırala';

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-b-[3rem]"
        style={{ background: 'linear-gradient(135deg, #1a3a16 0%, #2d6a27 50%, #4a7c59 80%, #8b6914 100%)' }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-yellow-200/15 blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-primary-200 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Tazeköy Mağaza
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-md">
            Organik Ürünler
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-base mb-8">
            Sertifikalı çiftçilerden doğrudan sofraya
          </motion.p>

          {/* search bar */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Ürün, kategori veya çiftçi ara..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center hover:bg-stone-300 transition-colors">
                  <X className="w-3 h-3 text-stone-500" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">

        {/* category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {categories.map((cat) => (
            <button key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat.value
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-primary-300 hover:text-primary-700'
              }`}>
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* toolbar */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <p className="text-sm text-stone-500">
            {isLoading ? (
              <span className="inline-block w-24 h-4 bg-stone-200 rounded animate-pulse" />
            ) : (
              <>
                {data?.total ?? 0} ürün
                {activeCat?.value ? <span className="text-primary-600 font-medium"> · {activeCat.emoji} {activeCat.label}</span> : ''}
                {search && <span className="text-primary-600 font-medium"> · "{search}"</span>}
              </>
            )}
          </p>

          {/* sort dropdown */}
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-stone-300 transition-colors cursor-pointer">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-stone-100 rounded-lg animate-pulse w-4/5" />
                  <div className="h-3 bg-stone-100 rounded-lg animate-pulse w-1/2" />
                  <div className="h-5 bg-stone-100 rounded-lg animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-9 h-9 text-stone-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">Ürün bulunamadı</h2>
            <p className="text-stone-400 text-sm mb-5">Farklı bir arama veya kategori deneyin.</p>
            <button onClick={() => { setSearch(''); setCategory(''); }}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {data?.products.map((product) => (
              <motion.div key={product._id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* pagination */}
        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(data.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                  page === i + 1
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-primary-300'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
