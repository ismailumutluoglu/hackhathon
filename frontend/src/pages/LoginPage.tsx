import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

type View = 'login' | 'forgot' | 'forgot-success';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [view, setView] = useState<View>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await authService.login(form);
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email veya şifre hatalı.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword(forgotEmail);
      setView('forgot-success');
    } catch {
      setView('forgot-success'); // güvenlik: hata vermiyoruz
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(150deg, #012416 0%, #022c22 30%, #064e3b 65%, #0d7761 100%)' }}>
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        {/* Blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-500/10 blur-[60px]" />
        <div className="absolute -bottom-16 left-0 w-72 h-72 rounded-full bg-emerald-400/10 blur-[50px]" />
        {/* Floating nature */}
        <div className="absolute top-16 right-16 text-5xl opacity-10 animate-float select-none">🌿</div>
        <div className="absolute bottom-32 right-8 text-4xl opacity-[0.08] animate-float-slow select-none">🍃</div>
        <div className="absolute top-1/2 left-8 text-3xl opacity-[0.07] animate-float select-none">🌱</div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-display text-xl font-bold tracking-wide">TAZEKÖY</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400 mb-4">
            Organik & Doğal
          </p>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
            Doğadan sofraya<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              taze lezzetler
            </span>
          </h2>
          <p className="text-emerald-200/60 text-base leading-relaxed max-w-xs">
            Çiftçilerden doğrudan eve, sertifikalı organik ürünlerle sağlıklı bir yaşam.
          </p>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              { emoji: '🌿', text: '2000+ organik ürün' },
              { emoji: '🚚', text: '₺500 üzeri ücretsiz kargo' },
              { emoji: '🤖', text: 'AI destekli beslenme danışmanı' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-sm text-emerald-200/70">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
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

          <AnimatePresence mode="wait">
            {/* ── LOGIN VIEW ── */}
            {view === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-8">
                  <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Hoş Geldiniz</h1>
                  <p className="text-stone-500 text-sm">Hesabınıza giriş yapın</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-6 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center flex-shrink-0">!</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Şifre</label>
                      <button type="button" onClick={() => { setView('forgot'); setForgotEmail(form.email); setError(''); }}
                        className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                        Şifremi Unuttum
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input type={showPassword ? 'text' : 'password'} required value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="Şifreniz"
                        className="w-full pl-10 pr-11 py-3.5 border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
                      <button type="button" onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white mt-2
                      bg-gradient-to-r from-primary-500 to-primary-600
                      shadow-lg shadow-primary-200
                      hover:shadow-xl hover:shadow-primary-300 hover:scale-[1.01]
                      disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed
                      transition-all flex items-center justify-center gap-2">
                    {isLoading ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Giriş yapılıyor...</>
                    ) : (
                      <>Giriş Yap <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-stone-500">
                    Hesabınız yok mu?{' '}
                    <Link to="/kayit" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                      Üye Ol
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── FORGOT PASSWORD VIEW ── */}
            {view === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setView('login'); setError(''); }}
                  className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-8 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Geri Dön
                </button>

                <div className="mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4">
                    <Mail className="w-7 h-7 text-primary-600" />
                  </div>
                  <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Şifremi Unuttum</h1>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Email adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
                  </p>
                </div>

                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email Adresiniz</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input type="email" required value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        className="w-full pl-10 pr-4 py-3.5 border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm" />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white
                      bg-gradient-to-r from-primary-500 to-primary-600
                      shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.01]
                      disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed
                      transition-all flex items-center justify-center gap-2">
                    {isLoading ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Gönderiliyor...</>
                    ) : (
                      <>Sıfırlama Bağlantısı Gönder <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── FORGOT SUCCESS VIEW ── */}
            {view === 'forgot-success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-stone-800 mb-3">Email Gönderildi!</h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  <span className="font-semibold text-stone-700">{forgotEmail}</span> adresine şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.
                </p>
                <button onClick={() => setView('login')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200">
                  <ArrowLeft className="w-4 h-4" /> Giriş Sayfasına Dön
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
