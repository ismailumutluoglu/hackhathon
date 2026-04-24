import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { producerService } from '../services/producer.service';
import { productService } from '../services/product.service';
import { useAuthStore } from '../store/authStore';

const categories = ['sebze', 'meyve', 'tahıl', 'süt-ürünleri', 'bal-recel', 'zeytinyağı', 'kuruyemiş', 'bakliyat'];
const units = ['kg', 'adet', 'litre', 'gram', 'demet', 'kutu'];

export default function AdminProductCreatePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    producer: '',
    category: 'sebze',
    unit: 'kg',
    price: '',
    stock: '',
    city: '',
    district: '',
    farmName: '',
    imageUrl: '',
    tags: '',
    healthBenefits: '',
    isFeatured: false,
    isCampaign: false,
    discountedPrice: '',
    campaignOriginalPrice: '',
    campaignEndsAt: '',
  });

  const canManageProducts = user?.role === 'admin' || user?.role === 'producer' || user?.role === 'customer';

  const { data, isLoading } = useQuery({
    queryKey: ['admin-producers'],
    queryFn: () => producerService.getProducers({ limit: 100 }),
    enabled: isAuthenticated && !!canManageProducts,
  });

  const producers = useMemo(() => data?.producers || [], [data]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.producer) return setError('Lütfen bir üretici seçin.');

    setIsSaving(true);
    try {
      await productService.createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        producer: form.producer,
        category: form.category,
        price: Number(form.price),
        unit: form.unit,
        stock: Number(form.stock),
        origin: {
          city: form.city.trim(),
          district: form.district.trim() || undefined,
          farmName: form.farmName.trim() || undefined,
        },
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        healthBenefits: form.healthBenefits.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured: form.isFeatured,
        isCampaign: form.isCampaign,
        discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
        campaignOriginalPrice: form.campaignOriginalPrice ? Number(form.campaignOriginalPrice) : undefined,
        campaignEndsAt: form.campaignEndsAt || undefined,
      });

      setSuccess('Ürün başarıyla eklendi.');
      setForm((prev) => ({
        ...prev,
        name: '',
        description: '',
        imageUrl: '',
        tags: '',
        healthBenefits: '',
        price: '',
        stock: '',
        discountedPrice: '',
        campaignOriginalPrice: '',
        campaignEndsAt: '',
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürün eklenemedi. Alanları kontrol edin.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Giriş gerekli</h1>
        <p className="text-stone-500 mb-6">Ürün eklemek için önce admin hesabıyla giriş yapmalısınız.</p>
        <Link to="/giris" className="inline-flex bg-primary-500 text-white px-6 py-3 rounded-full font-semibold">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (!canManageProducts) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Yetkiniz yok</h1>
        <p className="text-stone-500">Bu sayfaya erişim için giriş yapmanız gerekiyor.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-primary-600">Admin panel</p>
        <h1 className="font-display text-3xl font-bold text-stone-800">Yeni Ürün Ekle</h1>
      </div>

      {error && <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-5 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Ürün Adı</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Üretici</label>
            <select required value={form.producer} onChange={(e) => update('producer', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" disabled={isLoading}>
              <option value="">Üretici seçin</option>
              {producers.map((p) => (
                <option key={p._id} value={p._id}>{p.name} - {p.location.city}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Açıklama</label>
          <textarea required value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Kategori</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Birim</label>
            <select value={form.unit} onChange={(e) => update('unit', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5">
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Fiyat</label>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Stok</label>
            <input required type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Şehir</label>
            <input required value={form.city} onChange={(e) => update('city', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">İlçe</label>
            <input value={form.district} onChange={(e) => update('district', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Çiftlik Adı</label>
            <input value={form.farmName} onChange={(e) => update('farmName', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Ürün Görsel URL</label>
            <input value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} placeholder="https://..." className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Etiketler (virgülle)</label>
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="organik,taze" className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Sağlık Faydaları (virgülle)</label>
          <input value={form.healthBenefits} onChange={(e) => update('healthBenefits', e.target.value)} placeholder="lif kaynağı,vitamin içerir" className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
            Öne çıkan ürün
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.isCampaign} onChange={(e) => update('isCampaign', e.target.checked)} />
            Kampanya ürünü
          </label>
        </div>

        {form.isCampaign && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">İndirimli Fiyat</label>
              <input type="number" min="0" step="0.01" value={form.discountedPrice} onChange={(e) => update('discountedPrice', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Eski Fiyat</label>
              <input type="number" min="0" step="0.01" value={form.campaignOriginalPrice} onChange={(e) => update('campaignOriginalPrice', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Bitiş Tarihi</label>
              <input type="datetime-local" value={form.campaignEndsAt} onChange={(e) => update('campaignEndsAt', e.target.value)} className="w-full border border-stone-300 rounded-xl px-3 py-2.5" />
            </div>
          </div>
        )}

        <div className="pt-3">
          <button disabled={isSaving} type="submit" className="bg-primary-600 text-white px-7 py-3 rounded-full font-semibold hover:bg-primary-700 disabled:opacity-60">
            {isSaving ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
