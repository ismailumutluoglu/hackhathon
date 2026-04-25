import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, AlertTriangle, Sparkles, HeartPulse,
  Lock, ChevronRight, Leaf, BarChart2, X, ShoppingCart,
  CheckCircle2, Info, Zap, Shield, RotateCcw, Brain,
  MessageSquare, Star,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { aiService } from '../services/ai.service';
import { formatPrice } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

const SUGGESTIONS = [
  { icon: '⚡', text: 'Enerji artırmak istiyorum',          bg: 'bg-amber-50',  border: 'border-amber-200',  text_: 'text-amber-800',  dot: 'bg-amber-400'  },
  { icon: '🛡️', text: 'Bağışıklığımı güçlendirmek istiyorum', bg: 'bg-blue-50',   border: 'border-blue-200',   text_: 'text-blue-800',   dot: 'bg-blue-400'   },
  { icon: '🌿', text: 'Sindirim sorunum var',               bg: 'bg-emerald-50', border: 'border-emerald-200', text_: 'text-emerald-800', dot: 'bg-emerald-400' },
  { icon: '⚖️', text: 'Kilo vermek istiyorum',              bg: 'bg-violet-50',  border: 'border-violet-200',  text_: 'text-violet-800',  dot: 'bg-violet-400'  },
  { icon: '😴', text: 'Daha iyi uyku için öneriler',        bg: 'bg-indigo-50',  border: 'border-indigo-200',  text_: 'text-indigo-800',  dot: 'bg-indigo-400'  },
  { icon: '🩺', text: 'Diyabete uygun ürünler',             bg: 'bg-rose-50',    border: 'border-rose-200',    text_: 'text-rose-800',    dot: 'bg-rose-400'    },
];

const HOW_IT_WORKS = [
  { icon: MessageSquare, step: '1', label: 'Anlat', desc: 'Şikayetinizi veya hedefinizi yazın', color: 'from-emerald-400 to-teal-500' },
  { icon: Brain,         step: '2', label: 'Analiz', desc: 'AI sağlık profilinizi inceler',     color: 'from-teal-400 to-cyan-500'    },
  { icon: Star,          step: '3', label: 'Öner',   desc: 'Size özel ürünler listelenir',     color: 'from-cyan-400 to-blue-500'    },
];

const LOADING_STEPS = [
  { icon: '🔍', text: 'Sağlık profiliniz analiz ediliyor...' },
  { icon: '🌿', text: 'Binlerce ürün arasında en uygunları seçiliyor...' },
  { icon: '🤖', text: 'Kişisel öneriler hazırlanıyor...' },
  { icon: '✨', text: 'Son rötuşlar yapılıyor...' },
];

const RANK_STYLES = [
  { bg: 'from-yellow-400 to-amber-500',  ring: 'ring-amber-200',  label: '🥇', glow: 'shadow-amber-200'  },
  { bg: 'from-slate-400 to-slate-500',   ring: 'ring-slate-200',  label: '🥈', glow: 'shadow-slate-200'  },
  { bg: 'from-orange-400 to-orange-500', ring: 'ring-orange-200', label: '🥉', glow: 'shadow-orange-200' },
];

