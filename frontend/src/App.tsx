import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';

const queryClient = new QueryClient();

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">{title}</h1>
      <p className="text-stone-500">Bu sayfa yakinda aktif olacak.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">Sayfa bulunamadi</h1>
      <p className="text-stone-500">Gecersiz bir adrese gittiniz, ana sayfaya yonlendiriliyorsunuz.</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
            <Route path="/diyetisyen" element={<ComingSoonPage title="AI Diyetisyen" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
