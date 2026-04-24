import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Leaf } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount, toggleDrawer } = useCartStore();
  const { isMenuOpen, toggleMenu, setMenuOpen } = useUIStore();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const navLinks = [
    { to: '/urunler', label: 'Ürünler' },
    { to: '/kampanyalar', label: '🔥 Kampanyalar' },
    { to: '/diyetisyen', label: 'AI Diyetisyen' },
  ];

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-primary-700">TAZEKÖY</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-stone-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={toggleDrawer}
              className="relative p-2 text-stone-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-xs text-earth-600 font-semibold border border-earth-300 px-2 py-1 rounded">
                    Admin
                  </Link>
                )}
                <Link to="/profil" className="flex items-center gap-1 text-stone-600 hover:text-primary-600 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-stone-400 hover:text-red-500 transition-colors"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/giris" className="text-sm font-medium text-stone-600 hover:text-primary-600">
                  Giriş
                </Link>
                <Link
                  to="/kayit"
                  className="text-sm font-medium bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition-colors"
                >
                  Üye Ol
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-stone-600 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100"
          >
            <nav className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-stone-600 hover:text-primary-600 font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profil" onClick={() => setMenuOpen(false)} className="text-stone-600 py-2">Profilim</Link>
                    <Link to="/siparislerim" onClick={() => setMenuOpen(false)} className="text-stone-600 py-2">Siparişlerim</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-earth-600 font-semibold py-2">Admin Panel</Link>
                    )}
                    <button onClick={handleLogout} className="text-left text-red-500 py-2">Çıkış Yap</button>
                  </>
                ) : (
                  <>
                    <Link to="/giris" onClick={() => setMenuOpen(false)} className="text-stone-600 py-2">Giriş Yap</Link>
                    <Link to="/kayit" onClick={() => setMenuOpen(false)} className="bg-primary-500 text-white text-center py-2 rounded-full">Üye Ol</Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
