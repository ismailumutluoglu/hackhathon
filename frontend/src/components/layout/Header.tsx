import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Leaf, LayoutDashboard, LogOut, Package, ChevronDown, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

const NAV_LINKS = [
  { to: '/urunler',    label: 'Ürünler',      icon: Package },
  { to: '/kampanyalar', label: 'Kampanyalar',  icon: Zap, hot: true },
  { to: '/diyetisyen', label: 'AI Diyetisyen', icon: null },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount, toggleDrawer } = useCartStore();
  const { isMenuOpen, toggleMenu, setMenuOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = getItemCount();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'producer';

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  }

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── Logo ── */}
            <Link to="/" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 shadow-md shadow-primary-200 group-hover:shadow-lg group-hover:shadow-primary-300 transition-shadow" />
                <Leaf className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow" />
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-lg text-stone-800 tracking-wide block">TAZEKÖY</span>
                <span className="text-[9px] font-semibold text-primary-500 uppercase tracking-[0.15em] hidden sm:block">Topraktan Sofraya</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}>
                  {link.hot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div layoutId="nav-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2">

              {/* Cart */}
              <button onClick={toggleDrawer}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-stone-600 hover:text-primary-600 hover:bg-primary-50 transition-all">
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span key="badge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow">
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Desktop user area */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2 relative">
                  {isAdmin && (
                    <Link to="/admin/dashboard"
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors">
                      <LayoutDashboard className="w-3.5 h-3.5" /> Panel
                    </Link>
                  )}

                  {/* User dropdown */}
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(v => !v)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-xs font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-stone-700 max-w-[80px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-stone-100 shadow-xl z-20 overflow-hidden py-1">
                            <div className="px-4 py-2.5 border-b border-stone-50">
                              <p className="text-xs font-bold text-stone-800 truncate">{user?.name}</p>
                              <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
                            </div>
                            <Link to="/profil" onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                              <User className="w-4 h-4" /> Profilim
                            </Link>
                            {!isAdmin && (
                              <Link to="/siparislerim" onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                                <Package className="w-4 h-4" /> Siparişlerim
                              </Link>
                            )}
                            <div className="border-t border-stone-50 mt-1">
                              <button onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut className="w-4 h-4" /> Çıkış Yap
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/giris"
                    className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl hover:bg-stone-50 transition-all">
                    Giriş Yap
                  </Link>
                  <Link to="/kayit"
                    className="text-sm font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-sm hover:shadow-md shadow-primary-100 transition-all">
                    Üye Ol
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={toggleMenu}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-100 shadow-lg overflow-hidden">
            <div className="px-4 py-4 space-y-1">

              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}>
                  {link.hot && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-stone-100 pt-3 mt-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800">{user?.name}</p>
                        <p className="text-xs text-stone-400">{user?.email}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Yönetim Paneli
                      </Link>
                    )}
                    <Link to="/profil" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                      <User className="w-4 h-4" /> Profilim
                    </Link>
                    {!isAdmin && (
                      <Link to="/siparislerim" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                        <Package className="w-4 h-4" /> Siparişlerim
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/giris" onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                      Giriş Yap
                    </Link>
                    <Link to="/kayit" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-colors">
                      Üye Ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
