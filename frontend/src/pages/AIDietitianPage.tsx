import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Loader2, AlertTriangle, Sparkles, HeartPulse,
  Lock, ChevronRight, Leaf, BarChart2, X, ShoppingCart,
  CheckCircle2, Info, Zap, Shield,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { aiService } from '../services/ai.service';
import { formatPrice } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

const SUGGESTIONS = [
  { icon: '⚡', text: 'Enerji artırmak istiyorum' },
  { icon: '🛡️', text: 'Bağışıklığımı güçlendirmek istiyorum' },
  { icon: '🌿', text: 'Sindirim sorunum var' },
  { icon: '⚖️', text: 'Kilo vermek istiyorum' },
  { icon: '😴', text: 'Daha iyi uyku için öneriler' },
  { icon: '🩺', text: 'Diyabete uygun ürünler' },
];

const LOADING_STEPS = [
  'Sağlık profiliniz analiz ediliyor...',
  'Binlerce ürün arasında en uygunları seçiliyor...',
  'Kişisel öneriler hazırlanıyor...',
  'Son rötuşlar yapılıyor...',
];

const RANK_STYLES = [
  { bg: 'from-yellow-400 to-amber-500',  ring: 'ring-amber-200',  label: '#1' },
  { bg: 'from-slate-400 to-slate-500',   ring: 'ring-slate-200',  label: '#2' },
  { bg: 'from-orange-400 to-orange-500', ring: 'ring-orange-200', label: '#3' },
];

