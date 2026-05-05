import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RefreshCw, Share2, Download, Sparkles, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Shimmer skeleton while "generating" ─────────────────────────────────────
function Shimmer() {
  const { t } = useLanguage();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="relative flex gap-6 items-end">
        {/* Pulsing silhouette */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          <div className="w-28 h-36 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="flex gap-1.5">
            <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>

        {/* Spinning AI ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-52 h-52 rounded-full border-2 border-dashed border-forest-300/60 animate-spin" style={{ animationDuration: '4s' }} />
          <div className="absolute w-36 h-36 rounded-full border border-gold-300/40 animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{t('widget_generating')}</span>
          <Sparkles size={12} className="text-gold-500 animate-pulse" />
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-forest-500 to-gold-500 rounded-full"
            style={{ animation: 'progressBar 3.2s ease-in-out forwards' }}
          />
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          {t('widget_draping')}
        </p>
      </div>

      <style>{`
        @keyframes progressBar {
          0%   { width: 0%; }
          40%  { width: 55%; }
          70%  { width: 78%; }
          90%  { width: 91%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Video Player ──────────────────────────────────────────────────────────────
function VideoPlayer({ src }) {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted]     = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else           { v.pause(); setPlaying(false); }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden bg-black cursor-pointer group"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Play/pause overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        style={{ background: playing ? 'transparent' : 'rgba(0,0,0,0.35)', opacity: playing ? 0 : 1 }}
      >
        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl">
          {playing ? <Pause size={22} className="text-forest-800" /> : <Play size={22} className="text-forest-800 translate-x-0.5" />}
        </div>
      </div>

      {/* Hover overlay for playing state */}
      {playing && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
            <Pause size={18} className="text-white" />
          </div>
        </div>
      )}

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center transition-opacity opacity-70 hover:opacity-100"
      >
        {muted ? <VolumeX size={13} className="text-white" /> : <Volume2 size={13} className="text-white" />}
      </button>

      {/* Video label */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-forest-700/80 backdrop-blur rounded-full px-2 py-0.5">
        <Play size={8} className="text-white fill-white" />
        <span className="text-[9px] text-white font-semibold">{t('widget_live_try_on')}</span>
      </div>
    </div>
  );
}

// ── Try-On Result Display ─────────────────────────────────────────────────────
function TryOnDisplay({ model, product, gender }) {
  const { t } = useLanguage();
  const hasRealTryOn = product?.hasTryOn && product?.tryOnImage;
  const hasVideo     = product?.hasTryOn && product?.tryOnVideo;

  // If product has a real try-on image + video → split view
  if (hasRealTryOn) {
    return (
      <div className="w-full h-full flex flex-col bg-gray-50">
        {/* Split: image | video */}
        <div className="flex-1 flex gap-0 min-h-0">

          {/* Left — Try-on photo */}
          <div className="flex-1 relative bg-white flex items-center justify-center p-3 border-r border-gray-100">
            <div className="relative h-full max-h-full flex items-center">
              <img
                src={product.tryOnImage}
                alt="Virtual try-on"
                className="h-full max-h-[400px] object-contain rounded-xl shadow-lg"
                style={{ maxWidth: '100%' }}
              />
              {/* Photo label */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-forest-700/80 backdrop-blur rounded-full px-2 py-0.5">
                <CheckCircle2 size={8} className="text-white" />
                <span className="text-[9px] text-white font-semibold">{t('widget_ai_photo')}</span>
              </div>
            </div>
          </div>

          {/* Right — Video */}
          {hasVideo && (
            <div className="flex-1 p-3 flex flex-col gap-2 min-h-0">
              <div className="flex-1 min-h-0">
                <VideoPlayer src={product.tryOnVideo} />
              </div>
              <p className="text-[10px] text-gray-400 text-center shrink-0">
                {t('widget_tap_to_play')}
              </p>
            </div>
          )}
        </div>

        {/* Manikan watermark */}
        <div className="absolute bottom-24 right-3 flex items-center gap-1 bg-white/80 backdrop-blur rounded-lg px-2 py-0.5 shadow-sm">
          <div className="w-3.5 h-3.5 rounded bg-forest-700 flex items-center justify-center">
            <span className="text-white text-[7px] font-bold leading-none">M</span>
          </div>
          <span className="text-[9px] text-gray-500 font-medium">Manikan</span>
        </div>
      </div>
    );
  }

  // Fallback — model with product badge overlay
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <img
            src={model.img}
            alt={model.description}
            className="h-[420px] object-contain rounded-2xl shadow-xl"
            style={{ maxWidth: '260px' }}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-md border border-white/50">
            <p className="text-xs font-semibold text-forest-700">👗 {product?.name}</p>
            <p className="text-[10px] text-gray-400">{product?.brand}</p>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-forest-700/90 backdrop-blur text-white rounded-full px-4 py-1.5 text-xs font-medium flex items-center gap-2 whitespace-nowrap">
            <CheckCircle2 size={12} />
            {t('widget_virtual_active')}
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/70 backdrop-blur rounded-lg px-2 py-1">
        <div className="w-4 h-4 rounded bg-forest-700 flex items-center justify-center">
          <span className="text-white text-[8px] font-bold leading-none">M</span>
        </div>
        <span className="text-[10px] text-gray-500 font-medium">Manikan</span>
      </div>
    </div>
  );
}

