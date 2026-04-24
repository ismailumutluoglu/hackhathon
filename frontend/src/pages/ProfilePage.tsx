import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  User, Mail, Phone, MapPin, Edit3, Save, X,
  ShoppingBag, Heart, Leaf, ChevronRight, Shield, Star, Sparkles,
  Loader2, Bot, AlertTriangle, CheckCircle2, Tag, Clock,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { aiService } from '../services/ai.service';
import { productService } from '../services/product.service';
import { useCountdown } from '../hooks/useCountdown';
import { formatPrice } from '../lib/utils';
import type { AIRecommendationResult, HealthProfile, Product } from '../types';
import api from '../services/api';

/* ── static option lists ── */
const GOALS       = ['Kilo vermek', 'Kilo almak', 'Kas kazanmak', 'Enerji artırmak', 'Bağışıklığı güçlendirmek', 'Sağlıklı beslenmek', 'Sindirimi düzeltmek'];
const CONDITIONS  = ['Diyabet', 'Hipertansiyon', 'Yüksek kolesterol', 'Kalp hastalığı', 'Böbrek hastalığı', 'Anemi', 'Tiroid bozukluğu'];
const RESTRICTIONS= ['Vejetaryen', 'Vegan', 'Glutensiz', 'Laktozsuz', 'Şekersiz', 'Tuzsuz'];
const ALLERGIES   = ['Fıstık', 'Süt', 'Yumurta', 'Gluten', 'Balık', 'Kabuklu deniz ürünleri', 'Soya', 'Fındık'];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

