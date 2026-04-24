import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';

export default function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-lg">Sepetim</h2>
                {items.length > 0 && (
                  <span className="text-sm text-stone-500">({items.length} ürün)</span>
                )}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
                  <ShoppingCart className="w-12 h-12" />
                  <p className="text-center">Sepetiniz boş.<br />Organik ürünleri keşfedin!</p>
                  <Link
                    to="/urunler"
                    onClick={() => setDrawerOpen(false)}
                    className="bg-primary-500 text-white px-6 py-2 rounded-full text-sm hover:bg-primary-600 transition-colors"
                  >
                    Alışverişe Başla
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 bg-stone-50 rounded-xl p-3"
                  >
                    <img
                      src={item.product.images[0] || 'https://placehold.co/80x80/e8f5e9/3d8b37?text=🌿'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-stone-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formatPrice(item.product.discountedPrice ?? item.product.price)} / {item.product.unit}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="font-semibold text-sm text-primary-700">
                        {formatPrice((item.product.discountedPrice ?? item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-stone-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Ara Toplam</span>
                  <span className="font-bold text-lg text-primary-700">{formatPrice(total)}</span>
                </div>
                {total < 500 && (
                  <p className="text-xs text-stone-400 text-center">
                    {formatPrice(500 - total)} daha ekleyin, kargo ücretsiz!
                  </p>
                )}
                <Link
                  to="/odeme"
                  onClick={() => setDrawerOpen(false)}
                  className="block w-full bg-primary-500 text-white text-center py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
                >
                  Siparişi Tamamla
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
