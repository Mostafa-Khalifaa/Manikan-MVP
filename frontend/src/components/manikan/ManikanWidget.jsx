import { useState, useRef, useEffect } from 'react';
import {
  X, ChevronRight, Sparkles, User, Users,
  ArrowRight, Check, Shirt,
} from 'lucide-react';
import { maleModels, femaleModels, suggestModel } from '../../data/manikan/models';
import TryOnModal, { HijabAvatar } from './TryOnModal';
import { useLanguage } from '../../contexts/LanguageContext';

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function PoweredBy({ t }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <div className="w-4 h-4 rounded-[4px] bg-forest-700 flex items-center justify-center shadow-sm">
        <span className="text-white font-bold leading-none" style={{ fontSize: 9 }}>M</span>
      </div>
      <span style={{ fontSize: 10 }} className="text-gray-400">
        {t ? t('widget_powered_by') : 'Powered by'}{' '}
        <span className="text-forest-700 font-semibold">Manikan</span>
      </span>
    </div>
  );
}

// ── Model card (photo or SVG avatar) ─────────────────────────────────────────
function ModelCard({ model, selected, onSelect, gender }) {
  const isHijab = gender === 'female';

  return (
    <button
      onClick={() => onSelect(model)}
      id={`model-card-${model.id}`}
      className="relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 focus:outline-none"
      style={{
        borderColor: selected ? '#2D6A4F' : '#E5E7EB',
        background: selected ? '#F0FDF4' : '#FAFAFA',
        transform: selected ? 'scale(1.03)' : 'scale(1)',
        boxShadow: selected ? '0 0 0 3px rgba(45,106,79,0.15)' : 'none',
      }}
    >
      {/* Image or Avatar */}
      <div
        className="flex items-end justify-center overflow-hidden"
        style={{
          height: 100,
          background: isHijab
            ? `linear-gradient(160deg, ${model.hijabColor}22, ${model.hijabColor}11)`
            : '#F3F4F6',
        }}
      >
        {model.img ? (
          <img
            src={model.img}
            alt={model.description}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-end justify-center h-full pb-1">
            <HijabAvatar model={model} />
          </div>
        )}
      </div>

      {/* Label */}
      <div className="px-2 py-1.5 text-center">
        <p className="text-[11px] font-semibold text-gray-700 leading-tight">{model.label}</p>
        <p className="text-[10px] text-gray-400 capitalize">{model.skin}</p>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-forest-600 flex items-center justify-center shadow-sm">
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
  );
}

