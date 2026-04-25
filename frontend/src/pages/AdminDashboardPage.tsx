import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Star, Tag, Plus, Pencil,
  Trash2, AlertTriangle, ChevronLeft, ChevronRight,
  Search, RefreshCw, ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { productService } from '../services/product.service';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

const CATEGORIES: Record<string, { label: string; emoji: string; color: string }> = {
  'sebze':        { label: 'Sebze',        emoji: '🥦', color: 'bg-green-100 text-green-700'   },
  'meyve':        { label: 'Meyve',        emoji: '🍎', color: 'bg-red-100 text-red-700'       },
  'tahıl':        { label: 'Tahıl',        emoji: '🌾', color: 'bg-yellow-100 text-yellow-700' },
  'süt-ürünleri': { label: 'Süt',          emoji: '🥛', color: 'bg-blue-100 text-blue-700'     },
  'bal-recel':    { label: 'Bal & Reçel',  emoji: '🍯', color: 'bg-amber-100 text-amber-700'   },
  'zeytinyağı':   { label: 'Zeytinyağı',   emoji: '🫒', color: 'bg-lime-100 text-lime-700'     },
  'kuruyemiş':    { label: 'Kuruyemiş',    emoji: '🥜', color: 'bg-orange-100 text-orange-700' },
  'bakliyat':     { label: 'Bakliyat',     emoji: '🫘', color: 'bg-stone-100 text-stone-700'   },
};

export default function AdminDashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  if (!isAuthenticated) return <Navigate to="/giris" replace />;
  if (user?.role !== 'admin' && user?.role !== 'producer') return <Navigate to="/" replace />;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => productService.getProducts({ page, limit: 12, search: search || undefined, sort: '-createdAt' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteConfirm(null); },
  });

  const products = data?.products ?? [];
  const total    = data?.total ?? 0;
  const pages    = data?.pages ?? 1;

  /* stats */
  const featured  = products.filter(p => p.isFeatured).length;
  const campaign  = products.filter(p => p.isCampaign).length;
  const lowStock  = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: 'Toplam Ürün',    value: total,    icon: Package,     color: 'from-primary-500 to-primary-600'    },
    { label: 'Öne Çıkan',     value: featured, icon: Star,        color: 'from-amber-400 to-amber-500'         },
    { label: 'Kampanyalı',    value: campaign, icon: Tag,         color: 'from-rose-400 to-rose-500'           },
    { label: 'Düşük Stok',    value: lowStock, icon: AlertTriangle, color: 'from-orange-400 to-orange-500'    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-600 font-bold">Yönetim</p>
              <h1 className="font-display text-xl font-bold text-stone-800 leading-tight">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{user?.name}
            </span>
            <Link to="/admin/urun-ekle"
              className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Yeni Ürün
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`relative overflow-hidden bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-md`}>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
              <s.icon className="w-5 h-5 opacity-80 mb-3" />
              <p className="text-3xl font-bold leading-none">{isLoading ? '—' : s.value}</p>
              <p className="text-xs text-white/70 mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Ürün ara..."
              className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <button onClick={() => refetch()}
            className="flex items-center gap-1.5 text-sm text-stone-500 bg-white border border-stone-200 hover:border-stone-300 px-3 py-2.5 rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Yenile
          </button>
          <div className="text-sm text-stone-400">
            {total} ürün
          </div>
        </div>

        {/* Product table */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-stone-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Yükleniyor...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-stone-200 mx-auto mb-3" />
              <p className="text-stone-400 text-sm">Ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/50">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400">Ürün</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400">Kategori</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400">Fiyat</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400">Stok</th>
                    <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400">Rozetler</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => {
                    const cat = CATEGORIES[product.category];
                    return (
                      <tr key={product._id}
                        className={`border-b border-stone-50 hover:bg-stone-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-stone-50/20'}`}>
                        {/* Ürün */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                              {product.images?.[0]
                                ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-lg">{cat?.emoji}</div>
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-stone-800 truncate max-w-[180px]">{product.name}</p>
                              <p className="text-xs text-stone-400 truncate max-w-[180px]">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        {/* Kategori */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cat?.color ?? 'bg-stone-100 text-stone-600'}`}>
                            {cat?.emoji} {cat?.label ?? product.category}
                          </span>
                        </td>
                        {/* Fiyat */}
                        <td className="px-4 py-3 text-right">
                          <p className="font-bold text-stone-800">{formatPrice(product.discountedPrice ?? product.price)}</p>
                          {product.discountedPrice && (
                            <p className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</p>
                          )}
                        </td>
                        {/* Stok */}
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : product.stock < 30 ? 'text-amber-500' : 'text-stone-700'}`}>
                            {product.stock}
                          </span>
                          <span className="text-xs text-stone-400 ml-1">{product.unit}</span>
                        </td>
                        {/* Rozetler */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {product.isFeatured && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ Öne Çıkan</span>
                            )}
                            {product.isCampaign && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">🏷️ Kampanya</span>
                            )}
                          </div>
                        </td>
                        {/* İşlemler */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('/admin/urun-duzenle', { state: { product } })}
                              className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                              <Pencil className="w-3.5 h-3.5" /> Düzenle
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product)}
                              className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 px-4 py-2 rounded-xl disabled:opacity-40 hover:border-stone-300 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Önceki
            </button>
            <p className="text-sm text-stone-500">{page} / {pages}</p>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 px-4 py-2 rounded-xl disabled:opacity-40 hover:border-stone-300 transition-colors">
              Sonraki <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="font-display text-xl font-bold text-stone-800 text-center mb-2">Ürünü Sil</h2>
            <p className="text-stone-500 text-sm text-center mb-6">
              <span className="font-semibold text-stone-700">{deleteConfirm.name}</span> ürününü silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors">
                İptal
              </button>
              <button
                onClick={() => { setDeleting(deleteConfirm._id); deleteMutation.mutate(deleteConfirm._id); }}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-2xl text-sm font-bold text-white disabled:opacity-60 transition-colors">
                {deleteMutation.isPending ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
