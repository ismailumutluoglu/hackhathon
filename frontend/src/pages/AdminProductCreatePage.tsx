import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Tag, DollarSign, ImageIcon,
  Sparkles, CheckCircle2, AlertCircle, Star,
  ChevronDown, ArrowLeft,
} from 'lucide-react';
import { productService } from '../services/product.service';
import { useAuthStore } from '../store/authStore';
import type { Product } from '../types';

const CATEGORIES = [
  { value: 'sebze',        label: 'Sebze',         emoji: '🥦' },
  { value: 'meyve',        label: 'Meyve',         emoji: '🍎' },
  { value: 'tahıl',        label: 'Tahıl',         emoji: '🌾' },
  { value: 'süt-ürünleri', label: 'Süt Ürünleri',  emoji: '🥛' },
  { value: 'bal-recel',    label: 'Bal & Reçel',   emoji: '🍯' },
  { value: 'zeytinyağı',   label: 'Zeytinyağı',    emoji: '🫒' },
  { value: 'kuruyemiş',    label: 'Kuruyemiş',     emoji: '🥜' },
  { value: 'bakliyat',     label: 'Bakliyat',      emoji: '🫘' },
];

const UNITS = ['kg', 'adet', 'litre', 'gram', 'demet', 'kutu'];

export default function AdminProductCreatePage() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const editProduct: Product | undefined = location.state?.product;
  const isEdit = !!editProduct;

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'sebze',
    unit: 'kg',
    price: '',
    stock: '',
    imageUrl: '',
    tags: '',
    healthBenefits: '',
    isFeatured: false,
    isCampaign: false,
    discountedPrice: '',
    campaignOriginalPrice: '',
    campaignEndsAt: '',
  });

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description,
        category: editProduct.category,
        unit: editProduct.unit,
        price: String(editProduct.price),
        stock: String(editProduct.stock),
        imageUrl: editProduct.images?.[0] ?? '',
        tags: editProduct.tags?.join(', ') ?? '',
        healthBenefits: editProduct.healthBenefits?.join(', ') ?? '',
        isFeatured: editProduct.isFeatured,
        isCampaign: editProduct.isCampaign,
        discountedPrice: editProduct.discountedPrice ? String(editProduct.discountedPrice) : '',
        campaignOriginalPrice: editProduct.campaignOriginalPrice ? String(editProduct.campaignOriginalPrice) : '',
        campaignEndsAt: editProduct.campaignEndsAt
          ? new Date(editProduct.campaignEndsAt).toISOString().slice(0, 16)
          : '',
      });
    }
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      stock: Number(form.stock),
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      healthBenefits: form.healthBenefits.split(',').map((t) => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isCampaign: form.isCampaign,
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      campaignOriginalPrice: form.campaignOriginalPrice ? Number(form.campaignOriginalPrice) : undefined,
      campaignEndsAt: form.campaignEndsAt || undefined,
    };
    try {
      if (isEdit && editProduct) {
        await productService.updateProduct(editProduct._id, payload);
        setSuccess('Ürün başarıyla güncellendi!');
        setTimeout(() => navigate('/admin/dashboard'), 1200);
      } else {
        await productService.createProduct({ ...payload, origin: { city: 'Belirtilmedi', district: '', farmName: '' } });
        setSuccess('Ürün başarıyla eklendi!');
        setForm((prev) => ({
          ...prev,
          name: '', description: '', imageUrl: '', tags: '',
          healthBenefits: '', price: '', stock: '',
          discountedPrice: '', campaignOriginalPrice: '', campaignEndsAt: '',
        }));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'İşlem başarısız. Alanları kontrol edin.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl">🔒</div>
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Giriş Gerekli</h1>
        <p className="text-stone-500 mb-6">Ürün eklemek için önce giriş yapmalısınız.</p>
        <Link to="/giris" className="inline-flex bg-primary-500 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (user?.role !== 'admin' && user?.role !== 'producer') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl">⛔</div>
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Yetkisiz Erişim</h1>
        <p className="text-stone-500 mb-6">Bu sayfa için admin veya üretici yetkisi gerekiyor.</p>
        <Link to="/" className="inline-flex bg-primary-500 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const selectedCategory = CATEGORIES.find((c) => c.value === form.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="w-9 h-9 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-center hover:bg-stone-100 transition-colors">
              <ArrowLeft className="w-4 h-4 text-stone-600" />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-600 font-bold">Yönetim Paneli</p>
              <h1 className="font-display text-2xl font-bold text-stone-800">{isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-xl border border-stone-100">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {user?.name}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* Alerts */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="font-semibold text-sm">{success}</p>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="font-semibold text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Category selector */}
          <SectionCard
            icon={<Tag className="w-5 h-5 text-white" />}
            title="Kategori Seç"
            subtitle="Ürünün ait olduğu kategoriyi seçin"
            gradient="from-violet-500 to-purple-600"
          >
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => update('category', cat.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                    form.category === cat.value
                      ? 'border-violet-400 bg-violet-50 shadow-md shadow-violet-100'
                      : 'border-stone-100 bg-stone-50 hover:border-stone-200 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl leading-none">{cat.emoji}</span>
                  <span className={`text-[10px] font-bold leading-tight text-center ${
                    form.category === cat.value ? 'text-violet-700' : 'text-stone-500'
                  }`}>{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
              <span className="text-lg">{selectedCategory?.emoji}</span>
              <span className="font-semibold text-stone-700">{selectedCategory?.label}</span>
              <span className="text-stone-400">kategorisi seçildi</span>
            </div>
          </SectionCard>

          {/* Product info */}
          <SectionCard
            icon={<Package className="w-5 h-5 text-white" />}
            title="Ürün Bilgileri"
            subtitle="Ürün adı ve açıklamasını girin"
            gradient="from-primary-500 to-primary-600"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Ürün Adı *</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)}
                  placeholder="Örn: Organik Siyah Üzüm"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Açıklama *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => update('description', e.target.value)}
                  placeholder="Ürünün özellikleri, üretim yeri, tazelik bilgisi..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm resize-none" />
              </div>
            </div>
          </SectionCard>

          {/* Price & Stock */}
          <SectionCard
            icon={<DollarSign className="w-5 h-5 text-white" />}
            title="Fiyat & Stok"
            subtitle="Birim, fiyat ve stok miktarını girin"
            gradient="from-emerald-500 to-teal-600"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Birim</label>
                <div className="relative">
                  <select value={form.unit} onChange={(e) => update('unit', e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm appearance-none">
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Fiyat (₺) *</label>
                <input required type="number" min="0" step="0.01" value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Stok Adedi *</label>
                <input required type="number" min="0" value={form.stock}
                  onChange={(e) => update('stock', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm" />
              </div>
            </div>
          </SectionCard>

          {/* Image & Tags */}
          <SectionCard
            icon={<ImageIcon className="w-5 h-5 text-white" />}
            title="Görsel & Etiketler"
            subtitle="Ürün görseli URL'si ve etiketleri"
            gradient="from-blue-500 to-indigo-600"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Görsel URL</label>
                <input value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Etiketler (virgülle)</label>
                <input value={form.tags} onChange={(e) => update('tags', e.target.value)}
                  placeholder="organik, taze, glutensiz"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Sağlık Faydaları (virgülle)</label>
                <input value={form.healthBenefits} onChange={(e) => update('healthBenefits', e.target.value)}
                  placeholder="lif kaynağı, C vitamini, antioksidan"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm" />
              </div>
            </div>

            {/* Image preview */}
            {form.imageUrl && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <img src={form.imageUrl} alt="preview"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/e8f5e9/3d8b37?text=?'; }}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Görsel Önizleme</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate max-w-xs">{form.imageUrl}</p>
                </div>
              </motion.div>
            )}
          </SectionCard>

          {/* Badges */}
          <SectionCard
            icon={<Star className="w-5 h-5 text-white" />}
            title="Ürün Rozetleri"
            subtitle="Öne çıkan ve kampanya ayarları"
            gradient="from-amber-500 to-orange-500"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <ToggleCard
                checked={form.isFeatured}
                onChange={(v) => update('isFeatured', v)}
                icon="⭐"
                title="Öne Çıkan Ürün"
                desc="Ana sayfada ve öne çıkanlar listesinde gösterilir"
                color="amber"
              />
              <ToggleCard
                checked={form.isCampaign}
                onChange={(v) => update('isCampaign', v)}
                icon="🏷️"
                title="Kampanya Ürünü"
                desc="İndirimli fiyat ve kampanya rozeti eklenir"
                color="rose"
              />
            </div>

            <AnimatePresence>
              {form.isCampaign && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">İndirimli Fiyat (₺)</label>
                    <input type="number" min="0" step="0.01" value={form.discountedPrice}
                      onChange={(e) => update('discountedPrice', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Eski Fiyat (₺)</label>
                    <input type="number" min="0" step="0.01" value={form.campaignOriginalPrice}
                      onChange={(e) => update('campaignOriginalPrice', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Bitiş Tarihi</label>
                    <input type="datetime-local" value={form.campaignEndsAt}
                      onChange={(e) => update('campaignEndsAt', e.target.value)}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all text-sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button disabled={isSaving} type="submit"
              className="flex-1 sm:flex-none sm:min-w-[200px] flex items-center justify-center gap-2 py-4 px-8
                bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-bold text-sm
                shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:scale-[1.01]
                disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed transition-all">
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isEdit ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet'}
                </>
              )}
            </button>
            <Link to="/admin/dashboard" className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-stone-200 rounded-2xl font-semibold text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionCard({
  icon, title, subtitle, gradient, children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className={`px-6 py-4 bg-gradient-to-r ${gradient} flex items-center gap-3`}>
        <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">{icon}</div>
        <div>
          <p className="font-bold text-white">{title}</p>
          <p className="text-xs text-white/70">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleCard({
  checked, onChange, icon, title, desc, color,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: string;
  title: string;
  desc: string;
  color: 'amber' | 'rose';
}) {
  const colors = {
    amber: 'border-amber-300 bg-amber-50',
    rose: 'border-rose-300 bg-rose-50',
  };
  return (
    <label className={`flex-1 flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
      checked ? colors[color] : 'border-stone-100 bg-stone-50 hover:border-stone-200'
    }`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-bold text-sm text-stone-700">{title}</p>
        <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 mt-0.5 ${
        checked
          ? color === 'amber' ? 'bg-amber-400' : 'bg-rose-400'
          : 'bg-stone-200'
      }`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </label>
  );
}