// ── Widget Panel ─────────────────────────────────────────────────────────────
function WidgetPanel({ isOpen, onClose, product }) {
  const { t } = useLanguage();
  const isFemaleOnly = product?.gender === 'female' || product?.category === 'Dresses';
  const [gender, setGender]         = useState(isFemaleOnly ? 'female' : 'male'); // 'male' | 'female'
  const [selectedModel, setModel]   = useState(null);
  const [height, setHeight]         = useState('');
  const [weight, setWeight]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [autoSuggested, setAutoSuggested] = useState(false);

  const models = gender === 'male' ? maleModels : femaleModels;

  // Reset model when gender switches, then re-suggest if measurements are present
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const measurementsValid = h > 100 && h < 230 && w > 30 && w < 300;
    if (measurementsValid) {
      const suggested = suggestModel(gender, h, w);
      setModel(suggested);
      setAutoSuggested(true);
    } else {
      setModel(null);
      setAutoSuggested(false);
    }
  }, [gender]); // runs when gender tab switches

  // Auto-suggest when measurements change (keep current gender)
  useEffect(() => {
    if (!height || !weight) return;
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 100 && h < 230 && w > 30 && w < 300) {
      const suggested = suggestModel(gender, h, w);
      setModel(suggested);
      setAutoSuggested(true);
    }
  }, [height, weight]); // intentionally excludes gender

  const currentGenderPool = gender === 'male' ? maleModels : femaleModels;
  const modelIsFromCurrentGender = selectedModel
    ? currentGenderPool.some((m) => m.id === selectedModel.id)
    : false;
  const canGenerate = modelIsFromCurrentGender && height && weight
    && parseFloat(height) > 100 && parseFloat(weight) > 30;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={onClose}
        style={{ backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}
      />

      {/* Panel */}
      <div
        id="manikan-widget-panel"
        className="fixed bottom-0 left-0 right-0 z-50 lg:absolute lg:top-0 lg:right-0 lg:bottom-auto lg:left-auto"
        style={{
          // Mobile: full-width bottom sheet
          // Desktop: fixed-width side panel (positioned relative to trigger container)
          width: '100%',
          maxWidth: '360px',
          marginLeft: 'auto',
        }}
      >
        <div
          className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          {/* ── Header ─────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base leading-none">M</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none">{t('widget_try_on')}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{t('widget_with_manikan')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="manikan-widget-close"
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-gray-600" />
            </button>
          </div>

          <div className="px-5 pb-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
            {/* ── Step 1: Gender ─────────────────────────── */}
            <div className="mt-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
                {t('widget_step1')}
              </p>

              {/* Gender toggle */}
              {!isFemaleOnly && (
                <div className="flex gap-2 mb-4">
                  <button
                    id="gender-male-tab"
                    onClick={() => setGender('male')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      background: gender === 'male' ? '#1B4332' : 'transparent',
                      borderColor: gender === 'male' ? '#1B4332' : '#E5E7EB',
                      color: gender === 'male' ? '#fff' : '#6B7280',
                    }}
                  >
                    <User size={14} />
                    {t('widget_male')}
                  </button>
                  <button
                    id="gender-female-tab"
                    onClick={() => setGender('female')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      background: gender === 'female' ? '#1B4332' : 'transparent',
                      borderColor: gender === 'female' ? '#1B4332' : '#E5E7EB',
                      color: gender === 'female' ? '#fff' : '#6B7280',
                    }}
                  >
                    <Users size={14} />
                    {t('widget_female')}
                  </button>
                </div>
              )}

              {/* Model grid */}
              {autoSuggested && selectedModel && (
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Sparkles size={11} className="text-gold-500" />
                  <span className="text-[10px] text-gold-600 font-medium">
                    {t('widget_best_match')}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {models.map((m) => (
                  <ModelCard
                    key={m.id}
                    model={m}
                    gender={gender}
                    selected={selectedModel?.id === m.id}
                    onSelect={(m) => { setModel(m); setAutoSuggested(false); }}
                  />
                ))}
              </div>
            </div>

            {/* ── Step 2: Measurements ───────────────────── */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
                {t('widget_step2')}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">
                    {t('widget_height')}
                  </label>
                  <input
                    id="measurement-height"
                    type="number"
                    min="100"
                    max="230"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none transition-colors"
                    style={{ borderColor: height ? '#2D6A4F' : undefined }}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block font-medium">
                    {t('widget_weight')}
                  </label>
                  <input
                    id="measurement-weight"
                    type="number"
                    min="30"
                    max="300"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none transition-colors"
                    style={{ borderColor: weight ? '#2D6A4F' : undefined }}
                  />
                </div>
              </div>

              {height && weight && !canGenerate && (
                <p className="text-[10px] text-amber-500 mt-1.5 flex items-center gap-1">
                  ⚠ Please enter valid measurements (height: 100–230cm, weight: 30–300kg)
                </p>
              )}
            </div>

            {/* ── CTA ───────────────────────────────────── */}
            <button
              id="tryon-generate-cta"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 mb-3"
              style={{
                background: canGenerate
                  ? 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)'
                  : '#F3F4F6',
                color: canGenerate ? '#fff' : '#9CA3AF',
                boxShadow: canGenerate ? '0 4px 16px rgba(27,67,50,0.3)' : 'none',
                transform: canGenerate ? 'none' : 'none',
                cursor: canGenerate ? 'pointer' : 'not-allowed',
              }}
            >
              <Sparkles size={16} className={canGenerate ? 'text-gold-300' : 'text-gray-400'} />
              {t('widget_see_it_on_me')}
              {canGenerate && <ArrowRight size={15} />}
            </button>

            {!canGenerate && (
              <p className="text-[10px] text-center text-gray-400 mb-2">
                {!selectedModel
                  ? 'Select a model above to continue'
                  : 'Enter your measurements to continue'}
              </p>
            )}
          </div>

          {/* ── Powered by Manikan ─────────────────────── */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-5">
            <PoweredBy />
          </div>
        </div>
      </div>

      {/* Try-On Modal */}
      <TryOnModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        model={selectedModel}
        product={product}
        gender={gender}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Public component — the launcher button + panel
// ────────────────────────────────────────────────────────────────────────────
export default function ManikanWidget({ product }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const containerRef = useRef(null);

  // Close on outside click (desktop)
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    // slight delay so the open click doesn't immediately close
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* ── Launcher Button ─────────────────────────────────────────────── */}
      <button
        id="manikan-widget-launcher"
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition-all duration-200 w-full"
        style={{
          background: open
            ? 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)'
            : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          borderColor: open ? '#1B4332' : '#86EFAC',
          boxShadow: open
            ? '0 4px 20px rgba(27,67,50,0.25)'
            : '0 2px 8px rgba(134,239,172,0.3)',
        }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
          style={{
            background: open ? 'rgba(255,255,255,0.15)' : '#1B4332',
          }}
        >
          <Shirt size={18} className={open ? 'text-white' : 'text-white'} />
        </div>

        {/* Text */}
        <div className="text-left flex-1">
          <p className="text-sm font-bold leading-tight" style={{ color: open ? '#fff' : '#1B4332' }}>
            {t('widget_try_virtually')}
          </p>
          <p className="text-[10px] leading-none mt-0.5" style={{ color: open ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>
            {t('widget_see_how_it_fits')}
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={16}
          className="transition-transform duration-200"
          style={{
            color: open ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* ── Manikan badge below launcher ────────────────────────────────── */}
      <div className="flex items-center gap-1 mt-1.5 px-1">
        <div className="w-3 h-3 rounded-[3px] bg-forest-700 flex items-center justify-center">
          <span className="text-white font-bold leading-none" style={{ fontSize: 7 }}>M</span>
        </div>
        <span style={{ fontSize: 9 }} className="text-gray-400">
          {t('widget_powered_by')} <span className="text-forest-700 font-medium">Manikan</span>
        </span>
      </div>

      {/* ── Widget Panel ─────────────────────────────────────────────────── */}
      <WidgetPanel
        isOpen={open}
        onClose={() => setOpen(false)}
        product={product}
      />
    </div>
  );
}