export default function AIDietitianPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { addItem, toggleDrawer } = useCartStore();
  const [query, setQuery] = useState('');
  const [loadStep, setLoadStep] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

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
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 50%, #e0f2fe 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center">
          {/* Lock icon with glow */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-300 to-teal-400 opacity-30 blur-2xl scale-110" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-300">
              <Bot className="w-14 h-14 text-white" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-4">
            <Zap className="w-3 h-3" /> Yapay Zeka Destekli
          </div>
          <h1 className="font-display text-4xl font-bold text-stone-800 mb-3">AI Diyetisyen</h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Sağlığınıza özel organik ürün tavsiyeleri alabilmek için giriş yapmanız gerekiyor.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Kişisel analiz', 'Organik öneriler', 'Sağlık odaklı'].map(f => (
              <span key={f} className="text-xs text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full font-medium">{f}</span>
            ))}
          </div>

          <Link to="/giris"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-[1.02] transition-all text-sm">
            Giriş Yap ve Başla <ChevronRight className="w-4 h-4" />
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
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #012416 0%, #022c22 25%, #064e3b 55%, #065f46 75%, #0d7761 100%)' }}>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Blob lights */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-400/5 blur-[100px] pointer-events-none" />

        {/* Decorative floating items */}
        <div className="absolute top-6 left-10 text-4xl opacity-[0.12] animate-float select-none">🌿</div>
        <div className="absolute top-20 right-16 text-3xl opacity-[0.10] animate-float-slow select-none">🍃</div>
        <div className="absolute bottom-16 left-1/4 text-2xl opacity-[0.08] animate-float select-none">🌱</div>
        <div className="absolute bottom-8 right-1/3 text-3xl opacity-[0.07] animate-float-slow select-none">🫚</div>

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-teal-300 border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3 h-3" /> Yapay Zeka Destekli Beslenme Danışmanı
          </motion.div>

          {/* Main icon */}
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="relative inline-flex items-center justify-center mb-8">
            {/* Rings */}
            <span className="absolute w-36 h-36 rounded-full border border-white/[0.06]" />
            <span className="absolute w-28 h-28 rounded-full border border-white/[0.08]" />
            <span className="absolute w-24 h-24 rounded-full bg-white/[0.05] animate-ping" style={{ animationDuration: '3s' }} />
            {/* Core */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400/40 to-teal-500/40 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
              <Bot className="w-10 h-10 text-white drop-shadow-lg" />
              {/* Pulse dot */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
            Kişisel<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Diyetisyeniniz
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-emerald-200/70 text-lg max-w-lg mx-auto leading-relaxed mb-8">
            {hasProfile
              ? `Sağlık profiliniz hazır. "${hp?.goals?.[0] ?? 'beslenme'}" hedefiniz için analiz başlatalım.`
              : 'Nasıl hissettiğinizi anlatın — AI size en uygun organik ürünleri seçsin.'}
          </motion.p>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { emoji: '🌿', label: '2000+ ürün' },
              { emoji: '🤖', label: 'Anlık analiz' },
              { emoji: '❤️', label: 'Kişisel plan' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 bg-white/[0.07] border border-white/10 px-3.5 py-1.5 rounded-full">
                <span className="text-sm">{s.emoji}</span>
                <span className="text-xs font-semibold text-white/80">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Profile chips */}
          {hasProfile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}
              className="flex flex-wrap justify-center gap-2">
              {hp?.goals?.slice(0, 3).map(g => (
                <span key={g} className="inline-flex items-center gap-1.5 text-xs bg-emerald-400/15 text-emerald-200 px-3 py-1.5 rounded-full border border-emerald-400/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />{g}
                </span>
              ))}
              {hp?.allergies?.slice(0, 2).map(a => (
                <span key={a} className="inline-flex items-center gap-1.5 text-xs bg-rose-400/20 text-rose-200 px-3 py-1.5 rounded-full border border-rose-400/25">
                  <Shield className="w-3 h-3" />⚠ {a}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 32 Q720 0 1440 32 L1440 32 L0 32Z" fill="#f7f5f0" />
          </svg>
        </div>
      </div>

      {/* ── How it works ── */}
      {!result && (
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-2">
          <div className="grid grid-cols-3 gap-3">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  className="bg-white rounded-2xl border border-stone-100 p-4 text-center shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold text-stone-800 text-sm mb-0.5">{step.label}</p>
                  <p className="text-xs text-stone-400 leading-tight">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-24 space-y-6">

        {/* ── Query Form ── */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {/* Gradient-border input card */}
              <div className="relative rounded-3xl p-[2px] shadow-lg shadow-emerald-100/60"
                style={{ background: 'linear-gradient(135deg, #34d399 0%, #14b8a6 35%, #6366f1 70%, #34d399 100%)' }}>
                <div className="bg-white rounded-[22px] overflow-hidden">

                  {/* Colourful header */}
                  <div className="px-6 pt-5 pb-4"
                    style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 50%, #eff6ff 100%)' }}>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-stone-800 text-base">Durumunuzu anlatın</p>
                        <p className="text-xs text-stone-500">AI diyetisyeniniz dinliyor...</p>
                      </div>
                      {query.length > 0 && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          query.length > 250 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                        }`}>{query.length}/300</span>
                      )}
                    </div>

                    {/* Quick example pills inside header */}
                    {!query && (
                      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Örnek:</span>
                        {['Çok yorgunum', 'Karnım şişiyor', 'Uyku sorunu', 'Kilo vermek'].map(ex => (
                          <button key={ex} type="button" onClick={() => setQuery(ex)}
                            className="text-[11px] font-semibold bg-white/80 border border-stone-200 text-stone-500 px-2.5 py-0.5 rounded-full hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all">
                            {ex}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Textarea */}
                  <div className="px-6 py-4">
                    <div className="relative">
                      <textarea rows={4} value={query}
                        onChange={(e) => setQuery(e.target.value.slice(0, 300))}
                        disabled={isPending}
                        placeholder="Örn: Son günlerde çok halsiz hissediyorum, karnım şişkin. Süt alerjim var. Ne önerirsiniz?"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-stone-100 bg-stone-50/50 focus:bg-white focus:border-emerald-300 focus:outline-none text-stone-800 text-sm resize-none transition-all placeholder:text-stone-300 leading-relaxed"
                      />
                      {query && (
                        <button type="button" onClick={() => setQuery('')}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-stone-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                          <X className="w-3.5 h-3.5 text-stone-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick suggestions */}
                  <div className="px-6 pb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-500" /> Hızlı seçim
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SUGGESTIONS.map(s => {
                        const isSelected = query === s.text;
                        return (
                          <button key={s.text} type="button"
                            onClick={() => setQuery(q => q === s.text ? '' : s.text)}
                            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                              isSelected
                                ? `${s.bg} ${s.border} ${s.text_} shadow-sm scale-[0.98]`
                                : 'bg-stone-50 text-stone-600 border-stone-100 hover:bg-stone-100 hover:border-stone-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? s.dot : 'bg-stone-300'}`} />
                            <span className="text-base leading-none flex-shrink-0">{s.icon}</span>
                            <span className="leading-tight">{s.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="px-6 pb-6">
                    <form onSubmit={(e) => { e.preventDefault(); mutate(query); }}>
                      <button type="submit" disabled={isPending}
                        className="relative w-full overflow-hidden py-4 rounded-2xl font-bold text-sm text-white transition-all
                          bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600
                          shadow-lg shadow-emerald-200
                          hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.01]
                          disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed">
                        <span className="relative flex items-center justify-center gap-2.5">
                          <Sparkles className="w-4 h-4" />
                          Kişisel Analizimi Başlat
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
              className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
              {/* Progress bar */}
              <div className="h-1.5 bg-stone-100 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-full"
                  animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '50%' }} />
              </div>

              <div className="p-14 flex flex-col items-center gap-7">
                {/* Animated brain/bot */}
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-emerald-300/20 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute -inset-1.5 rounded-full bg-emerald-200/30" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center border-2 border-emerald-100 shadow-lg shadow-emerald-100">
                    <Bot className="w-11 h-11 text-emerald-600" />
                    <HeartPulse className="w-6 h-6 text-teal-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md animate-pulse" />
                  </div>
                </div>

                <div className="text-center max-w-xs">
                  <p className="font-bold text-stone-800 text-lg mb-3">AI analiz yapıyor</p>
                  <AnimatePresence mode="wait">
                    <motion.div key={loadStep}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 justify-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                      <span className="text-xl">{LOADING_STEPS[loadStep].icon}</span>
                      <p className="text-sm text-emerald-700 font-medium">{LOADING_STEPS[loadStep].text}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {LOADING_STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all duration-300 ${
                        i < loadStep ? 'bg-emerald-500 text-white scale-90' :
                        i === loadStep ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' :
                        'bg-stone-100 text-stone-400'
                      }`}>
                        {i < loadStep ? '✓' : s.icon}
                      </div>
                      {i < LOADING_STEPS.length - 1 && (
                        <div className={`w-6 h-0.5 rounded-full transition-colors ${i < loadStep ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                      )}
                    </div>
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

              {/* Report header */}
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #012416 0%, #022c22 40%, #065f46 100%)' }}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-0.5">AI Raporu</p>
                      <p className="text-white font-bold text-base">{user?.name} için hazırlandı</p>
                    </div>
                    <div className="bg-emerald-400/20 border border-emerald-400/30 px-3.5 py-2 rounded-xl text-center">
                      <p className="text-xl font-black text-white">{result.response.recommendations?.length ?? 0}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Öneri</p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Genel Değerlendirme</p>
                    </div>
                    <p className="text-emerald-100/90 text-sm leading-relaxed">{result.response.summary}</p>
                  </div>
                </div>
              </div>

              {/* Dietary advice */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 rounded-3xl p-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-8 -translate-y-16 opacity-50" />
                <div className="relative flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                    <HeartPulse className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 mb-2">Beslenme Tavsiyesi</p>
                    <p className="text-blue-700 text-sm leading-relaxed">{result.response.dietaryAdvice}</p>
                  </div>
                </div>
              </div>

              {/* Avoid list */}
              {result.response.avoidList?.length > 0 && (
                <div className="bg-white border border-rose-100 rounded-3xl overflow-hidden">
                  <div className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-rose-50 to-red-50 border-b border-rose-100">
                    <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="font-bold text-rose-800">Uzak Durmanız Gerekenler</p>
                    <span className="ml-auto text-xs font-bold text-rose-400 bg-rose-100 px-2.5 py-1 rounded-full">
                      {result.response.avoidList.length} ürün
                    </span>
                  </div>
                  <div className="p-4 grid sm:grid-cols-2 gap-2">
                    {result.response.avoidList.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-rose-50/70 border border-rose-100 rounded-xl px-4 py-3">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-xs">{item.product.name}</p>
                          <p className="text-[11px] text-rose-500 leading-tight mt-0.5">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.response.recommendations?.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-200">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-stone-800">Size Özel Sepet</h2>
                      <p className="text-xs text-stone-400">En yüksek fayda skoruna göre sıralandı</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.response.recommendations.map((rec, idx) => (
                      <RecommendationCard key={rec._id} product={rec.product} reason={rec.reason}
                        score={rec.benefitScore} rank={idx}
                        added={addedIds.has(rec.product._id)}
                        onCart={() => {
                          addItem(rec.product);
                          toggleDrawer();
                          setAddedIds(prev => new Set([...prev, rec.product._id]));
                        }} />
                    ))}
                  </div>
                </div>
              )}

              {/* New analysis button */}
              <button onClick={() => { reset(); setQuery(''); setAddedIds(new Set()); }}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-stone-200 text-stone-400 rounded-2xl text-sm font-semibold hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all group">
                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Yeni Analiz Başlat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Recommendation Card ── */
function RecommendationCard({ product, reason, score, rank, added, onCart }: {
  product: Product; reason: string; score: number; rank: number; added: boolean; onCart: () => void;
}) {
  const rankStyle = RANK_STYLES[rank] ?? null;
  const scoreColor = score >= 8 ? 'from-emerald-400 to-teal-500' : score >= 6 ? 'from-yellow-400 to-amber-500' : 'from-orange-400 to-red-400';
  const scoreBg    = score >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : score >= 6 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-orange-50 text-orange-700 border-orange-100';

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-shadow flex flex-col group">

      {rankStyle && (
        <div className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-lg">
          {rankStyle.label}
        </div>
      )}

      {/* Score badge */}
      <div className={`absolute top-3 right-3 z-10 flex items-center gap-1 ${scoreBg} border px-2 py-1 rounded-full backdrop-blur-sm`}>
        <BarChart2 className="w-3 h-3" />
        <span className="text-[10px] font-black">{score}/10</span>
      </div>

      {/* Image */}
      <Link to={`/urunler/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-stone-100 block">
        <img src={product.images?.[0] || 'https://placehold.co/400x300/d1fae5/065f46?text=🌿'}
          alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        {/* Score bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
          <motion.div className={`h-full bg-gradient-to-r ${scoreColor}`}
            initial={{ width: 0 }} animate={{ width: `${score * 10}%` }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }} />
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <Link to={`/urunler/${product.slug}`}>
            <h3 className="font-bold text-stone-800 text-sm leading-snug hover:text-primary-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-base font-bold text-primary-700 mt-1.5">
            {formatPrice(product.discountedPrice ?? product.price)}
            <span className="text-xs font-normal text-stone-400 ml-1">/ {product.unit}</span>
          </p>
        </div>

        {/* Reason */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-3 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Leaf className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Neden önerildi?</span>
          </div>
          <p className="text-xs text-emerald-800 leading-snug line-clamp-3">{reason}</p>
        </div>

        {/* Cart button */}
        <button onClick={onCart} disabled={added}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
            added
              ? 'bg-stone-100 text-stone-400 cursor-default'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 active:scale-95 shadow-sm'
          }`}>
          {added
            ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Eklendi</>
            : <><ShoppingCart className="w-3.5 h-3.5" /> Sepete Ekle</>
          }
        </button>
      </div>
    </motion.div>
  );
}
