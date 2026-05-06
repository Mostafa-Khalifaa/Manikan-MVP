import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TrendingDown, Ruler, CalendarCheck, Shirt,
  BarChart3, ShieldCheck, Zap, Users, Star, ChevronRight,
  Package, RefreshCw, Frown, Sparkles, CheckCircle,
  LayoutGrid,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// ─── Intersection Observer Hook ────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated Counter ───────────────────────────────────────────────────────
function Counter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Section Wrapper with animation ────────────────────────────────────────
function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Decorative ornament ────────────────────────────────────────────────────
function Ornament({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-gold-400" />
      <span className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">{label}</span>
      <div className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-gold-400" />
    </div>
  );
}

// ─── Old Way Interactive Demo ───────────────────────────────────────────────
const VARIANTS = [
  { name: 'White', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop' },
  { name: 'Black', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=80&h=80&fit=crop' },
  { name: 'Tan', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop' },
  { name: 'Navy', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&h=80&fit=crop' },
  { name: 'Pink', img: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=80&h=80&fit=crop' },
];
const SIZES = ['38', '40', '42', '44', '46', '48', '50'];

function OldWayColorSizeDemo() {
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0]);
  const [selectedSize, setSelectedSize] = useState('42');

  return (
    <div>
      {/* Color / variant selector with thumbnails */}
      <p className="text-xs text-gray-500 mb-2">
        Color: <span className="font-semibold text-forest-900">{selectedVariant.name}</span>
      </p>
      <div className="flex gap-2 mb-5">
        {VARIANTS.map((v) => (
          <button
            key={v.name}
            onClick={() => setSelectedVariant(v)}
            className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all duration-200 hover:scale-105 ${selectedVariant.name === v.name
              ? 'border-forest-600 ring-2 ring-forest-200 scale-105'
              : 'border-gray-200 hover:border-gray-300'
              }`}
            title={v.name}
          >
            <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Size selector */}
      <p className="text-xs text-gray-500 mb-2">
        Size: <span className="font-semibold text-forest-900">{selectedSize}</span>
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSize(s)}
            className={`px-3.5 py-2 rounded-lg text-sm border transition-all duration-200 ${selectedSize === s
              ? 'border-forest-600 bg-forest-50 text-forest-800 font-bold shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Size chart link — clunky style */}
      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 border border-gray-300 rounded-md px-2.5 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors mb-5">
        <LayoutGrid size={13} className="text-gray-400" />
        <span className="underline underline-offset-2">View Size Chart</span>
        <ChevronRight size={12} className="text-gray-400" />
      </div>

      {/* Confused shopper hint */}
      <div className="bg-gold-50/60 rounded-xl p-3.5 border border-gold-200/50 mb-5">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="text-gold-600 font-semibold">🤔 "Is 42 a Medium here?"</span>
          {' '}— Every brand sizes differently. Shoppers are left guessing.
        </p>
      </div>

      {/* Add to Cart button */}
      <button className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
        Add to Cart
      </button>
    </div>
  );
}

// ─── Body Demo Presets ──────────────────────────────────────────────────────
const BODY_PRESETS = [
  { labelKey: 'demo_preset_athletic',   height: 178, weight: 82, chest: 102, waist: 80, hips: 96 },
  { labelKey: 'demo_preset_slim',         height: 170, weight: 60, chest: 86,  waist: 70, hips: 88 },
  { labelKey: 'demo_preset_curvy',            height: 165, weight: 78, chest: 100, waist: 82, hips: 108 },
  { labelKey: 'demo_preset_tall',      height: 188, weight: 75, chest: 94,  waist: 76, hips: 92 },
];

const PARAM_RANGES = {
  height: { min: 150, max: 200 },
  weight: { min: 45, max: 120 },
  chest:  { min: 70, max: 130 },
  waist:  { min: 55, max: 110 },
  hips:   { min: 70, max: 130 },
};

function lerp(a, b, t) { return a + (b - a) * t; }

// ─── Animated Body SVG Silhouette ───────────────────────────────────────────
function BodySilhouette({ params }) {
  // Map measurements to visual proportions for the silhouette
  const norm = (val, key) => {
    const r = PARAM_RANGES[key];
    return (val - r.min) / (r.max - r.min);
  };

  const heightScale = 0.85 + norm(params.height, 'height') * 0.3;
  const shoulderW = 34 + norm(params.chest, 'chest') * 22;
  const chestW = 30 + norm(params.chest, 'chest') * 20;
  const waistW = 22 + norm(params.waist, 'waist') * 18;
  const hipW = 28 + norm(params.hips, 'hips') * 22;
  const legGap = 2 + norm(params.weight, 'weight') * 4;

  const cx = 90;
  const headR = 11;
  const headY = 30;
  const neckY = headY + headR + 4;
  const shoulderY = neckY + 8;
  const chestY = shoulderY + 28 * heightScale;
  const waistY = chestY + 22 * heightScale;
  const hipY = waistY + 16 * heightScale;
  const kneeY = hipY + 38 * heightScale;
  const footY = kneeY + 34 * heightScale;

  // Build the body path (right side, then mirror)
  const bodyPath = `
    M ${cx} ${neckY}
    C ${cx} ${neckY + 2}, ${cx + shoulderW * 0.5} ${shoulderY - 2}, ${cx + shoulderW * 0.5} ${shoulderY}
    L ${cx + shoulderW * 0.48} ${shoulderY + 4}
    C ${cx + shoulderW * 0.48} ${shoulderY + 10}, ${cx + chestW * 0.5} ${chestY - 6}, ${cx + chestW * 0.5} ${chestY}
    C ${cx + chestW * 0.5} ${chestY + 4}, ${cx + waistW * 0.5} ${waistY - 4}, ${cx + waistW * 0.5} ${waistY}
    C ${cx + waistW * 0.5} ${waistY + 4}, ${cx + hipW * 0.5} ${hipY - 4}, ${cx + hipW * 0.5} ${hipY}
    L ${cx + legGap + 8} ${kneeY}
    L ${cx + legGap + 6} ${footY}
    L ${cx + legGap - 1} ${footY}
    L ${cx + legGap + 1} ${kneeY}
    L ${cx + 1} ${hipY + 8}
    L ${cx - 1} ${hipY + 8}
    L ${cx - legGap - 1} ${kneeY}
    L ${cx - legGap + 1} ${footY}
    L ${cx - legGap - 6} ${footY}
    L ${cx - legGap - 8} ${kneeY}
    L ${cx - hipW * 0.5} ${hipY}
    C ${cx - hipW * 0.5} ${hipY - 4}, ${cx - waistW * 0.5} ${waistY + 4}, ${cx - waistW * 0.5} ${waistY}
    C ${cx - waistW * 0.5} ${waistY - 4}, ${cx - chestW * 0.5} ${chestY + 4}, ${cx - chestW * 0.5} ${chestY}
    C ${cx - chestW * 0.5} ${chestY - 6}, ${cx - shoulderW * 0.48} ${shoulderY + 10}, ${cx - shoulderW * 0.48} ${shoulderY + 4}
    L ${cx - shoulderW * 0.5} ${shoulderY}
    C ${cx - shoulderW * 0.5} ${shoulderY - 2}, ${cx} ${neckY + 2}, ${cx} ${neckY}
    Z
  `;

  // Arm paths
  const armR = `M ${cx + shoulderW * 0.5} ${shoulderY + 2}
    C ${cx + shoulderW * 0.5 + 6} ${shoulderY + 8}, ${cx + shoulderW * 0.5 + 10} ${chestY}, ${cx + shoulderW * 0.5 + 8} ${chestY + 18 * heightScale}
    L ${cx + shoulderW * 0.5 + 4} ${chestY + 18 * heightScale}
    C ${cx + shoulderW * 0.5 + 4} ${chestY}, ${cx + shoulderW * 0.5 + 2} ${shoulderY + 14}, ${cx + shoulderW * 0.44} ${shoulderY + 6}
    Z`;
  const armL = `M ${cx - shoulderW * 0.5} ${shoulderY + 2}
    C ${cx - shoulderW * 0.5 - 6} ${shoulderY + 8}, ${cx - shoulderW * 0.5 - 10} ${chestY}, ${cx - shoulderW * 0.5 - 8} ${chestY + 18 * heightScale}
    L ${cx - shoulderW * 0.5 - 4} ${chestY + 18 * heightScale}
    C ${cx - shoulderW * 0.5 - 4} ${chestY}, ${cx - shoulderW * 0.5 - 2} ${shoulderY + 14}, ${cx - shoulderW * 0.44} ${shoulderY + 6}
    Z`;

  return (
    <svg viewBox="0 0 180 280" style={{ width: '100%', maxWidth: '220px', height: 'auto' }}>
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="bodyStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="bodyGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines for tech look */}
      {[60, 90, 120, 150, 180, 210, 240].map(y => (
        <line key={y} x1="10" y1={y} x2="170" y2={y} stroke="rgba(129,140,248,0.06)" strokeWidth="0.5" />
      ))}
      {[40, 60, 80, 100, 120, 140].map(x => (
        <line key={x} x1={x} y1="20" x2={x} y2="270" stroke="rgba(129,140,248,0.06)" strokeWidth="0.5" />
      ))}

      {/* Body */}
      <g filter="url(#bodyGlow)" style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <path d={bodyPath} fill="url(#bodyGrad)" stroke="url(#bodyStroke)" strokeWidth="1.2" />
        <path d={armR} fill="url(#bodyGrad)" stroke="url(#bodyStroke)" strokeWidth="1" />
        <path d={armL} fill="url(#bodyGrad)" stroke="url(#bodyStroke)" strokeWidth="1" />
        <circle cx={cx} cy={headY} r={headR} fill="url(#bodyGrad)" stroke="url(#bodyStroke)" strokeWidth="1.2" />
      </g>

      {/* Measurement indicators */}
      <g opacity="0.5" style={{ transition: 'all 0.8s ease' }}>
        {/* Chest line */}
        <line x1={cx - chestW * 0.5 - 14} y1={chestY} x2={cx + chestW * 0.5 + 14} y2={chestY} stroke="#818cf8" strokeWidth="0.5" strokeDasharray="3 2" />
        {/* Waist line */}
        <line x1={cx - waistW * 0.5 - 10} y1={waistY} x2={cx + waistW * 0.5 + 10} y2={waistY} stroke="#818cf8" strokeWidth="0.5" strokeDasharray="3 2" />
        {/* Hip line */}
        <line x1={cx - hipW * 0.5 - 12} y1={hipY} x2={cx + hipW * 0.5 + 12} y2={hipY} stroke="#818cf8" strokeWidth="0.5" strokeDasharray="3 2" />
      </g>
    </svg>
  );
}

// ─── Animated Body Demo Section ─────────────────────────────────────────────
function BodyDemoSection() {
  const { t } = useLanguage();
  const [params, setParams] = useState({ ...BODY_PRESETS[0] });
  const [presetIndex, setPresetIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let frameId;
    let startTime;
    const HOLD_MS = 2200;
    const TRANSITION_MS = 1200;
    const CYCLE_MS = HOLD_MS + TRANSITION_MS;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % (CYCLE_MS * BODY_PRESETS.length);
      const currentCycle = Math.floor(elapsed / CYCLE_MS);
      const cycleElapsed = elapsed - currentCycle * CYCLE_MS;

      const from = BODY_PRESETS[currentCycle % BODY_PRESETS.length];
      const to = BODY_PRESETS[(currentCycle + 1) % BODY_PRESETS.length];

      if (cycleElapsed < HOLD_MS) {
        // Holding at current preset
        setParams({ ...from });
        setPresetIndex(currentCycle % BODY_PRESETS.length);
        setTransitioning(false);
      } else {
        // Transitioning to next preset
        const t = Math.min((cycleElapsed - HOLD_MS) / TRANSITION_MS, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
        setParams({
          labelKey: to.labelKey,
          height: Math.round(lerp(from.height, to.height, eased)),
          weight: Math.round(lerp(from.weight, to.weight, eased)),
          chest:  Math.round(lerp(from.chest,  to.chest,  eased)),
          waist:  Math.round(lerp(from.waist,  to.waist,  eased)),
          hips:   Math.round(lerp(from.hips,   to.hips,   eased)),
        });
        setTransitioning(true);
        if (t > 0.5) setPresetIndex((currentCycle + 1) % BODY_PRESETS.length);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const paramKeys = ['height', 'weight', 'chest', 'waist', 'hips'];
  const units = [t('demo_cm'), t('demo_kg'), t('demo_cm'), t('demo_cm'), t('demo_cm')];

  const sliderPercent = (key) => {
    const r = PARAM_RANGES[key];
    return ((params[key] - r.min) / (r.max - r.min)) * 100;
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="relative bg-forest-900 rounded-3xl overflow-hidden">
            {/* bg glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold-400/8 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">

              {/* Left: text content */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-7 w-fit">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-accent-bright tracking-wider uppercase">{t('demo_badge')}</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-display text-white leading-tight mb-5">
                  {t('demo_title_1')}<br />
                  <span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('demo_title_2')}</span><br />
                  {t('demo_title_3')}
                </h2>

                <p className="text-forest-300 text-sm leading-relaxed mb-8 max-w-md">
                  {t('demo_desc')}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/store"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg group"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                    {t('demo_shop')}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/engine"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-forest-200 text-sm font-medium rounded-xl hover:border-white/30 hover:text-white transition-all"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('demo_engine')}
                  </Link>
                </div>

                {/* Mini specs */}
                <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
                  {[
                    { val: t('demo_smpl'), label: t('demo_body_model') },
                    { val: t('demo_3d'), label: t('demo_real_avatar') },
                    { val: t('demo_ai'), label: t('demo_fit_pred') },
                  ].map((s, idx) => (
                    <div key={idx}>
                      <p className="text-2xl font-display text-accent-bright">{s.val}</p>
                      <p className="text-xs text-forest-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: ANIMATED engine UI preview */}
              <div className="relative hidden lg:block rounded-r-3xl overflow-hidden" style={{ minHeight: '480px', background: 'var(--color-manikan-bg)' }}>
                <div className="absolute inset-0 flex">

                  {/* Sidebar — animated sliders */}
                  <div style={{ width: '190px', borderRight: '1px solid var(--color-manikan-border)', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--color-manikan-card)' }}>
                    {/* Preset label */}
                    <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#818cf8', fontWeight: 700 }}>
                        {t(BODY_PRESETS[presetIndex].labelKey)}
                      </span>
                    </div>

                    {paramKeys.map((key, i) => (
                      <div key={key} style={{ marginBottom: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ color: 'var(--color-forest-500)', fontSize: '10px', textTransform: 'capitalize' }}>{t(`demo_${key}`)}</span>
                          <span style={{
                            color: 'var(--color-forest-800)',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontVariantNumeric: 'tabular-nums',
                            minWidth: '42px',
                            textAlign: 'right',
                            transition: 'color 0.3s',
                            ...(transitioning ? { color: '#818cf8' } : {}),
                          }}>
                            {params[key]} {units[i]}
                          </span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--color-forest-50)', borderRadius: '999px', position: 'relative', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${sliderPercent(key)}%`,
                            background: transitioning
                              ? 'linear-gradient(90deg, #818cf8, #a78bfa)'
                              : 'var(--color-forest-500)',
                            borderRadius: '999px',
                            transition: 'width 0.15s linear, background 0.4s ease',
                          }} />
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: 'auto', padding: '10px 0 0' }}>
                      <div style={{
                        width: '100%', padding: '10px', borderRadius: '10px',
                        background: transitioning ? 'linear-gradient(90deg, #818cf8, #6366f1)' : 'var(--color-forest-600)',
                        color: '#fff', fontSize: '11px', fontWeight: 700, textAlign: 'center',
                        transition: 'background 0.4s ease',
                        boxShadow: transitioning ? '0 0 16px rgba(129,140,248,0.3)' : 'none',
                      }}>
                        {transitioning ? `⟳ ${t('demo_morphing')}` : `✦ ${t('demo_generate')}`}
                      </div>
                    </div>
                  </div>

                  {/* 3D viewport — animated body silhouette */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'linear-gradient(180deg, var(--color-manikan-bg) 0%, #f0f0f4 100%)' }}>
                    {/* Status badge */}
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '999px',
                      background: 'var(--color-manikan-card)',
                      border: '1px solid var(--color-manikan-border)',
                      fontSize: '9px',
                      color: transitioning ? '#818cf8' : 'var(--color-forest-500)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      transition: 'color 0.3s',
                    }}>
                      <div style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        background: transitioning ? '#818cf8' : '#34d399',
                        boxShadow: transitioning ? '0 0 5px rgba(129,140,248,0.4)' : '0 0 5px rgba(52,211,153,0.4)',
                        transition: 'all 0.3s',
                      }} />
                      {transitioning ? t('demo_morphing_body') : t('demo_ready')}
                    </div>

                    {/* Preset dots — shows which profile is active */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '5px' }}>
                      {BODY_PRESETS.map((p, i) => (
                        <div
                          key={i}
                          style={{
                            width: i === presetIndex ? '18px' : '5px',
                            height: '5px',
                            borderRadius: '999px',
                            background: i === presetIndex ? '#818cf8' : 'var(--color-forest-200)',
                            transition: 'all 0.4s ease',
                          }}
                        />
                      ))}
                    </div>

                    {/* Body silhouette */}
                    <BodySilhouette params={params} />

                    {/* Bottom label */}
                    <div style={{
                      position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                      padding: '4px 12px', borderRadius: '999px',
                      background: 'var(--color-manikan-card)',
                      border: '1px solid var(--color-manikan-border)',
                      fontSize: '9px', color: 'var(--color-forest-500)', whiteSpace: 'nowrap',
                    }}>
                      {t('demo_auto_play')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { t } = useLanguage();

  const stats = [
    { value: 30, suffix: '%', label: t('stat_1_label') },
    { value: 70, suffix: '%', label: t('stat_2_label') },
    { value: 42, suffix: '%', label: t('stat_3_label') },
  ];

  const features = [
    { icon: Ruler, title: t('feat_1_title'), desc: t('feat_1_desc'), delay: 'stagger-1' },
    { icon: CalendarCheck, title: t('feat_2_title'), desc: t('feat_2_desc'), delay: 'stagger-2' },
    { icon: Shirt, title: t('feat_3_title'), desc: t('feat_3_desc'), delay: 'stagger-3' },
    { icon: BarChart3, title: t('feat_4_title'), desc: t('feat_4_desc'), delay: 'stagger-4' },
  ];

  const benefits = [
    { icon: TrendingDown, label: t('ben_1'), audience: t('for_brands') },
    { icon: ShieldCheck, label: t('ben_2'), audience: t('for_brands') },
    { icon: Zap, label: t('ben_3'), audience: t('for_brands') },
    { icon: Users, label: t('ben_4'), audience: t('for_shoppers') },
    { icon: Shirt, label: t('ben_5'), audience: t('for_shoppers') },
    { icon: Star, label: t('ben_6'), audience: t('for_shoppers') },
  ];

  const steps = [
    { num: '01', title: t('step_1_title'), desc: t('step_1_desc'), icon: Package },
    { num: '02', title: t('step_2_title'), desc: t('step_2_desc'), icon: Ruler },
    { num: '03', title: t('step_3_title'), desc: t('step_3_desc'), icon: Zap },
    { num: '04', title: t('step_4_title'), desc: t('step_4_desc'), icon: Sparkles },
  ];

  const problems = [
    { icon: RefreshCw, title: t('prob_1_title'), desc: t('prob_1_desc') },
    { icon: Frown, title: t('prob_2_title'), desc: t('prob_2_desc') },
    { icon: Package, title: t('prob_3_title'), desc: t('prob_3_desc') },
  ];

  const testimonials = [
    { quote: t('test_1_quote'), name: t('test_1_name'), role: t('test_1_role'), avatar: 'DM', rating: 5 },
    { quote: t('test_2_quote'), name: t('test_2_name'), role: t('test_2_role'), avatar: 'YA', rating: 5 },
  ];

  return (
    <div className="overflow-x-hidden bg-manikan-bg">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background design */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-forest-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-gold-50 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 opacity-60" />
          {/* Decorative dots */}
          <div className="absolute top-32 right-24 w-2 h-2 bg-gold-400 rounded-full animate-pulse-gold" />
          <div className="absolute top-64 right-48 w-1.5 h-1.5 bg-forest-300 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-gold-300 rounded-full animate-pulse-gold" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <div className="animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white border border-manikan-border rounded-full px-4 py-2 mb-8 shadow-soft">
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse-gold" />
                <span className="text-xs font-semibold text-gold-600 tracking-wide">{t('hero_badge')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium text-forest-900 leading-[1.06] text-balance mb-6">
                {t('hero_line1')}<br />
                <span className="shimmer-text">{t('hero_line2')}</span><br />
                {t('hero_line3')}
              </h1>

              <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-lg">
                {t('hero_sub')}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-forest-600 text-white text-sm font-medium rounded-xl hover:bg-forest-700 transition-all duration-300 shadow-card hover:shadow-lift btn-glow group"
                >
                  <Zap size={17} />
                  {t('hero_cta_demo')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/business"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-manikan-border text-forest-700 text-sm font-medium rounded-xl hover:border-forest-300 hover:bg-forest-50 transition-all duration-300"
                >
                  {t('hero_cta_biz')}
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-5 text-xs text-gray-400">
                {[t('hero_free'), t('hero_no_card'), t('hero_any_plat')].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-forest-400" /> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: virtual fitting flow — inputs → output */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative flex items-center gap-6" style={{ width: '520px', height: '400px' }}>

                {/* ── INPUTS: hijab + blouse (stacked, floating) ── */}
                <div className="relative flex flex-col items-center z-10" style={{ minWidth: '140px' }}>
                  {/* Hijab */}
                  <div className="relative">
                    <img
                      src="/hijab.png"
                      alt="Hijab"
                      className="w-[130px] h-[150px] object-cover rounded-2xl shadow-card hover:shadow-lift transition-shadow duration-300 animate-float"
                    />
                  </div>
                  {/* Plus badge */}
                  <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-forest-900 font-bold text-base shadow-soft -my-2 z-20">+</div>
                  {/* Blouse */}
                  <div className="relative">
                    <img
                      src="/blouse.png"
                      alt="Blouse"
                      className="w-[130px] h-[150px] object-cover rounded-2xl shadow-card hover:shadow-lift transition-shadow duration-300 animate-float"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>

                {/* ── ARROW: dotted flow line ── */}
                <div className="flex flex-col items-center gap-1.5 z-10">
                  <svg width="80" height="10" className="text-gold-400">
                    <line x1="0" y1="5" x2="58" y2="5" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
                    <polygon points="60,0 72,5 60,10" fill="currentColor" />
                  </svg>
                  <span className="text-[10px] font-bold text-gold-600 tracking-[0.15em] uppercase">AI Styling</span>
                </div>

                {/* ── OUTPUT: styled girl result (larger) ── */}
                <div className="relative flex flex-col items-center z-10">
                  <div className="relative">
                    <img
                      src="/girl.png"
                      alt="Styled result — model wearing the outfit"
                      className="w-[190px] h-[260px] object-cover rounded-2xl shadow-lift hover:shadow-xl transition-shadow duration-300 ring-2 ring-white/80"
                    />
                    {/* Subtle glow behind result */}
                    <div className="absolute -inset-3 rounded-3xl bg-forest-200/20 blur-xl -z-10" />
                  </div>
                  <span className="mt-2.5 text-[12px] font-semibold text-forest-600 tracking-wide">Your Look ✨</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <AnimatedSection className="mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <div key={i} className={`bg-white rounded-2xl p-6 border border-manikan-border shadow-soft card-hover stagger-${i + 1} group`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-4xl font-display text-gold-600">
                      <Counter end={s.value} suffix={s.suffix} />
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <div className="mt-4 h-0.5 w-0 bg-gold-400 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 section-pattern">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Ornament label={t('problem_label')} />
            <h2 className="text-4xl sm:text-5xl font-display text-forest-900 leading-tight mb-4">
              {t('problem_title')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t('problem_sub')}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* ── LEFT: "Old Way" Interactive Demo ── */}
            <AnimatedSection className="stagger-1">
              <div className="bg-white rounded-2xl p-7 border border-manikan-border shadow-soft">
                {/* Header */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">The Old Way</span>
                </div>

                {/* Product title mock */}
                <h4 className="font-display text-lg text-forest-900 mb-1">Classic Oxford Shirt</h4>
                <p className="text-sm text-gray-400 mb-5">EGP 199.99</p>

                {/* Color selector */}
                <OldWayColorSizeDemo />
              </div>
            </AnimatedSection>

            {/* ── RIGHT: Consequences (editorial, no cards) ── */}
            <AnimatedSection className="stagger-2">
              <div className="flex flex-col gap-10 pl-4">
                {/* Consequence 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Frown size={18} className="text-gold-500" />
                    <h4 className="font-display text-xl text-forest-900">Shoppers guessing sizes</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    Different sizing charts per brand leads to frustration and cart abandonment.
                  </p>
                </div>

                {/* Consequence 2 */}
                <div>
                  <p className="text-7xl font-display text-gold-500 leading-none mb-2">70%</p>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    of returns are due to sizing issues.
                  </p>
                </div>

                {/* Consequence 3 */}
                <div>
                  <p className="text-7xl font-display text-gold-500 leading-none mb-2">$500B</p>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    in returns globally — fashion has the highest return rate of any e-commerce category.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ── 3D ENGINE FEATURE — ANIMATED AUTO-PLAY DEMO ───────────────── */}
      <BodyDemoSection />

      {/* ── SOLUTION / FEATURES ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-900 relative overflow-hidden">
        {/* bg pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-gold-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-forest-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-400/60" />
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-[0.2em]">{t('solution_label')}</span>
              <div className="h-px w-10 bg-gold-400/60" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-display text-white leading-tight mb-4">
              {t('solution_title')}
            </h2>
            <p className="text-forest-200 max-w-2xl mx-auto leading-relaxed">
              {t('solution_sub')}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── LEFT: Mock IDE Code Editor ── */}
            <AnimatedSection className="stagger-1">
              <div className="bg-gray-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                {/* macOS window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-gray-500 font-mono">ProductPage.jsx</span>
                </div>

                {/* Code content with syntax highlighting */}
                <div className="p-5 overflow-x-auto">
                  <pre className="text-[13px] leading-relaxed font-mono">
                    <code>
                      <span className="text-purple-400">import</span>
                      <span className="text-gray-300">{' { '}</span>
                      <span className="text-yellow-300">ManikanFit</span>
                      <span className="text-gray-300">{' } '}</span>
                      <span className="text-purple-400">from</span>
                      <span className="text-green-400">{" '@manikan/react'"}</span>
                      <span className="text-gray-500">;</span>
                      {'\n'}{'\n'}
                      <span className="text-purple-400">export default function</span>
                      <span className="text-blue-300">{' ProductPage'}</span>
                      <span className="text-gray-300">{'() {'}</span>
                      {'\n'}
                      <span className="text-gray-300">{'  '}</span>
                      <span className="text-purple-400">return</span>
                      <span className="text-gray-300">{' ('}</span>
                      {'\n'}
                      <span className="text-gray-500">{'    '}&lt;</span>
                      <span className="text-blue-300">div</span>
                      <span className="text-sky-300">{' className'}</span>
                      <span className="text-gray-300">=</span>
                      <span className="text-green-400">"product-details"</span>
                      <span className="text-gray-500">&gt;</span>
                      {'\n'}
                      <span className="text-gray-500">{'      '}&lt;</span>
                      <span className="text-blue-300">h1</span>
                      <span className="text-gray-500">&gt;</span>
                      <span className="text-gray-300">Classic Oxford Shirt</span>
                      <span className="text-gray-500">&lt;/</span>
                      <span className="text-blue-300">h1</span>
                      <span className="text-gray-500">&gt;</span>
                      {'\n'}
                      <span className="text-gray-500">{'      '}&lt;</span>
                      <span className="text-blue-300">span</span>
                      <span className="text-sky-300">{' className'}</span>
                      <span className="text-gray-300">=</span>
                      <span className="text-green-400">"price"</span>
                      <span className="text-gray-500">&gt;</span>
                      <span className="text-gray-300">$199.99</span>
                      <span className="text-gray-500">&lt;/</span>
                      <span className="text-blue-300">span</span>
                      <span className="text-gray-500">&gt;</span>
                      {'\n'}{'\n'}
                      <span className="text-gray-600">{'      '}{'//'} Drop in Manikan with one line</span>
                      {'\n'}
                      <span className="text-gray-500">{'      '}&lt;</span>
                      <span className="text-yellow-300">ManikanFit</span>
                      {'\n'}
                      <span className="text-sky-300">{'         '}apiKey</span>
                      <span className="text-gray-300">=</span>
                      <span className="text-green-400">"pk_live_..."</span>
                      {'\n'}
                      <span className="text-sky-300">{'         '}productId</span>
                      <span className="text-gray-300">=</span>
                      <span className="text-green-400">"oxford-1"</span>
                      {'\n'}
                      <span className="text-gray-500">{'      '}/&gt;</span>
                      {'\n'}{'\n'}
                      <span className="text-gray-500">{'      '}&lt;</span>
                      <span className="text-blue-300">button</span>
                      <span className="text-gray-500">&gt;</span>
                      <span className="text-gray-300">Add to Cart</span>
                      <span className="text-gray-500">&lt;/</span>
                      <span className="text-blue-300">button</span>
                      <span className="text-gray-500">&gt;</span>
                      {'\n'}
                      <span className="text-gray-500">{'    '}&lt;/</span>
                      <span className="text-blue-300">div</span>
                      <span className="text-gray-500">&gt;</span>
                      {'\n'}
                      <span className="text-gray-300">{'  )'}</span>
                      {'\n'}
                      <span className="text-gray-300">{'}'}</span>
                    </code>
                  </pre>
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/50 border-t border-white/5">
                  <span className="text-[10px] text-gray-500 font-mono">React • JSX</span>
                  <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                    <CheckCircle size={10} /> Saved
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* ── RIGHT: Integration value props ── */}
            <AnimatedSection className="stagger-2">
              <div className="flex flex-col gap-8 pt-2">
                {/* Prop 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400 flex items-center justify-center shrink-0 shadow-gold">
                    <Zap size={20} className="text-forest-900" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white mb-1">{t('sol_prop1_title')}</h3>
                    <p className="text-sm text-forest-300 leading-relaxed">{t('sol_prop1_desc')}</p>
                  </div>
                </div>

                {/* Prop 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400 flex items-center justify-center shrink-0 shadow-gold">
                    <Ruler size={20} className="text-forest-900" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white mb-1">{t('sol_prop2_title')}</h3>
                    <p className="text-sm text-forest-300 leading-relaxed">{t('sol_prop2_desc')}</p>
                  </div>
                </div>

                {/* Prop 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400 flex items-center justify-center shrink-0 shadow-gold">
                    <BarChart3 size={20} className="text-forest-900" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white mb-1">{t('sol_prop3_title')}</h3>
                    <p className="text-sm text-forest-300 leading-relaxed">{t('sol_prop3_desc')}</p>
                  </div>
                </div>

                {/* Mini social proof */}
                <div className="bg-forest-800/50 rounded-xl p-4 border border-gold-400/15 mt-2">
                  <p className="text-xs text-forest-300 leading-relaxed">
                    <span className="text-gold-400 font-semibold">{t('sol_quote')}</span>
                    {' '}{t('sol_quote_author')}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Ornament label={t('how_label')} />
            <h2 className="text-4xl sm:text-5xl font-display text-forest-900 leading-tight mb-4">
              {t('how_title')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t('how_sub')}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <AnimatedSection key={i} className={`stagger-${i + 1}`}>
                <div className="relative bg-white rounded-2xl p-6 border border-manikan-border shadow-soft card-hover h-full group">
                  {/* Connector */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-3 z-10">
                      <ChevronRight size={20} className="text-gold-400" />
                    </div>
                  )}
                  <div className="w-11 h-11 bg-gold-50 border border-gold-200 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors duration-300">
                    <step.icon size={20} className="text-gold-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-5xl font-display text-gold-100 font-bold block mb-3 leading-none">
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-forest-900 mb-2 text-sm">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-forest-600 to-forest-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-forest-300/10 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-400/60" />
              <span className="text-xs font-semibold text-gold-300 uppercase tracking-[0.2em]">{t('benefits_label')}</span>
              <div className="h-px w-10 bg-gold-400/60" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-display text-white leading-tight">
              {t('benefits_title')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <AnimatedSection key={i} className={`stagger-${i + 1}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-start gap-4 border border-white/15 card-hover group">
                  <div className="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gold-300 transition-colors shadow-gold">
                    <b.icon size={18} className="text-forest-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gold-300 mb-1 tracking-wide">{b.audience}</p>
                    <p className="text-sm font-medium text-white leading-snug">{b.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 section-pattern">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Ornament label={t('testimonials_label')} />
            <h2 className="text-4xl sm:text-5xl font-display text-forest-900 leading-tight mb-4">
              {t('testimonials_title')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} className={`stagger-${i + 1}`}>
                <div className="bg-white rounded-2xl p-8 border border-manikan-border shadow-soft card-hover relative overflow-hidden">
                  {/* Sand Tan top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400" />
                  {/* Tan quote mark */}
                  <div className="absolute top-4 right-6 font-display text-8xl text-gold-100 select-none leading-none">&ldquo;</div>

                  <div className="flex gap-0.5 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={15} className="text-gold-500 fill-gold-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-7 text-sm relative">&ldquo;{t.quote}&rdquo;</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-xs font-bold text-forest-900 shadow-gold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-forest-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="relative bg-white rounded-3xl p-12 border border-manikan-border shadow-card overflow-hidden">
              {/* decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-500 via-forest-300 to-forest-500" />

              {/* Logo */}
              <img src="/logo.png" className="h-24 w-auto object-contain mx-auto mb-6" alt="Manikan" />

              <h2 className="text-4xl sm:text-5xl font-display text-forest-900 mb-4 leading-tight">
                {t('cta_title')}
              </h2>
              <p className="text-gray-500 mb-10 max-w-md mx-auto text-sm leading-relaxed">
                {t('cta_sub')}
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-forest-600 text-white text-sm font-medium rounded-xl hover:bg-forest-700 transition-all shadow-card hover:shadow-lift btn-glow group"
                >
                  {t('cta_store')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-manikan-border text-forest-700 text-sm font-medium rounded-xl hover:border-forest-300 hover:bg-forest-50 transition-all"
                >
                  {t('cta_pricing')}
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
                {[t('cta_free'), t('cta_no_card'), t('cta_works')].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-forest-400" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
