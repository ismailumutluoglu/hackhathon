import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Loader2, Info, AlertTriangle, Sparkles, HeartPulse, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { aiService } from '../services/ai.service';
import ProductCard from '../components/home/ProductCard';

export default function AIDietitianPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [query, setQuery] = useState('');

  const {
    mutate: fetchRecommendations,
    data: result,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (q: string) => aiService.getRecommendations(q),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations(query);
  };

  // Güvenlik: Kullanıcı giriş yapmamışsa uyar / engelle
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Bot className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold text-stone-800 mb-3">AI Diyetisyen</h1>
        <p className="text-stone-500 mb-6 max-w-xl mx-auto">
          Yapay zeka asistanımızın sağlığınıza özel organik ürün tavsiyeleri sunabilmesi için öncelikle sisteme giriş yapmalısınız.
        </p>
        <Link
          to="/giris"
          className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Giriş Yap ve Tavsiye Al
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
          Yapay Zeka Diyetisyeni
        </h1>
        <p className="text-lg text-stone-600">
          Size ve {user?.healthProfile ? 'mevcut sağlık profilinize' : 'ihtiyaçlarınıza'} en uygun doğal ürünleri anında analiz edip listeliyoruz.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <label htmlFor="query" className="block text-sm font-medium text-stone-700 mb-2">
            Sorun nedir veya nasıl hissediyorsunuz? (Opsiyonel)
          </label>
          <textarea
            id="query"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none mb-4"
            placeholder="Örn: Son günlerde çok halsiz hissediyorum ve karnım şişkin. Süt alerjim var."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Özel Tavsiyemi Al
              </>
            )}
          </button>
        </form>

        {isError && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start">
            <AlertTriangle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Bir hata oluştu</h4>
              <p className="text-sm">Tavsiyeler alınamadı. {error instanceof Error ? error.message : 'Lütfen tekrar deneyin.'}</p>
            </div>
          </div>
        )}
      </div>

      {isPending && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="flex flex-col items-center justify-center py-12"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <HeartPulse className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-emerald-700 font-medium animate-pulse">
            Sağlık profiliniz ve ürünler taranıyor...
          </p>
        </motion.div>
      )}

      {result && !isPending && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Özet ve Tavsiye Kutuları */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center text-emerald-800 mb-3">
                <Info className="w-5 h-5 mr-2" />
                <h3 className="font-semibold text-lg">Genel Değerlendirme</h3>
              </div>
              <p className="text-emerald-700 leading-relaxed">{result.response.summary}</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center text-blue-800 mb-3">
                <HeartPulse className="w-5 h-5 mr-2" />
                <h3 className="font-semibold text-lg">Beslenme Tavsiyesi</h3>
              </div>
              <p className="text-blue-700 leading-relaxed">{result.response.dietaryAdvice}</p>
            </div>
          </div>

          {/* Kaçınılacak Listesi (Varsa) */}
          {result.response.avoidList && result.response.avoidList.length > 0 && (
             <div className="bg-rose-50 rounded-2xl p-6 border border-rose-200">
                <div className="flex items-center text-rose-800 mb-4">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  <h3 className="font-semibold text-xl">Uzak Durmanız Gerekenler</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {result.response.avoidList.map((avoidItem, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                      <h4 className="font-medium text-stone-800 mb-2">{avoidItem.product.name}</h4>
                      <p className="text-sm text-rose-600">{avoidItem.reason}</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {/* Önerilen Ürünler Listesi */}
          {result.response.recommendations && result.response.recommendations.length > 0 && (
             <div>
                <h2 className="font-display text-3xl font-bold text-stone-800 mb-8 border-b pb-4">
                  Size Özel Hazırlanan Sepet
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {result.response.recommendations.map((rec) => (
                    <div key={rec._id} className="flex flex-col flex-1 h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                      {/* Ürünün Kendisi */}
                      <ProductCard product={rec.product} />
                      
                      {/* Yapay Zeka Neden Önerdi Kutucuğu */}
                      <div className="p-4 bg-emerald-50 mt-auto border-t border-emerald-100 flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                             Neden Önerildi?
                           </span>
                           <span className="text-xs font-bold px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full">
                             SKOR: {rec.benefitScore}/10
                           </span>
                        </div>
                        <p className="text-sm text-emerald-800 leading-snug">
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </motion.div>
      )}
    </div>
  );
}