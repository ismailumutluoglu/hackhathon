import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, ChevronRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Çok Zayıf', color: 'bg-red-400' };
  if (score === 2) return { score, label: 'Zayıf', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Orta', color: 'bg-yellow-400' };
  if (score === 4) return { score, label: 'İyi', color: 'bg-emerald-400' };
  return { score, label: 'Güçlü', color: 'bg-green-500' };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });

  const strength = getPasswordStrength(form.password);
  const passwordsMatch = form.confirm && form.password === form.confirm;
  const passwordsMismatch = form.confirm && form.password !== form.confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Şifre en az 8 karakter olmalıdır.'); return; }
    if (form.password !== form.confirm) { setError('Şifreler eşleşmiyor.'); return; }
    setIsLoading(true);
    try {
      const data = await authService.register({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt olunamadı.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(150deg, #012416 0%, #022c22 30%, #064e3b 65%, #0d7761 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-500/10 blur-[60px]" />
        <div className="absolute -bottom-16 left-0 w-72 h-72 rounded-full bg-emerald-400/10 blur-[50px]" />
        <div className="absolute top-20 right-14 text-5xl opacity-[0.09] animate-float select-none">🌾</div>
        <div className="absolute bottom-28 right-6 text-4xl opacity-[0.07] animate-float-slow select-none">🍎</div>
        <div className="absolute top-1/2 left-6 text-3xl opacity-[0.06] animate-float select-none">🥦</div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-display text-xl font-bold tracking-wide">TAZEKÖY</span>
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400 mb-4">Yeni Üyelik</p>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
            Sağlıklı yaşama<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              ilk adım buradan
            </span>
          </h2>
          <p className="text-emerald-200/60 text-base leading-relaxed max-w-xs">
            Üye olun, AI diyetisyen ve yüzlerce organik ürünle sağlıklı hayatınıza başlayın.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { emoji: '🎁', text: 'İlk siparişinizde %10 indirim' },
              { emoji: '🤖', text: 'Ücretsiz AI beslenme analizi' },
              { emoji: '📦', text: 'Sipariş takibi ve geçmiş' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-sm text-emerald-200/70">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-emerald-200/30">© 2025 Tazeköy. Tüm hakları saklıdır.</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf9f7]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-stone-800 tracking-wide">TAZEKÖY</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Aramıza Katılın</h1>
              <p className="text-stone-500 text-sm">Birkaç saniyede ücretsiz hesap oluşturun</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center flex-shrink-0">!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Ad Soyad</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Adınız Soyadınız"
                    className="w-full pl-10 pr-4 py-3.5 border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="ornek@email.com"
                    className="w-full pl-10 pr-4 py-3.5 border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Telefon <span className="text-stone-300 normal-case font-normal">(opsiyonel)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="tel" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="05xx xxx xx xx"
                    className="w-full pl-10 pr-4 py-3.5 border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="En az 8 karakter"
                    className="w-full pl-10 pr-11 py-3.5 border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-stone-200'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${strength.score <= 2 ? 'text-red-500' : strength.score === 3 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Şifre Tekrar</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type={showConfirm ? 'text' : 'password'} required value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Şifrenizi tekrar girin"
                    className={`w-full pl-10 pr-11 py-3.5 border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm ${
                      passwordsMismatch ? 'border-red-300 focus:ring-red-400' :
                      passwordsMatch ? 'border-emerald-300 focus:ring-emerald-400' :
                      'border-stone-200 focus:ring-primary-400'
                    }`} />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {passwordsMatch && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="text-stone-400 hover:text-stone-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {passwordsMismatch && <p className="text-xs text-red-500 mt-1 font-medium">Şifreler eşleşmiyor</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white mt-2
                  bg-gradient-to-r from-primary-500 to-primary-600
                  shadow-lg shadow-primary-200
                  hover:shadow-xl hover:shadow-primary-300 hover:scale-[1.01]
                  disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed
                  transition-all flex items-center justify-center gap-2">
                {isLoading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Kaydediliyor...</>
                ) : (
                  <>Üye Ol <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-stone-500">
                Zaten hesabınız var mı?{' '}
                <Link to="/giris" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
