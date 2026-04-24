import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Truck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/order.service';
import { formatPrice } from '../lib/utils';

export default function CheckoutPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    fullAddress: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  if (!isAuthenticated) return <Navigate to="/giris" replace />;
  if (items.length === 0) return <Navigate to="/urunler" replace />;

  const total = getTotal();
  const shippingFee = total >= 500 ? 0 : 49.90;
  const grandTotal = total + shippingFee;

  function updateAddress(key: keyof typeof address, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await orderService.createOrder({
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        payment: { method: paymentMethod },
      });
      clearCart();
      navigate('/siparislerim');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-primary-600">Alışveriş</p>
        <h1 className="font-display text-3xl font-bold text-stone-800">Sipariş Tamamla</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-lg text-stone-800">Teslimat Adresi</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Ad Soyad</label>
                <input
                  required
                  value={address.fullName}
                  onChange={(e) => updateAddress('fullName', e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Telefon</label>
                <input
                  required
                  type="tel"
                  value={address.phone}
                  onChange={(e) => updateAddress('phone', e.target.value)}
                  placeholder="05xx xxx xx xx"
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">İl</label>
                <input
                  required
                  value={address.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">İlçe</label>
                <input
                  required
                  value={address.district}
                  onChange={(e) => updateAddress('district', e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Açık Adres</label>
                <textarea
                  required
                  rows={3}
                  value={address.fullAddress}
                  onChange={(e) => updateAddress('fullAddress', e.target.value)}
                  placeholder="Mahalle, cadde, sokak, bina ve daire no..."
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-lg text-stone-800">Ödeme Yöntemi</h2>
            </div>
            <div className="space-y-3">
              {[
                { value: 'credit_card', label: 'Kredi / Banka Kartı' },
                { value: 'bank_transfer', label: 'Havale / EFT' },
                { value: 'cash_on_delivery', label: 'Kapıda Ödeme' },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-stone-200 hover:border-primary-300 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600"
                  />
                  <span className="text-sm font-medium text-stone-700">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-lg text-stone-800">Sipariş Özeti</h2>
            </div>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0] || 'https://placehold.co/48x48/e8f5e9/3d8b37?text=🌿'}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-500">{item.quantity} × {item.product.unit}</p>
                  </div>
                  <span className="text-sm font-semibold text-stone-800">
                    {formatPrice((item.product.discountedPrice ?? item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Ara Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Kargo</span>
                </div>
                {shippingFee === 0 ? (
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                ) : (
                  <span>{formatPrice(shippingFee)}</span>
                )}
              </div>
              <div className="flex justify-between font-bold text-base text-stone-800 pt-2 border-t border-stone-100">
                <span>Toplam</span>
                <span className="text-primary-700">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {total < 500 && (
              <p className="mt-3 text-xs text-stone-400 text-center">
                {formatPrice(500 - total)} daha ekleyin, kargo ücretsiz!
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full bg-primary-500 text-white py-3 rounded-full font-semibold hover:bg-primary-600 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Onayla'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
