import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, CheckCircle, Leaf, ExternalLink } from 'lucide-react';
import { producerService } from '../services/producer.service';
import { productService } from '../services/product.service';
import ProductCard from '../components/home/ProductCard';

export default function ProducerDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: producer, isLoading: loadingProducer, isError } = useQuery({
    queryKey: ['producer', slug],
    queryFn: () => producerService.getProducer(slug!),
    enabled: !!slug,
  });

  const { data: productsData } = useQuery({
    queryKey: ['producerProducts', producer?._id],
    queryFn: () => productService.getProducts({ limit: 12 }),
    enabled: !!producer?._id,
  });

  if (loadingProducer) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-48 bg-stone-200 rounded-2xl" />
        <div className="h-8 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-2/3" />
      </div>
    );
  }

  if (isError || !producer) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-500 text-lg">Üretici bulunamadı.</p>
        <Link to="/ureticiler" className="mt-4 inline-block text-primary-600 font-medium">
          Tüm Üreticiler
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Cover */}
      {producer.coverImage && (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
          <img src={producer.coverImage} alt={producer.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary-100 flex-shrink-0">
          {producer.avatar ? (
            <img src={producer.avatar} alt={producer.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary-500" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-stone-800">{producer.name}</h1>
            {producer.isVerified && (
              <span className="flex items-center gap-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle className="w-3 h-3" />
                Doğrulanmış
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-500 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {producer.location.city}
              {producer.location.district && `, ${producer.location.district}`}
            </span>
            {producer.reviewCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {producer.rating.toFixed(1)} ({producer.reviewCount} değerlendirme)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Bio */}
        <div className="md:col-span-2 space-y-6">
          {producer.bio && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="font-semibold text-stone-800 mb-3">Hakkında</h2>
              <p className="text-stone-600 leading-relaxed">{producer.bio}</p>
            </div>
          )}
          {producer.story && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="font-semibold text-stone-800 mb-3">Hikayesi</h2>
              <p className="text-stone-600 leading-relaxed">{producer.story}</p>
            </div>
          )}
          {producer.farmImages?.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="font-semibold text-stone-800 mb-4">Çiftlik Görselleri</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {producer.farmImages.map((img, i) => (
                  <img key={i} src={img} alt={`Çiftlik ${i + 1}`} className="aspect-square object-cover rounded-xl" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Farm info */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <h3 className="font-semibold text-stone-800 mb-3">Çiftlik Bilgileri</h3>
            {producer.location.farmName && (
              <p className="text-sm text-stone-600 mb-1"><span className="font-medium">Ad:</span> {producer.location.farmName}</p>
            )}
            {producer.location.farmSizeHectares && (
              <p className="text-sm text-stone-600 mb-1"><span className="font-medium">Büyüklük:</span> {producer.location.farmSizeHectares} hektar</p>
            )}
            {producer.location.village && (
              <p className="text-sm text-stone-600"><span className="font-medium">Köy:</span> {producer.location.village}</p>
            )}
          </div>

          {/* Specializations */}
          {producer.specializations?.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-semibold text-stone-800 mb-3">Uzmanlık Alanları</h3>
              <div className="flex flex-wrap gap-2">
                {producer.specializations.map((s) => (
                  <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {producer.certificates?.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-semibold text-stone-800 mb-3">Sertifikalar</h3>
              <div className="space-y-2">
                {producer.certificates.map((cert) => (
                  <div key={cert._id} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-stone-700">{cert.name}</p>
                      <p className="text-xs text-stone-500">{cert.issuedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {producer.videoUrl && (
            <a
              href={producer.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4" />
              Video İzle
            </a>
          )}
        </div>
      </div>

      {/* Products */}
      {productsData?.products && productsData.products.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-stone-800 mb-5">{producer.name} Ürünleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productsData.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
