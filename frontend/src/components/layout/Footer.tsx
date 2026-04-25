import { Link } from 'react-router-dom';
import { Leaf, Instagram, Youtube, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const links = {
  kesfet: [
    { to: '/urunler',           label: 'Tüm Ürünler' },
    { to: '/kampanyalar',       label: 'Kampanyalar' },
    { to: '/diyetisyen',        label: 'AI Diyetisyen' },
  ],
  hesap: [
    { to: '/profil',            label: 'Profilim' },
    { to: '/siparislerim',      label: 'Siparişlerim' },
    { to: '/kayit',             label: 'Üye Ol' },
    { to: '/giris',             label: 'Giriş Yap' },
  ],
};

const socials = [
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Youtube,   label: 'YouTube'   },
  { href: 'mailto:merhaba@tazekoy.com', icon: Mail, label: 'E-posta' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden mt-20" style={{ background: '#070f09' }}>
      {/* grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-earth-700/15 blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* top grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* brand — spans 5 cols */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-wide">TAZEKÖY</span>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Tohumdan hasada şeffaflık, topraktan sofraya sağlık. İlaçsız, doğal ve dürüst tarımın en yalın hali.
            </p>

            {/* badge row */}
            <div className="flex flex-wrap gap-2 mb-7">
              {['🌿 Organik Sertifikalı', '🚜 Çiftçiden Direkt', '♻️ Sürdürülebilir'].map(b => (
                <span key={b} className="text-[11px] font-medium text-primary-300 bg-primary-900/60 border border-primary-700/40 px-3 py-1 rounded-full">
                  {b}
                </span>
              ))}
            </div>

            {/* socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href}
                  className="group w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary-500/20 hover:border-primary-500/40 transition-all duration-200">
                  <Icon className="w-4 h-4 text-white/50 group-hover:text-primary-300 transition-colors" />
                </a>
              ))}
              <a href="#" className="ml-1 flex items-center gap-1.5 text-xs text-white/30 hover:text-primary-300 transition-colors">
                <MapPin className="w-3.5 h-3.5" /> Türkiye
              </a>
            </div>
          </div>

          {/* keşfet */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-5">Keşfet</p>
            <ul className="space-y-3">
              {links.kesfet.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="group flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors duration-200">
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-0.5 transition-opacity text-primary-400" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* hesabım */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-5">Hesabım</p>
            <ul className="space-y-3">
              {links.hesap.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="group flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors duration-200">
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-0.5 transition-opacity text-primary-400" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* newsletter */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-5">Bülten</p>
            <p className="text-xs text-white/35 leading-relaxed mb-4">
              Kampanyalardan ve yeni ürünlerden haberdar olun.
            </p>
            <a href="mailto:merhaba@tazekoy.com"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary-300 border border-primary-700/50 bg-primary-900/40 hover:bg-primary-800/60 px-4 py-2.5 rounded-xl transition-all duration-200">
              <Mail className="w-3.5 h-3.5" /> Abone Ol
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
          <p>© 2025 TAZEKÖY. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2">
            <span>Topraktan Sofraya</span>
            <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
            <span>İlaçsız Tarım</span>
            <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
            <span>Organik & Sağlıklı</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