const roleConfig: Record<string, { label: string; icon: typeof Shield; pill: string }> = {
  customer: { label: 'Müşteri',  icon: Star,   pill: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200' },
  admin:    { label: 'Yönetici', icon: Shield, pill: 'bg-red-100 text-red-800 ring-1 ring-red-200' },
};

type HForm = {
  age: string; weight: string; height: string;
  conditions: string[]; goals: string[]; dietaryRestrictions: string[]; allergies: string[];
};

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();

  /* personal info */
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  /* health profile */
  const [editingHealth, setEditingHealth] = useState(false);
  const [savingHealth,  setSavingHealth]  = useState(false);
  const [healthSuccess, setHealthSuccess] = useState('');
  const [healthError,   setHealthError]   = useState('');
  const [healthForm, setHealthForm] = useState<HForm>({
    age:    String(user?.healthProfile?.age    ?? ''),
    weight: String(user?.healthProfile?.weight ?? ''),
    height: String(user?.healthProfile?.height ?? ''),
    conditions:          user?.healthProfile?.conditions          ?? [],
    goals:               user?.healthProfile?.goals               ?? [],
    dietaryRestrictions: user?.healthProfile?.dietaryRestrictions ?? [],
    allergies:           user?.healthProfile?.allergies           ?? [],
  });

  /* AI */
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult,  setAiResult]  = useState<AIRecommendationResult | null>(null);
  const [aiError,   setAiError]   = useState('');

  /* campaigns */
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => productService.getCampaigns(),
  });

  if (!isAuthenticated) return <Navigate to="/giris" replace />;

  /* ── handlers ── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess(''); setSaving(true);
    try {
      const res = await api.patch<{ success: boolean; user: typeof user }>('/users/me', form);
      updateUser(res.data.user as any);
      setSuccess('Profil güncellendi.'); setEditing(false);
    } catch (err: any) { setError(err.response?.data?.message || 'Güncelleme başarısız.'); }
    finally { setSaving(false); }
  }

  async function handleSaveHealth(e: React.FormEvent) {
    e.preventDefault(); setHealthError(''); setHealthSuccess(''); setSavingHealth(true);
    try {
      const body: Partial<HealthProfile> = {
        conditions:          healthForm.conditions,
        goals:               healthForm.goals,
        dietaryRestrictions: healthForm.dietaryRestrictions,
        allergies:           healthForm.allergies,
        ...(healthForm.age    ? { age:    Number(healthForm.age)    } : {}),
        ...(healthForm.weight ? { weight: Number(healthForm.weight) } : {}),
        ...(healthForm.height ? { height: Number(healthForm.height) } : {}),
      };
      const res = await api.patch<{ success: boolean; healthProfile: HealthProfile }>('/users/health-profile', body);
      updateUser({ healthProfile: res.data.healthProfile });
      setHealthSuccess('Sağlık profili kaydedildi.'); setEditingHealth(false);
    } catch (err: any) { setHealthError(err.response?.data?.message || 'Kayıt başarısız.'); }
    finally { setSavingHealth(false); }
  }

  async function handleAnalyze() {
    setAiError(''); setAiResult(null); setAnalyzing(true);
    try {
      const result = await aiService.getRecommendations();
      setAiResult(result);
    } catch (err: any) { setAiError(err.response?.data?.message || 'Analiz başarısız. API anahtarını kontrol edin.'); }
    finally { setAnalyzing(false); }
  }

  function cancelHealth() {
    setHealthForm({
      age:    String(user?.healthProfile?.age    ?? ''),
      weight: String(user?.healthProfile?.weight ?? ''),
      height: String(user?.healthProfile?.height ?? ''),
      conditions:          user?.healthProfile?.conditions          ?? [],
      goals:               user?.healthProfile?.goals               ?? [],
      dietaryRestrictions: user?.healthProfile?.dietaryRestrictions ?? [],
      allergies:           user?.healthProfile?.allergies           ?? [],
    });
    setEditingHealth(false); setHealthError('');
  }

  function toggleTag(field: keyof Pick<HForm, 'conditions'|'goals'|'dietaryRestrictions'|'allergies'>, val: string) {
    setHealthForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
    }));
  }

  const role     = roleConfig[user?.role || 'customer'];
  const RoleIcon = role.icon;
  const hp       = user?.healthProfile;
  const hasHealthData = hp && (
    hp.goals?.length || hp.conditions?.length || hp.allergies?.length ||
    hp.dietaryRestrictions?.length || hp.age || hp.weight || hp.height
  );

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-b-[3rem]"
        style={{ background: 'linear-gradient(135deg, #1a3a16 0%, #2d6a27 45%, #4a8f3f 75%, #8b6914 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-yellow-300/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-16 flex flex-col items-center text-center">
          <span className="mb-7 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold text-white/50 border border-white/15 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />{getGreeting()}
          </span>

          <div className="relative mb-6 flex items-center justify-center">
            <span className="absolute w-40 h-40 rounded-full bg-white/[0.06] animate-ping" style={{ animationDuration: '3s' }} />
            <span className="absolute w-36 h-36 rounded-full bg-white/[0.08]" />
            <span className="absolute w-32 h-32 rounded-full bg-white/[0.12]" />
            <div className="relative w-28 h-28 rounded-full shadow-2xl ring-[3px] ring-white/30 overflow-hidden bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md flex items-center justify-center">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <span className="text-white font-display font-bold text-4xl select-none drop-shadow">{getInitials(user?.name || 'U')}</span>
              }
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-md">{user?.name}</h1>
          <p className="text-white/50 text-sm mb-5 font-medium">{user?.email}</p>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full shadow-md ${role.pill}`}>
            <RoleIcon className="w-3.5 h-3.5" />{role.label}
          </span>
        </div>

      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-24 space-y-5">

        {/* alerts */}
        {error   && <Alert type="error"   text={error} />}
        {success && <Alert type="success" text={success} />}

        {/* ── Personal Info ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100/80 overflow-hidden">
          <CardHeader icon={<User className="w-3.5 h-3.5 text-primary-600" />} iconBg="bg-primary-50" title="Kişisel Bilgiler">
            {!editing && (
              <EditBtn onClick={() => setEditing(true)} />
            )}
          </CardHeader>
          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <FloatingInput label="Ad Soyad" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
                <FloatingInput label="Telefon" value={form.phone} placeholder="+90 5xx xxx xx xx" onChange={v => setForm(f => ({ ...f, phone: v }))} />
                <FormActions saving={saving} onCancel={() => { setForm({ name: user?.name||'', phone: user?.phone||'' }); setEditing(false); setError(''); }} />
              </form>
            ) : (
              <div className="space-y-1">
                <InfoRow icon={User}  color="bg-violet-50 text-violet-500" label="Ad Soyad" value={user?.name} />
                <InfoRow icon={Mail}  color="bg-blue-50 text-blue-500"     label="E-posta"  value={user?.email} />
                <InfoRow icon={Phone} color="bg-teal-50 text-teal-500"     label="Telefon"  value={user?.phone || '—'} />
                {(user?.addresses?.length ?? 0) > 0 && (
                  <InfoRow icon={MapPin} color="bg-rose-50 text-rose-500" label="Konum"
                    value={`${user?.addresses?.[0]?.district}, ${user?.addresses?.[0]?.city}`} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Health Profile ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100/80 overflow-hidden">
          <CardHeader icon={<Heart className="w-3.5 h-3.5 text-rose-500" />} iconBg="bg-rose-50" title="Sağlık Profilim">
            {!editingHealth && <EditBtn onClick={() => setEditingHealth(true)} />}
          </CardHeader>

          {healthError   && <div className="mx-6 mt-4"><Alert type="error"   text={healthError} /></div>}
          {healthSuccess && <div className="mx-6 mt-4"><Alert type="success" text={healthSuccess} /></div>}

          <AnimatePresence mode="wait">
            {editingHealth ? (
              <motion.div key="edit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <form onSubmit={handleSaveHealth} className="p-6 space-y-6">

                  {/* numbers */}
                  <div className="grid grid-cols-3 gap-3">
                    {([['age','Yaş','yaş'],['weight','Kilo','kg'],['height','Boy','cm']] as const).map(([field, label, unit]) => (
                      <div key={field} className="relative">
                        <input
                          type="number"
                          value={healthForm[field]}
                          onChange={e => setHealthForm(f => ({ ...f, [field]: e.target.value }))}
                          placeholder="—"
                          className="peer w-full border-2 border-stone-200 rounded-2xl px-3 pt-6 pb-2 text-stone-800 text-sm text-center focus:outline-none focus:border-primary-400 bg-stone-50 focus:bg-white transition-colors"
                        />
                        <label className="absolute left-0 right-0 top-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-stone-400 peer-focus:text-primary-500">
                          {label} ({unit})
                        </label>
                      </div>
                    ))}
                  </div>

                  <TagField label="Hedeflerim" options={GOALS} selected={healthForm.goals}
                    onToggle={v => toggleTag('goals', v)} color="primary" />
                  <TagField label="Sağlık Durumlarım" options={CONDITIONS} selected={healthForm.conditions}
                    onToggle={v => toggleTag('conditions', v)} color="blue" />
                  <TagField label="Diyet Kısıtlamalarım" options={RESTRICTIONS} selected={healthForm.dietaryRestrictions}
                    onToggle={v => toggleTag('dietaryRestrictions', v)} color="amber" />
                  <TagField label="Alerjilerim" options={ALLERGIES} selected={healthForm.allergies}
                    onToggle={v => toggleTag('allergies', v)} color="rose" />

                  <FormActions saving={savingHealth} saveLabel="Profili Kaydet" onCancel={cancelHealth} />
                </form>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {/* view mode */}
                {hasHealthData ? (
                  <div className="p-6 space-y-5">
                    {/* stats */}
                    {(hp?.age || hp?.weight || hp?.height) && (
                      <div className="grid grid-cols-3 gap-3">
                        {hp?.age    && <GlowStat label="Yaş"  value={String(hp.age)}    unit="yaş" color="from-violet-400 to-purple-500" />}
                        {hp?.weight && <GlowStat label="Kilo" value={String(hp.weight)} unit="kg"  color="from-blue-400 to-indigo-500" />}
                        {hp?.height && <GlowStat label="Boy"  value={String(hp.height)} unit="cm"  color="from-teal-400 to-emerald-500" />}
                      </div>
                    )}
                    {hp?.goals?.length       ? <ChipGroup label="Hedefler"     chips={hp.goals}               color="primary" /> : null}
                    {hp?.conditions?.length  ? <ChipGroup label="Sağlık Durumu" chips={hp.conditions}          color="blue"    /> : null}
                    {hp?.dietaryRestrictions?.length ? <ChipGroup label="Diyet" chips={hp.dietaryRestrictions} color="amber"   /> : null}
                    {hp?.allergies?.length   ? <ChipGroup label="Alerjiler"    chips={hp.allergies}            color="rose"    /> : null}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-7 h-7 text-rose-400" />
                    </div>
                    <p className="text-stone-500 text-sm mb-1 font-medium">Sağlık profiliniz boş</p>
                    <p className="text-stone-400 text-xs">Bilgilerinizi ekleyerek AI'dan kişisel öneriler alın.</p>
                  </div>
                )}

                {/* AI analyze button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm text-white shadow-md transition-all
                      bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500
                      hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600
                      hover:shadow-lg hover:shadow-purple-200 hover:scale-[1.01]
                      disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {analyzing
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Profiliniz analiz ediliyor...</>
                      : <><Bot className="w-4 h-4" /><Sparkles className="w-3.5 h-3.5" /> AI ile Sağlık Analizi Yap</>
                    }
                  </button>
                </div>

                {/* AI result */}
                <AnimatePresence>
                  {aiError && (
                    <motion.div className="mx-6 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{aiError}
                      </div>
                    </motion.div>
                  )}
                  {aiResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mx-6 mb-6 space-y-4"
                    >
                      {/* summary */}
                      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-violet-600" />
                          <p className="text-xs font-bold uppercase tracking-widest text-violet-600">AI Değerlendirmesi</p>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">{aiResult.response.summary}</p>
                        {aiResult.response.dietaryAdvice && (
                          <p className="mt-2 text-xs text-violet-700 bg-white/60 rounded-xl px-3 py-2 leading-relaxed">
                            💡 {aiResult.response.dietaryAdvice}
                          </p>
                        )}
                      </div>

                      {/* top recommendations */}
                      {aiResult.response.recommendations?.slice(0, 3).map((rec) => (
                        <div key={rec._id} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-stone-200">
                            {rec.product.images?.[0] && (
                              <img src={rec.product.images[0]} alt={rec.product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-stone-800 text-sm truncate">{rec.product.name}</p>
                              <span className="flex-shrink-0 text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                                {rec.benefitScore}/10
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 leading-snug line-clamp-2">{rec.reason}</p>
                          </div>
                        </div>
                      ))}

                      <Link
                        to="/diyetisyen"
                        className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-violet-200 text-violet-700 rounded-2xl text-sm font-semibold hover:bg-violet-50 transition-colors"
                      >
                        Tüm önerileri gör <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Campaigns ── */}
        {campaigns && campaigns.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100/80 overflow-hidden">
            <CardHeader icon={<Tag className="w-3.5 h-3.5 text-red-500" />} iconBg="bg-red-50" title="Aktif Kampanyalar">
              <Link to="/kampanyalar"
                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors">
                Tümünü gör <ChevronRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <div className="p-4">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {campaigns.map((p) => <CampaignCard key={p._id} product={p} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── Addresses ── */}
        {(user?.addresses?.length ?? 0) > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100/80 overflow-hidden">
            <CardHeader icon={<MapPin className="w-3.5 h-3.5 text-blue-500" />} iconBg="bg-blue-50" title="Adreslerim" />
            <div className="divide-y divide-stone-50">
              {user?.addresses?.map((addr) => (
                <div key={addr._id} className="px-6 py-4 flex gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-stone-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-stone-800 text-sm">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Varsayılan</span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500 leading-snug">{addr.fullAddress}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{addr.district}, {addr.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 gap-4">
          <ActionCard to="/siparislerim" gradient="from-amber-400 via-orange-400 to-amber-500" icon={ShoppingBag} title="Siparişlerim"  subtitle="Tüm siparişleri görüntüle" />
          <ActionCard to="/diyetisyen"   gradient="from-emerald-400 via-teal-400 to-primary-500" icon={Leaf}        title="AI Diyetisyen" subtitle="Kişisel öneriler al" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════ Sub-components ══════════════ */

function CardHeader({ icon, iconBg, title, children }: {
  icon: React.ReactNode; iconBg: string; title: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
      <h2 className="font-semibold text-stone-700 text-sm flex items-center gap-2">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-colors">
      <Edit3 className="w-3 h-3" />Düzenle
    </button>
  );
}

function Alert({ type, text }: { type: 'error'|'success'; text: string }) {
  const s = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-emerald-50 border-emerald-200 text-emerald-700';
  const Icon = type === 'error' ? X : CheckCircle2;
  return (
    <div className={`flex items-center gap-2 border px-4 py-3 rounded-2xl text-sm shadow-sm ${s}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />{text}
    </div>
  );
}

function InfoRow({ icon: Icon, color, label, value }: {
  icon: React.ElementType; color: string; label: string; value?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-stone-50 last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</p>
        <p className="text-stone-800 font-medium text-sm truncate">{value}</p>
      </div>
    </div>
  );
}

function FloatingInput({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="relative">
      <input required={required} value={value} placeholder={placeholder || ' '} onChange={e => onChange(e.target.value)}
        className="peer w-full border-2 border-stone-200 rounded-2xl px-4 pt-6 pb-2.5 text-stone-800 text-sm focus:outline-none focus:border-primary-400 bg-stone-50 focus:bg-white transition-colors" />
      <label className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 peer-focus:text-primary-500 transition-colors">
        {label}
      </label>
    </div>
  );
}

function FormActions({ saving, saveLabel = 'Kaydet', onCancel }: { saving: boolean; saveLabel?: string; onCancel: () => void }) {
  return (
    <div className="flex gap-3 pt-1">
      <button type="submit" disabled={saving}
        className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:from-primary-700 hover:to-primary-600 disabled:opacity-60 transition-all shadow-md shadow-primary-500/25">
        <Save className="w-4 h-4" />{saving ? 'Kaydediliyor...' : saveLabel}
      </button>
      <button type="button" onClick={onCancel}
        className="flex items-center gap-2 border border-stone-200 text-stone-600 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-stone-50 transition-colors">
        <X className="w-4 h-4" />İptal
      </button>
    </div>
  );
}

const tagColors: Record<string, { active: string; inactive: string }> = {
  primary: { active: 'bg-primary-500 text-white ring-primary-500', inactive: 'bg-stone-50 text-stone-600 ring-stone-200 hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-300' },
  blue:    { active: 'bg-blue-500 text-white ring-blue-500',        inactive: 'bg-stone-50 text-stone-600 ring-stone-200 hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-300' },
  amber:   { active: 'bg-amber-500 text-white ring-amber-500',      inactive: 'bg-stone-50 text-stone-600 ring-stone-200 hover:bg-amber-50 hover:text-amber-700 hover:ring-amber-300' },
  rose:    { active: 'bg-rose-500 text-white ring-rose-500',        inactive: 'bg-stone-50 text-stone-600 ring-stone-200 hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-300' },
};

function TagField({ label, options, selected, onToggle, color }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void; color: keyof typeof tagColors;
}) {
  const c = tagColors[color];
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full ring-1 transition-all ${selected.includes(opt) ? c.active : c.inactive}`}>
            {selected.includes(opt) && <span className="mr-1">✓</span>}{opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipGroup({ label, chips, color }: { label: string; chips: string[]; color: keyof typeof tagColors }) {
  const c = tagColors[color];
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {chips.map(c2 => (
          <span key={c2} className={`text-xs font-medium px-3 py-1 rounded-full ring-1 ${c.active}`}>{c2}</span>
        ))}
      </div>
    </div>
  );
}

function GlowStat({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${color}`}>
      <div className="absolute -top-3 -right-3 w-14 h-14 bg-white/15 rounded-full" />
      <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-bold text-2xl leading-none">{value}</p>
      <p className="text-white/70 text-xs mt-0.5">{unit}</p>
    </div>
  );
}

function CampaignCard({ product }: { product: Product }) {
  const countdown = useCountdown(product.campaignEndsAt);
  const original  = product.campaignOriginalPrice ?? product.price;
  const current   = product.discountedPrice       ?? product.price;
  const discount  = original > current ? Math.round((1 - current / original) * 100) : null;

  return (
    <Link
      to={`/urunler/${product.slug}`}
      className="flex-shrink-0 w-40 rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md hover:border-red-200 hover:scale-[1.02] transition-all duration-200 group bg-white"
    >
      {/* image */}
      <div className="relative h-28 bg-stone-100 overflow-hidden">
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-stone-300" /></div>
        }
        {discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            -%{discount}
          </span>
        )}
      </div>

      {/* info */}
      <div className="p-3">
        <p className="text-stone-800 font-medium text-xs leading-tight line-clamp-2 mb-2">{product.name}</p>
        <p className="font-bold text-primary-600 text-sm">{formatPrice(current)}</p>
        {discount && (
          <p className="text-[10px] text-stone-400 line-through">{formatPrice(original)}</p>
        )}

        {/* countdown */}
        {product.campaignEndsAt && !countdown.expired && (
          <div className="mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-400 flex-shrink-0" />
            <div className="flex gap-0.5 text-[9px] font-bold">
              {countdown.days > 0 && <span className="bg-red-50 text-red-600 px-1 py-0.5 rounded">{countdown.days}g</span>}
              <span className="bg-red-50 text-red-600 px-1 py-0.5 rounded">{String(countdown.hours).padStart(2,'0')}s</span>
              <span className="bg-red-50 text-red-600 px-1 py-0.5 rounded">{String(countdown.minutes).padStart(2,'0')}d</span>
              <span className="bg-red-50 text-red-600 px-1 py-0.5 rounded">{String(countdown.seconds).padStart(2,'0')}sn</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function ActionCard({ to, gradient, icon: Icon, title, subtitle }: {
  to: string; gradient: string; icon: React.ElementType; title: string; subtitle: string;
}) {
  return (
    <Link to={to}
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} shadow-md group hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/15 rounded-full group-hover:scale-125 transition-transform duration-300" />
      <div className="relative">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="font-bold text-white text-sm leading-tight">{title}</p>
        <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
        <ChevronRight className="absolute right-0 bottom-0 w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
