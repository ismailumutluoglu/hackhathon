import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, RotateCcw, Copy, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const SEGMENTS = [
  { label: '%5 İndirim',    code: 'TAZE5',    color: '#16a34a', text: '#fff' },
  { label: 'Bedava Kargo',  code: 'KARGO0',   color: '#2563eb', text: '#fff' },
  { label: '%10 İndirim',   code: 'TAZE10',   color: '#d97706', text: '#fff' },
  { label: 'Tekrar Dene',   code: null,        color: '#94a3b8', text: '#fff' },
  { label: '%15 İndirim',   code: 'TAZE15',   color: '#dc2626', text: '#fff' },
  { label: '%20 İndirim',   code: 'TAZE20',   color: '#7c3aed', text: '#fff' },
  { label: 'Ücretsiz Ürün', code: 'UCRETSIZ', color: '#b45309', text: '#fff' },
  { label: '%25 İndirim',   code: 'TAZE25',   color: '#059669', text: '#fff' },
];

const SEG_ANGLE = (Math.PI * 2) / SEGMENTS.length;

function buildWheelTexture(): THREE.CanvasTexture {
  const size = 1024;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  const c = size / 2;
  const r = c - 8;

  SEGMENTS.forEach((seg, i) => {
    const s = i * SEG_ANGLE - Math.PI / 2;
    const e = s + SEG_ANGLE;

    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, s, e);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(s + SEG_ANGLE / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = seg.text;
    ctx.font = `bold ${size * 0.038}px Inter,system-ui,sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.fillText(seg.label, r - 24, 11);
    ctx.restore();
  });

  // outer ring
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 10;
  ctx.stroke();

  // center cap
  ctx.beginPath();
  ctx.arc(c, c, 58, 0, Math.PI * 2);
  ctx.fillStyle = '#14321a';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(c, c, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#4ade80';
  ctx.fill();

  return new THREE.CanvasTexture(cv);
}

export default function SpinWheelSection() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const wheelRef  = useRef<THREE.Mesh | null>(null);
  const rafRef    = useRef<number>(0);
  const speedRef  = useRef(0);
  const angleRef  = useRef(0);
  const spinning  = useRef(false);

  const [result,   setResult]   = useState<typeof SEGMENTS[0] | null>(null);
  const [spun,     setSpun]     = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // Scene
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Wheel mesh
    const geo      = new THREE.CircleGeometry(1, 128);
    const mat      = new THREE.MeshBasicMaterial({ map: buildWheelTexture(), side: THREE.DoubleSide });
    const wheel    = new THREE.Mesh(geo, mat);
    scene.add(wheel);
    wheelRef.current = wheel;

    // Edge ring (gives 3-D feel)
    const edgeGeo  = new THREE.TorusGeometry(1, 0.04, 16, 128);
    const edgeMat  = new THREE.MeshBasicMaterial({ color: 0xffffff });
    scene.add(new THREE.Mesh(edgeGeo, edgeMat));

    // Animate loop
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (spinning.current) {
        angleRef.current += speedRef.current;
        speedRef.current *= 0.987;
        wheel.rotation.z = angleRef.current;

        if (speedRef.current < 0.003) {
          spinning.current = false;
          setIsSpinning(false);

          const norm = ((angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          // needle is at top (π/2), so winning segment index:
          const rawIdx = Math.floor(((Math.PI / 2 - norm + Math.PI * 2) % (Math.PI * 2)) / SEG_ANGLE);
          const idx = ((SEGMENTS.length - rawIdx) % SEGMENTS.length + SEGMENTS.length) % SEGMENTS.length;
          setResult(SEGMENTS[idx] ?? SEGMENTS[0]);
          setSpun(true);
        }
      }
      renderer.render(scene, camera);
    };
    loop();

    const observer = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    observer.observe(el);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  const spin = useCallback(() => {
    if (spinning.current || spun) return;
    spinning.current = true;
    setIsSpinning(true);
    setResult(null);
    speedRef.current = 0.28 + Math.random() * 0.14;
  }, [spun]);

  const reset = () => { setSpun(false); setResult(null); setCopied(false); };

  const copy = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#f7f5f0] to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-600 bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full mb-4">
            <Gift className="w-3.5 h-3.5" /> Şans Çarkı
          </span>
          <h2 className="font-display text-4xl font-bold text-stone-800 mb-3">Çevir, Kazan!</h2>
          <p className="text-stone-500 text-base max-w-md mx-auto">
            Şans çarkını çevir, özel indirim kodunu kap. Tek çevirme hakkın var, iyi şanslar!
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">

          {/* Wheel canvas */}
          <div className="relative flex-shrink-0">
            {/* needle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[32px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
            </div>

            <div ref={mountRef}
              className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] cursor-pointer"
              onClick={!spun ? spin : undefined} />

            {/* glow ring behind */}
            <div className="absolute inset-4 rounded-full bg-primary-400/10 blur-2xl -z-10 animate-pulse" />
          </div>

          {/* Right panel */}
          <div className="flex flex-col items-center lg:items-start gap-6 max-w-sm w-full">

            {!isAuthenticated ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-sm w-full">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-bold text-stone-800 mb-2">Giriş Yapman Gerekiyor</h3>
                <p className="text-stone-500 text-sm mb-5">Şans çarkını çevirmek için üye olmalısın.</p>
                <Link to="/kayit"
                  className="inline-block bg-primary-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-600 transition-colors text-sm">
                  Ücretsiz Üye Ol
                </Link>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {!spun ? (
                  <motion.div key="spin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="bg-white border border-stone-100 rounded-3xl p-8 shadow-sm w-full text-center">
                    <div className="text-5xl mb-4">🎡</div>
                    <h3 className="font-display text-xl font-bold text-stone-800 mb-2">Şansını Dene!</h3>
                    <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                      %25'e kadar indirim, ücretsiz kargo veya bedava ürün kazanabilirsin.
                    </p>
                    <motion.button onClick={spin} disabled={isSpinning}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 disabled:opacity-60 text-sm">
                      {isSpinning ? (
                        <span className="flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4 animate-spin" /> Çark dönüyor...
                        </span>
                      ) : '🎯 Çarkı Çevir!'}
                    </motion.button>
                    <p className="text-xs text-stone-400 mt-3">Çarka tıklayarak da çevirebilirsin</p>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-stone-100 rounded-3xl p-8 shadow-lg w-full text-center">
                    {result?.code ? (
                      <>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="text-5xl mb-4">🎉</motion.div>
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Kazandın!</p>
                        <h3 className="font-display text-2xl font-bold text-stone-800 mb-4">{result.label}</h3>
                        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 mb-5">
                          <span className="font-mono font-bold text-primary-700 text-lg flex-1">{result.code}</span>
                          <button onClick={copy}
                            className="text-stone-400 hover:text-primary-600 transition-colors">
                            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-stone-400 mb-5">Bu kodu ödeme sayfasında kullan</p>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl mb-4">😅</div>
                        <h3 className="font-display text-xl font-bold text-stone-800 mb-2">Şansın Yaver Gitmedi</h3>
                        <p className="text-stone-500 text-sm mb-5">Bir dahaki sefere daha şanslı olacaksın!</p>
                      </>
                    )}
                    <button onClick={reset}
                      className="text-sm text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1.5 mx-auto">
                      <RotateCcw className="w-3.5 h-3.5" /> Tekrar bakmak için
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Segment legend */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {SEGMENTS.filter(s => s.code).map(s => (
                <div key={s.code} className="flex items-center gap-2 text-xs text-stone-600">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