export default function AIDietitianPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { addItem, toggleDrawer }  = useCartStore();
  const [query, setQuery]           = useState('');
  const [loadStep, setLoadStep]     = useState(0);

  const { mutate, data: result, isPending, isError, error, reset } = useMutation({
    mutationFn: (q: string) => aiService.getRecommendations(q),
  });

  useEffect(() => {
    if (!isPending) { setLoadStep(0); return; }
    const iv = setInterval(() => setLoadStep(s => (s + 1) % LOADING_STEPS.length), 2200);
    return () => clearInterval(iv);
  }, [isPending]);

  /* ── Not authenticated ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center">
          <div className="relative w-24 h-24 mx-auto mb-7">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 blur-xl" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-200">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">AI Diyetisyen</h1>
          <p className="text-stone-500 mb-8 leading-relaxed text-sm">
            Sağlığınıza özel organik ürün tavsiyeleri alabilmek için giriş yapmanız gerekiyor.
          </p>
          <Link to="/giris"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] transition-all text-sm">
            Giriş Yap <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const hp = user?.healthProfile;
  const hasProfile = hp && (hp.goals?.length || hp.conditions?.length || hp.allergies?.length || hp.age);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-b-[3rem]"
        style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #065f46 60%, #0f766e 100%)' }}>
        {/* texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
        {/* blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-64 h-64 rounded-full bg-emerald-300/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-16 text-center">
          {/* animated bot icon */}
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative inline-flex items-center justify-center mb-7">
            <span className="absolute w-24 h-24 rounded-full bg-white/[0.07] animate-ping" style={{ animationDuration: '2.5s' }} />
            <span className="absolute w-20 h-20 rounded-full bg-white/[0.1]" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-teal-300 border border-teal-400/30 px-3 py-1 rounded-full mb-4">
            <Zap className="w-3 h-3" /> Yapay Zeka Destekli
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-md leading-tight">
            Kişisel Diyetisyeniniz
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-emerald-200/80 text-base max-w-xl mx-auto leading-relaxed mb-6">
            {hasProfile
              ? `Sağlık profiliniz hazır. Size özel ${hp?.goals?.[0] ? `"${hp.goals[0]}"` : 'beslenme'} hedefleri doğrultusunda analiz yapalım.`
              : 'Nasıl hissettiğinizi anlatın — binlerce organik ürün arasından en uygunlarını seçelim.'}
          </motion.p>

          {/* profile chips */}
          {hasProfile && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              className="flex flex-wrap justify-center gap-2">
              {hp?.goals?.slice(0, 3).map(g => (
                <span key={g} className="inline-flex items-center gap-1 text-xs bg-white/10 text-emerald-100 px-3 py-1.5 rounded-full border border-white/15">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />{g}
                </span>
              ))}
              {hp?.allergies?.slice(0, 2).map(a => (
                <span key={a} className="inline-flex items-center gap-1 text-xs bg-rose-400/20 text-rose-200 px-3 py-1.5 rounded-full border border-rose-400/20">
                  <Shield className="w-3 h-3" />⚠ {a}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-24 space-y-6">

        {/* ── Query Form ── */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <form onSubmit={(e) => { e.preventDefault(); mutate(query); }}
                className="bg-white rounded-3xl shadow-sm border border-stone-100/80 overflow-hidden">

                {/* form header */}
                <div className="px-6 pt-6 pb-4 border-b border-stone-50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="font-bold text-stone-700 text-sm">Durumunuzu anlatın</p>
                    <span className="text-xs text-stone-400 font-normal">(opsiyonel)</span>
                  </div>
                  <p className="text-xs text-stone-400 pl-8">Belirtmezseniz sağlık profilinizle analiz yaparız.</p>
                </div>

                {/* textarea */}
                <div className="px-6 pt-5 pb-4">
                  <div className="relative">
                    <textarea rows={4} value={query} onChange={(e) => setQuery(e.target.value)} disabled={isPending}
                      placeholder="Örn: Son günlerde çok halsiz hissediyorum, karnım şişkin. Süt alerjim var..."
                      className="w-full px-4 py-4 rounded-2xl border-2 border-stone-100 bg-stone-50 focus:bg-white focus:border-emerald-300 focus:outline-none text-stone-800 text-sm resize-none transition-all placeholder:text-stone-300 leading-relaxed"
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery('')}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center hover:bg-stone-300 transition-colors">
                        <X className="w-3.5 h-3.5 text-stone-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* suggestions */}
                <div className="px-6 pb-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5">Hızlı seçim</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SUGGESTIONS.map(s => (
                      <button key={s.text} type="button" onClick={() => setQuery(q => q === s.text ? '' : s.text)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all ${
                          query === s.text
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100'
                            : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}>
                        <span className="text-base leading-none flex-shrink-0">{s.icon}</span>
                        <span className="leading-tight">{s.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* submit */}
                <div className="px-6 pb-6">
                  <button type="submit" disabled={isPending}
                    className="relative w-full overflow-hidden py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all
                      bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600
                      hover:shadow-emerald-300 hover:scale-[1.015]
                      disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed">
                    <span className="relative flex items-center justify-center gap-2.5">
                      <Sparkles className="w-4 h-4" />
                      Kişisel Analizimi Başlat
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ── Error ── */}
        {isError && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Analiz başarısız</p>
              <p className="text-sm text-red-500 mt-0.5">{error instanceof Error ? error.message : 'Lütfen tekrar deneyin.'}</p>
            </div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        <AnimatePresence>
          {isPending && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
              {/* animated top bar */}
              <div className="h-1 bg-stone-100 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"
                  animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '60%' }} />
              </div>

              <div className="p-12 flex flex-col items-center gap-5">
                {/* pulsing icon */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping opacity-40" style={{ animationDuration: '1.5s' }} />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center border border-emerald-100">
                    <Bot className="w-7 h-7 text-emerald-600" />
                    <HeartPulse className="w-4 h-4 text-teal-500 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 animate-pulse" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-bold text-stone-700 text-base mb-1">AI analiz yapıyor</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={loadStep}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-sm text-emerald-600 font-medium">
                      {LOADING_STEPS[loadStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex gap-2">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !isPending && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

              {/* AI raporu header */}
              <div className="rounded-3xl overflow-hidden border border-emerald-100"
                style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)' }}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">AI Raporu</p>
                      <p className="text-white font-bold text-sm">{user?.name} için hazırlandı</p>
                    </div>
                    <div className="ml-auto bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-emerald-300">{result.response.recommendations?.length ?? 0} öneri</span>
                    </div>
                  </div>
                  {/* summary */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Info className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Genel Değerlendirme</p>
                    </div>
                    <p className="text-emerald-100 text-sm leading-relaxed">{result.response.summary}</p>
                  </div>
                </div>
              </div>

              {/* dietary advice */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-blue-100 rounded-xl flex items-center justify-center">
                    <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="font-bold text-blue-800 text-sm">Beslenme Tavsiyesi</p>
                </div>
                <p className="text-blue-700 text-sm leading-relaxed">{result.response.dietaryAdvice}</p>
              </div>

              {/* avoid list */}
              {result.response.avoidList?.length > 0 && (
                <div className="bg-white border border-rose-100 rounded-3xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-rose-50 to-red-50 border-b border-rose-100">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <p className="font-bold text-rose-700 text-sm">Uzak Durmanız Gerekenler</p>
                    <span className="ml-auto text-xs font-bold text-rose-400 bg-rose-100 px-2 py-0.5 rounded-full">
                      {result.response.avoidList.length} ürün
                    </span>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {result.response.avoidList.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                        <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-stone-800 text-xs">{item.product.name}</p>
                          <p className="text-[11px] text-rose-500 leading-tight mt-0.5 max-w-[200px]">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* recommendations */}
              {result.response.recommendations?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h2 className="font-display text-2xl font-bold text-stone-800">Size Özel Sepet</h2>
                    <span className="text-sm text-stone-400 font-normal">— en yüksek fayda skoru</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.response.recommendations.map((rec, idx) => (
                      <RecommendationCard key={rec._id} product={rec.product} reason={rec.reason}
                        score={rec.benefitScore} rank={idx} onCart={() => { addItem(rec.product); toggleDrawer(); }} />
                    ))}
                  </div>
                </div>
              )}

              {/* new analysis */}
              <button onClick={() => { reset(); setQuery(''); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-stone-200 text-stone-400 rounded-2xl text-sm font-semibold hover:border-emerald-300 hover:text-emerald-600 transition-all">
                <Sparkles className="w-4 h-4" /> Yeni Analiz Başlat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Recommendation Card ── */
function RecommendationCard({ product, reason, score, rank, onCart }: {
  product: Product; reason: string; score: number; rank: number; onCart: () => void;
}) {
  const rankStyle = RANK_STYLES[rank] ?? null;
  const scoreColor = score >= 8 ? 'from-emerald-400 to-teal-500' : score >= 6 ? 'from-yellow-400 to-amber-500' : 'from-orange-400 to-red-400';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280 }}
      className="relative bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col group">

      {/* rank badge */}
      {rankStyle && (
        <div className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-gradient-to-br ${rankStyle.bg} ring-2 ${rankStyle.ring} flex items-center justify-center shadow-md`}>
          <span className="text-white text-[10px] font-black">{rankStyle.label}</span>
        </div>
      )}

      {/* image */}
      <Link to={`/urunler/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-stone-100 block">
        <img src={product.images?.[0] || 'https://placehold.co/400x300/d1fae5/065f46?text=🌿'}
          alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {/* score pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm">
          <BarChart2 className="w-3 h-3 text-emerald-600" />
          <span className="text-[10px] font-black text-stone-700">{score}/10</span>
        </div>
        {/* score bar overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <motion.div className={`h-full bg-gradient-to-r ${scoreColor}`}
            initial={{ width: 0 }} animate={{ width: `${score * 10}%` }} transition={{ duration: 1, delay: 0.3 }} />
        </div>
      </Link>

      {/* body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <Link to={`/urunler/${product.slug}`}>
            <h3 className="font-bold text-stone-800 text-sm leading-snug hover:text-primary-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-lg font-bold text-primary-700 mt-1">
            {formatPrice(product.discountedPrice ?? product.price)}
            <span className="text-xs font-normal text-stone-400 ml-1">/ {product.unit}</span>
          </p>
        </div>

        {/* reason box */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 flex-1">
          <div className="flex items-center gap-1 mb-1.5">
            <Leaf className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Neden önerildi?</span>
          </div>
          <p className="text-xs text-emerald-800 leading-snug line-clamp-3">{reason}</p>
        </div>

        <button onClick={onCart}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold rounded-xl hover:from-primary-600 hover:to-primary-700 active:scale-95 transition-all shadow-sm">
          <ShoppingCart className="w-3.5 h-3.5" /> Sepete Ekle
        </button>
      </div>
    </motion.div>
  );
}

