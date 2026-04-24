import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      return;
    }
    setIsLoading(true);
    try {
      const data = await authService.register(form);
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt olunamadı.');
    } finally {
      setIsLoading(false);
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-stone-800">Aramıza Katılın</h1>
            <p className="text-stone-500 text-sm mt-1">Organik alışverişe hoş geldiniz</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name' as const, label: 'Ad Soyad', type: 'text', placeholder: 'Adınız Soyadınız', required: true },
              { key: 'email' as const, label: 'Email', type: 'email', placeholder: 'ornek@email.com', required: true },
              { key: 'phone' as const, label: 'Telefon (opsiyonel)', type: 'tel', placeholder: '0555 000 00 00', required: false },
              { key: 'password' as const, label: 'Şifre (min. 8 karakter)', type: 'password', placeholder: 'Güçlü bir şifre', required: true },
            ].map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  required={required}
                  {...field(key)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Kaydediliyor...' : 'Üye Ol'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/giris" className="text-primary-600 font-semibold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
