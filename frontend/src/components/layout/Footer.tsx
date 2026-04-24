import { Link } from 'react-router-dom';
import { Leaf, Camera, Play, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl">TAZEKÖY</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed max-w-xs">
              Tohumdan hasada şeffaflık, topraktan sofraya sağlık. İlaçsız, doğal ve dürüst 
              tarımın en yalın hali.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Play className="w-4 h-4" />
              </a>
              <a href="mailto:merhaba@tazekoy.com" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-300 mb-4">Keşfet</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/urunler" className="hover:text-white transition-colors">Tüm Ürünler</Link></li>
              
              <li><Link to="/diyetisyen" className="hover:text-white transition-colors">AI Diyetisyen</Link></li>
              <li><Link to="/urunler?isCampaign=true" className="hover:text-white transition-colors">Kampanyalar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-300 mb-4">Hesabım</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/profil" className="hover:text-white transition-colors">Profilim</Link></li>
              <li><Link to="/siparislerim" className="hover:text-white transition-colors">Siparişlerim</Link></li>
              <li><Link to="/kayit" className="hover:text-white transition-colors">Üye Ol</Link></li>
              <li><Link to="/giris" className="hover:text-white transition-colors">Giriş Yap</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-400">
          <p>© 2025 TAZEKÖY. Tüm hakları saklıdır.</p>
          <p>Topraktan Sofraya — İlaçsız Tarım. Organik. Sağlıklı.</p>
        </div>
      </div>
    </footer>
  );
}
