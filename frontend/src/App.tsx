import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AIDietitianPage from './pages/AIDietitianPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import ProducerDetailPage from './pages/ProducerDetailPage';
import { useAuthStore } from './store/authStore';
import { authService } from './services/auth.service';
import type { User } from './types';

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, setAuth, logout, token } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    authService.getMe()
      .then((user: User) => setAuth(user, token))
      .catch(() => logout());
  }, []);

  return (
    <Routes>
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/kayit" element={<RegisterPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<ProductsPage />} />
        <Route path="/urunler/:slug" element={<ProductDetailPage />} />
        <Route path="/ureticiler" element={<Navigate to="/urunler" replace />} />
        <Route path="/ureticiler/:slug" element={<ProducerDetailPage />} />
        <Route path="/diyetisyen" element={<ComingSoonPage title="AI Diyetisyen" />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/siparislerim" element={<OrdersPage />} />
        <Route path="/siparislerim/:id" element={<Navigate to="/siparislerim" replace />} />
        <Route path="/odeme" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminProductCreatePage />} />
        <Route path="/admin/urun-ekle" element={<AdminProductCreatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">{title}</h1>
      <p className="text-stone-500">Bu sayfa yakında aktif olacak.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Sayfa bulunamadı</h1>
      <p className="text-stone-500">Geçersiz bir adrese gittiniz.</p>
      <a href="/" className="mt-4 inline-block text-primary-600 font-medium">Ana Sayfaya Dön</a>
    </div>
  );
}


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
<<<<<<< HEAD
        <Routes>
          <Route path="/giris" element={<LoginPage />} />
          <Route path="/kayit" element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/urunler" element={<ProductsPage />} />
            <Route path="/urunler/:slug" element={<ProductDetailPage />} />
            <Route path="/admin" element={<AdminProductCreatePage />} />
            <Route path="/admin/urun-ekle" element={<AdminProductCreatePage />} />
            <Route path="/ureticiler" element={<ComingSoonPage title="Ureticiler" />} />
            <Route path="/diyetisyen" element={<AIDietitianPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
=======
        <AppRoutes />
>>>>>>> 02f3b533b0169472aab058898e59abc544f00a84
      </BrowserRouter>
    </QueryClientProvider>
  );
}
