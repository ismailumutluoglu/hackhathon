import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ayşe Kaya',
    city: 'İstanbul',
    initials: 'AK',
    color: 'from-rose-400 to-pink-500',
    rating: 5,
    product: 'Sızma Zeytinyağı',
    comment: 'Ayvalık\'tan gelen zeytinyağısının farkı ilk damlada anlaşılıyor. Kokusu, rengi, tadı ile piyasadakilerle kıyaslanamaz. Artık başka yerden almıyorum.',
    date: '2 hafta önce',
  },
  {
    name: 'Mehmet Arslan',
    city: 'Ankara',
    initials: 'MA',
    color: 'from-blue-400 to-indigo-500',
    rating: 5,
    product: 'Köy Yoğurdu',
    comment: 'Karadeniz\'den gelen yoğurt tam istediğim gibiydi. Kaymağı bol, ekşiliği yerinde. Çocuklarım bayıldı, artık haftalık sipariş veriyoruz.',
    date: '1 ay önce',
  },
  {
    name: 'Fatma Demir',
    city: 'İzmir',
    initials: 'FD',
    color: 'from-emerald-400 to-teal-500',
    rating: 5,
    product: 'Organik Domates',
    comment: 'Gerçek bir domates nasıl olmalı dedim, bu tam olarak öyle. Yarım kilo ketçap yapacak kadar sulu ve aromalı. Tazeköy\'e minnettarım.',
    date: '3 hafta önce',
  },
  {
    name: 'Ali Yıldız',
    city: 'Bursa',
    initials: 'AY',
    color: 'from-amber-400 to-orange-500',
    rating: 4,
    product: 'Çam Balı',
    comment: 'Muğla çam balı gerçekten harika. Kışın çocuğumun boğaz ağrısında mucize gibi etki etti. Biraz pahalı ama kalitesi için değer.',
    date: '1 ay önce',
  },
  {
    name: 'Zeynep Şahin',
    city: 'Trabzon',
    initials: 'ZŞ',
    color: 'from-violet-400 to-purple-500',
    rating: 5,
    product: 'Antep Fıstığı',
    comment: 'Antep fıstıklarını aldım, içleri o kadar dolgun ki şaşırdım. Ailem hepsini bir haftada bitirdi. Kargo da çok hızlı geldi.',
    date: '2 ay önce',
  },
  {
    name: 'Hasan Öztürk',
    city: 'Gaziantep',
    initials: 'HÖ',
    color: 'from-cyan-400 to-blue-500',
    rating: 5,
    product: 'AI Diyetisyen',
    comment: 'AI diyetisyen özelliği beni çok etkiledi. Diyabetim için uygun ürünleri tek tıkla buldum. Sağlık profilime göre önerilen ürünleri aldım ve çok memnunum.',
    date: '3 hafta önce',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#f7f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-600 bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            ⭐ Müşteri Yorumları
          </span>
          <h2 className="font-display text-4xl font-bold text-stone-800 mb-3">Onlar Ne Diyor?</h2>
          <p className="text-stone-500 text-base max-w-md mx-auto">
            50.000+ mutlu müşterimizden gerçek yorumlar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">

              {/* Quote icon */}
              <Quote className="w-6 h-6 text-primary-200 flex-shrink-0" />

              {/* Comment */}
              <p className="text-stone-600 text-sm leading-relaxed flex-1">"{r.comment}"</p>

              {/* Product badge */}
              <span className="inline-flex self-start text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
                🛍️ {r.product}
              </span>

              {/* Divider */}
              <div className="border-t border-stone-50" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <span className="text-white text-xs font-black">{r.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-stone-800 text-sm">{r.name}</p>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-xs text-stone-400">{r.city} · {r.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-10 bg-white border border-stone-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-black text-amber-500">4.8</span>
            </div>
            <div>
              <Stars rating={5} />
              <p className="text-xs text-stone-400 mt-1">12.400+ değerlendirme</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            {[
              { pct: '96%', label: 'Memnuniyet' },
              { pct: '98%', label: 'Tekrar Alım' },
              { pct: '4.9', label: 'Kargo Puanı' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-primary-600">{s.pct}</p>
                <p className="text-xs text-stone-400">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