// ── CSS Hijab Avatar — realistic fashion silhouette ──────────────────────────
export function HijabAvatar({ model, large = false }) {
  const w = large ? 180 : 56;
  const h = large ? 480 : 100;
  const { skinColor = '#F5D5B0', hijabColor = '#7C9E87' } = model;

  const bodyHalfW = model.bodyType === 'heavy' ? 22 : model.bodyType === 'slim' ? 15 : 18;
  const shoulderW = bodyHalfW + 6;

  return (
    <svg width={w} height={h} viewBox="0 0 60 160" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: large ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))' : 'none' }}>
      <rect x={30 - bodyHalfW + 2} y="112" width={bodyHalfW - 3} height="44" rx="4" fill={hijabColor} opacity="0.85" />
      <rect x="30" y="112" width={bodyHalfW - 3} height="44" rx="4" fill={hijabColor} opacity="0.85" />
      <rect x={30 - bodyHalfW + 1} y="153" width={bodyHalfW} height="6" rx="3" fill="#888" />
      <rect x="29" y="153" width={bodyHalfW} height="6" rx="3" fill="#888" />
      <path d={`M ${30 - shoulderW} 60 Q ${30 - shoulderW - 4} 90 ${30 - bodyHalfW} 114 L ${30 + bodyHalfW} 114 Q ${30 + shoulderW + 4} 90 ${30 + shoulderW} 60 Z`} fill={hijabColor} />
      <path d={`M ${30 - shoulderW} 62 Q ${30 - shoulderW - 10} 85 ${30 - shoulderW - 5} 100`} stroke={hijabColor} strokeWidth="9" strokeLinecap="round" />
      <path d={`M ${30 + shoulderW} 62 Q ${30 + shoulderW + 10} 85 ${30 + shoulderW + 5} 100`} stroke={hijabColor} strokeWidth="9" strokeLinecap="round" />
      <ellipse cx={30 - shoulderW - 4} cy="102" rx="5" ry="4" fill={skinColor} />
      <ellipse cx={30 + shoulderW + 4} cy="102" rx="5" ry="4" fill={skinColor} />
      <rect x="26" y="47" width="8" height="14" rx="4" fill={skinColor} />
      <ellipse cx="30" cy="35" rx="13" ry="15" fill={skinColor} />
      <ellipse cx="30" cy="24" rx="16" ry="14" fill={hijabColor} />
      <path d={`M 14 28 Q 8 42 12 58 Q 18 62 ${30 - shoulderW + 4} 62 L ${30 - shoulderW} 60 Q 10 55 14 28 Z`} fill={hijabColor} />
      <path d={`M 46 28 Q 52 42 48 58 Q 42 62 ${30 + shoulderW - 4} 62 L ${30 + shoulderW} 60 Q 50 55 46 28 Z`} fill={hijabColor} />
      <path d="M 17 40 Q 30 50 43 40" stroke={hijabColor} strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="24" cy="34" rx="2" ry="2.2" fill="#2D1B00" />
      <ellipse cx="36" cy="34" rx="2" ry="2.2" fill="#2D1B00" />
      <circle cx="25" cy="33" r="0.7" fill="white" />
      <circle cx="37" cy="33" r="0.7" fill="white" />
      <path d="M 21 30.5 Q 24 29 27 30" stroke="#3D2B1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 33 30 Q 36 29 39 30.5" stroke="#3D2B1F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 25 40 Q 30 44 35 40" stroke="#A06050" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 29 36 Q 30 38.5 31 36" stroke="#C09070" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function TryOnModal({ isOpen, onClose, model, product, gender }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('generating');
  const overlayRef = useRef(null);

  const hasRealContent = product?.hasTryOn;

  useEffect(() => {
    if (!isOpen) return;
    setPhase('generating');
    const timer = setTimeout(() => setPhase('ready'), 3200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleBackdrop = (e) => { if (e.target === overlayRef.current) onClose(); };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !model) return null;

  // Wide modal when we have image + video
  const isWide = hasRealContent && phase === 'ready';

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: 'rgba(15, 23, 42, 0.80)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'fadeInOverlay 0.25s ease',
      }}
    >
      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl w-full flex flex-col"
        style={{
          maxWidth: isWide ? '820px' : '480px',
          height: isWide ? '580px' : 'auto',
          maxHeight: '92vh',
          animation: 'slideUpModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transition: 'max-width 0.4s ease',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-forest-700 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold leading-none">M</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t('widget_virtual_try_on') || 'Virtual Try-On'}</p>
              <p className="text-xs text-gray-400">
                {product?.name} · {model.description}
              </p>
            </div>
          </div>
          {/* Column labels when in wide mode */}
          {isWide && (
            <div className="hidden sm:flex items-center gap-6 text-[11px] text-gray-400 font-medium mr-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-forest-500" />
                {t('widget_ai_photo')}
              </span>
              <span className="flex items-center gap-1">
                <Play size={11} className="text-forest-500" />
                {t('widget_live_try_on')}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            id="tryon-modal-close"
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="relative flex-1 min-h-0 overflow-hidden" style={{ background: '#F9FAFB' }}>
          {phase === 'generating' ? (
            <Shimmer />
          ) : (
            <div style={{ animation: 'fadeInContent 0.5s ease' }} className="h-full">
              <TryOnDisplay model={model} product={product} gender={gender} />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3.5 bg-white border-t border-gray-100 shrink-0">
          {phase === 'ready' && (
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">
                {hasRealContent
                  ? t('widget_real_ready')
                  : t('widget_ready')}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              id="tryon-regenerate"
              onClick={() => { setPhase('generating'); setTimeout(() => setPhase('ready'), 3200); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={13} />
              {t('widget_retry')}
            </button>
            <button
              id="tryon-share"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 size={13} />
              {t('widget_share')}
            </button>
            <button
              id="tryon-save"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-700 text-white text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm"
            >
              <Download size={13} />
              {t('widget_save')}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
            <div className="w-3.5 h-3.5 rounded bg-forest-700 flex items-center justify-center">
              <span className="text-white text-[7px] font-bold leading-none">M</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {t('widget_powered_by')} <span className="text-forest-700 font-semibold">Manikan</span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInContent {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
