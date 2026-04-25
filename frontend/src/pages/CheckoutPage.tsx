import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MapPin, CreditCard, Truck,
  Phone, User, Home, ChevronRight, Building2, Wallet,
  Lock, Eye, EyeOff, Copy, CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/order.service';
import { formatPrice } from '../lib/utils';

const BANK_INFO = {
  iban: 'TR12 0001 2345 6789 0123 4567 89',
  bank: 'Ziraat Bankası',
  name: 'Tazeköy Tarım A.Ş.',
};

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false); // bug fix: prevent redirect after clearCart

  const [address, setAddress] = useState({
    fullName: '', phone: '', city: '', district: '', fullAddress: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [showCvv, setShowCvv] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);

  if (!isAuthenticated) return <Navigate to="/giris" replace />;
  if (user?.role === 'admin' || user?.role === 'producer') return <Navigate to="/admin/dashboard" replace />;
  if (items.length === 0 && !orderPlaced) return <Navigate to="/urunler" replace />;

  const total = getTotal();
  const shippingFee = total >= 500 ? 0 : 49.90;
  const grandTotal = total + shippingFee;
  const freeShippingProgress = Math.min((total / 500) * 100, 100);

  function updateAddress(key: keyof typeof address, value: string) {
    setAddress(prev => ({ ...prev, [key]: value }));
  }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  function copyIban() {
    navigator.clipboard.writeText(BANK_INFO.iban.replace(/\s/g, '')).then(() => {
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        items: items.map(item => ({ productId: item.product._id, quantity: item.quantity })),
        shippingAddress: address,
        payment: { method: paymentMethod },
      });
      setOrderPlaced(true);   // prevent items.length === 0 redirect
      navigate('/siparis-onay', { state: { order } });
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  /* Card preview helpers */
  const cardDigits = card.number.replace(/\s/g, '');
  const maskedCard = Array.from({ length: 16 }, (_, i) =>
    i < cardDigits.length ? cardDigits[i] : '•'
  ).reduce((acc, d, i) => acc + (i > 0 && i % 4 === 0 ? ' ' : '') + d, '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-cream-50">
      {/* Sticky header */}
      <div className="bg-white/80 backdrop-blur border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-600 font-bold">Alışveriş</p>
            <h1 className="font-display text-2xl font-bold text-stone-800">Sipariş Tamamla</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {[{ n: '1', label: 'Adres', active: true }, { n: '2', label: 'Ödeme', active: true }, { n: '3', label: 'Onay', active: false }].map((step, i) => (
              <div key={step.n} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-4 h-4 text-stone-300" />}
                <div className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${step.active ? 'bg-primary-500 text-white' : 'border-2 border-stone-200 text-stone-400'}`}>{step.n}</span>
                  <span className={`text-xs font-semibold ${step.active ? 'text-primary-700' : 'text-stone-400'}`}>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 px-4 py-3.5 rounded-2xl text-sm border border-red-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center flex-shrink-0">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Address */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Teslimat Adresi</p>
                  <p className="text-xs text-primary-100">Siparişinizin gönderileceği adres</p>
                </div>
                <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">Adım 1</span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Ad Soyad" icon={<User className="w-4 h-4 text-stone-400" />}
                  value={address.fullName} onChange={v => updateAddress('fullName', v)} placeholder="Ad Soyad" required />
                <InputField label="Telefon" icon={<Phone className="w-4 h-4 text-stone-400" />}
                  value={address.phone} onChange={v => updateAddress('phone', v)} placeholder="05xx xxx xx xx" type="tel" required />
                <InputField label="İl" value={address.city} onChange={v => updateAddress('city', v)} placeholder="İstanbul" required />
                <InputField label="İlçe" value={address.district} onChange={v => updateAddress('district', v)} placeholder="Kadıköy" required />
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Açık Adres</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <textarea required rows={3} value={address.fullAddress}
                      onChange={e => updateAddress('fullAddress', e.target.value)}
                      placeholder="Mahalle, cadde, sokak, bina ve daire no..."
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm resize-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Ödeme Yöntemi</p>
                  <p className="text-xs text-indigo-100">Tercih ettiğiniz yöntemi seçin</p>
                </div>
                <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">Adım 2</span>
              </div>
              <div className="p-6 space-y-3">
                {/* Method selector */}
                {[
                  { value: 'credit_card', label: 'Kredi / Banka Kartı', icon: CreditCard, desc: 'Tüm kart türleri geçerli' },
                  { value: 'bank_transfer', label: 'Havale / EFT', icon: Building2, desc: 'Onay sonrası işlenir' },
                  { value: 'cash_on_delivery', label: 'Kapıda Ödeme', icon: Wallet, desc: 'Kapıda nakit veya kart' },
                ].map(method => {
                  const Icon = method.icon;
                  const selected = paymentMethod === method.value;
                  return (
                    <label key={method.value} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selected ? 'border-indigo-400 bg-indigo-50' : 'border-stone-100 bg-stone-50 hover:border-stone-200 hover:bg-white'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? 'bg-indigo-100' : 'bg-white border border-stone-200'}`}>
                        <Icon className={`w-5 h-5 ${selected ? 'text-indigo-600' : 'text-stone-400'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${selected ? 'text-indigo-800' : 'text-stone-700'}`}>{method.label}</p>
                        <p className={`text-xs ${selected ? 'text-indigo-400' : 'text-stone-400'}`}>{method.desc}</p>
                      </div>
                      <input type="radio" name="payment" value={method.value}
                        checked={selected} onChange={e => setPaymentMethod(e.target.value)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-indigo-500' : 'border-stone-300'}`}>
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                      </div>
                    </label>
                  );
                })}

                {/* ── Credit card form ── */}
                <AnimatePresence>
                  {paymentMethod === 'credit_card' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="pt-4 space-y-4">
                        {/* Visual card */}
                        <div className="relative h-44 rounded-2xl overflow-hidden select-none"
                          style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #6d28d9 100%)' }}>
                          {/* Shine overlay */}
                          <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
                          {/* Circles */}
                          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border border-white/10" />
                          <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full border border-white/10" />

                          <div className="absolute inset-0 p-5 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                  <CreditCard className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white/80 text-xs font-bold tracking-widest">TAZEKÖY</span>
                              </div>
                              {/* Chip */}
                              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 opacity-90" />
                            </div>

                            <div>
                              <p className="text-white font-mono text-lg tracking-[0.2em] mb-3 drop-shadow">{maskedCard}</p>
                              <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Kart Sahibi</p>
                                  <p className="text-white text-sm font-semibold uppercase tracking-wide truncate max-w-[160px]">
                                    {card.name || 'AD SOYAD'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Son Tarih</p>
                                  <p className="text-white text-sm font-semibold font-mono">{card.expiry || 'AA/YY'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card inputs */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Kart Numarası</label>
                            <input
                              value={card.number}
                              onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm font-mono tracking-widest"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Kart Üzerindeki Ad</label>
                            <input
                              value={card.name}
                              onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                              placeholder="AD SOYAD"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm uppercase tracking-wide"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Son Kullanma</label>
                              <input
                                value={card.expiry}
                                onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                                placeholder="AA/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">CVV</label>
                              <div className="relative">
                                <input
                                  type={showCvv ? 'text' : 'password'}
                                  value={card.cvv}
                                  onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                  placeholder="•••"
                                  maxLength={4}
                                  className="w-full px-4 py-3 pr-10 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm font-mono"
                                />
                                <button type="button" onClick={() => setShowCvv(v => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-50 rounded-xl px-3 py-2">
                          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                          Kart bilgileriniz 256-bit SSL ile şifrelenmektedir.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Bank transfer info ── */}
                <AnimatePresence>
                  {paymentMethod === 'bank_transfer' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="pt-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <p className="font-bold text-blue-800 text-sm">Havale / EFT Bilgileri</p>
                          </div>
                          {[
                            { label: 'Banka', value: BANK_INFO.bank },
                            { label: 'Hesap Sahibi', value: BANK_INFO.name },
                          ].map(row => (
                            <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-blue-100">
                              <span className="text-xs text-blue-500 font-semibold">{row.label}</span>
                              <span className="text-sm font-bold text-blue-900">{row.value}</span>
                            </div>
                          ))}
                          {/* IBAN with copy */}
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-xs text-blue-500 font-semibold">IBAN</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-bold text-blue-900">{BANK_INFO.iban}</span>
                              <button type="button" onClick={copyIban}
                                className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors flex-shrink-0">
                                {ibanCopied
                                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-blue-600 bg-blue-100 rounded-xl px-3 py-2 mt-1">
                            📋 Havale açıklamasına ad-soyadınızı ve sipariş numaranızı yazmayı unutmayın.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Cash on delivery info ── */}
                <AnimatePresence>
                  {paymentMethod === 'cash_on_delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="pt-4">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Wallet className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-bold text-amber-800 mb-1.5">Kapıda Ödeme</p>
                              <ul className="space-y-1.5">
                                {[
                                  'Nakit veya banka kartıyla ödeme yapabilirsiniz.',
                                  'Kurye kapınıza geldiğinde ödeme alınır.',
                                  'Bozuk para bulundurmanız kolaylık sağlar.',
                                ].map(t => (
                                  <li key={t} className="flex items-start gap-1.5 text-xs text-amber-700">
                                    <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>{t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
              <div className="px-5 py-4 bg-gradient-to-r from-stone-800 to-stone-700 flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-white" />
                <p className="font-bold text-white">Sipariş Özeti</p>
                <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">{items.length} ürün</span>
              </div>

              <div className="p-4 space-y-3 max-h-52 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product._id} className="flex items-center gap-3">
                    <img src={item.product.images[0] || 'https://placehold.co/48x48/e8f5e9/3d8b37?text=🌿'}
                      alt={item.product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-stone-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-stone-400">{item.quantity} × {item.product.unit}</p>
                    </div>
                    <span className="text-sm font-bold text-stone-800 flex-shrink-0">
                      {formatPrice((item.product.discountedPrice ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {total < 500 ? (
                <div className="px-4 py-3 bg-amber-50 border-y border-amber-100">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-amber-700 font-medium flex items-center gap-1"><Truck className="w-3 h-3" /> Ücretsiz kargo için</span>
                    <span className="font-bold text-amber-700">{formatPrice(500 - total)} kaldı</span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 bg-green-50 border-y border-green-100 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-semibold text-green-700">Kargo ücretsiz! 🎉</p>
                </div>
              )}

              <div className="p-5">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Ara Toplam</span><span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500">
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" />Kargo</span>
                    {shippingFee === 0 ? <span className="text-green-600 font-semibold">Ücretsiz</span> : <span>{formatPrice(shippingFee)}</span>}
                  </div>
                  <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100">
                    <span>Toplam</span>
                    <span className="text-primary-700 text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white
                    bg-gradient-to-r from-primary-500 to-primary-600
                    shadow-lg shadow-primary-200
                    hover:shadow-xl hover:shadow-primary-300 hover:scale-[1.01]
                    disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed
                    transition-all flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sipariş Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Siparişi Onayla — {formatPrice(grandTotal)}
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-stone-400 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Güvenli ödeme altyapısı
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, icon, value, onChange, placeholder, type = 'text', required }: {
  label: string; icon?: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm`} />
      </div>
    </div>
  );
}
