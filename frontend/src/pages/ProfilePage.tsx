import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  if (!isAuthenticated) return <Navigate to="/giris" replace />;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await api.patch<{ success: boolean; user: typeof user }>('/users/me', form);
      updateUser(res.data.user as any);
      setSuccess('Profil güncellendi.');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({ name: user?.name || '', phone: user?.phone || '' });
    setEditing(false);
    setError('');
  }

  const roleLabels: Record<string, string> = {
    customer: 'Müşteri',
    admin: 'Yönetici',
    producer: 'Üretici',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-primary-600">Hesabım</p>
        <h1 className="font-display text-3xl font-bold text-stone-800">Profilim</h1>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {/* Avatar area */}
        <div className="bg-primary-50 px-6 py-8 flex items-center gap-5">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-xl text-stone-800">{user?.name}</h2>
            <span className="inline-block mt-1 text-xs font-medium bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {roleLabels[user?.role || 'customer']}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Ad Soyad</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Telefon</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+90 5xx xxx xx xx"
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 border border-stone-300 text-stone-600 px-5 py-2 rounded-full font-medium hover:bg-stone-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  İptal
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3 text-stone-700">
                <User className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700">
                <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-stone-700">
                  <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              {(user?.addresses?.length ?? 0) > 0 && (
                <div className="flex items-start gap-3 text-stone-700">
                  <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>{user?.addresses?.[0]?.city}, {user?.addresses?.[0]?.district}</span>
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 border border-stone-300 text-stone-600 px-5 py-2 rounded-full font-medium hover:bg-stone-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Düzenle
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
