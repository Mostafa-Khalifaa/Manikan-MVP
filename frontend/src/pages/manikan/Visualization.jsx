import React, { useState, useRef } from 'react';
import { Upload, ImagePlus, Sparkles, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/manikan/Button';
import SectionHeader from '../../components/manikan/SectionHeader';
import Badge from '../../components/manikan/Badge';
import ConfidenceBar from '../../components/manikan/ConfidenceBar';

const mockStyles = [
  {
    id: 1,
    label: 'Smart Casual',
    items: ['White Linen Shirt', 'Navy Chinos', 'Clean Sneakers'],
    fit: 'Flattering — balanced proportions',
    score: 94,
    color: 'sage',
    imgHint: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300&q=80',
  },
  {
    id: 2,
    label: 'Weekend Relaxed',
    items: ['Oversized Tee', 'Wide-Leg Trousers', 'Loafers'],
    fit: 'Relaxed — comfortable, effortless',
    score: 88,
    color: 'blue',
    imgHint: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
  },
  {
    id: 3,
    label: 'Evening Look',
    items: ['Knit Midi Dress', 'Structured Blazer', 'Block Heels'],
    fit: 'Elegant — elongating silhouette',
    score: 91,
    color: 'rose',
    imgHint: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80',
  },
];

const fitFeedback = [
  { label: 'Shoulder Fit',    value: 96, note: 'Perfect alignment' },
  { label: 'Torso Length',    value: 89, note: 'Slightly long — tuck recommended' },
  { label: 'Waist Definition', value: 92, note: 'Good visual balance' },
  { label: 'Hem Length',      value: 85, note: 'Midi length suits your proportions' },
];

export default function Visualization() {
  const [stage, setStage]   = useState('upload'); // upload | preview | result
  const [dragging, setDragging] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const fileRef = useRef(null);

  const simulateUpload = () => {
    setStage('preview');
    setTimeout(() => setStage('result'), 1800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    simulateUpload();
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SectionHeader
          label="Smart Visualisation"
          title="See how it looks on you."
          subtitle="Upload a photo and our AI analyses your body proportions, then suggests outfits that flatter your shape — before you buy anything."
        />

        {/* Stage: Upload */}
        {stage === 'upload' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragging ? 'border-sage-400 bg-forest-50' : 'border-gray-200 hover:border-sage-300 hover:bg-forest-50/30 bg-white'
              }`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={simulateUpload} />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragging ? 'bg-forest-100' : 'bg-gray-100'}`}>
                <ImagePlus size={28} className={dragging ? 'text-forest-600' : 'text-gray-400'} />
              </div>
              <p className="text-gray-700 font-medium mb-1">Drop your photo here</p>
              <p className="text-sm text-gray-400 mb-5">or click to browse</p>
              <Badge color="gray">JPEG, PNG, WEBP — max 10MB</Badge>
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">What the AI analyses</h3>
                <div className="space-y-3">
                  {[
                    'Body proportions and silhouette type',
                    'Shoulder, torso, and hip measurements',
                    'Colour tone and contrast preferences',
                    'Best cuts and lengths for your shape',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle size={15} className="text-forest-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-forest-50 border border-forest-100 rounded-2xl p-5">
                <p className="text-xs font-semibold text-forest-700 mb-1">🔒 Privacy first</p>
                <p className="text-xs text-forest-600 leading-relaxed">Photos are analysed locally and never stored. Your image is discarded immediately after analysis.</p>
              </div>

              <Button onClick={simulateUpload} fullWidth size="lg" icon={<Upload size={16} />}>
                Try with Sample Photo
              </Button>
            </div>
          </div>
        )}

        {/* Stage: Analysing */}
        {stage === 'preview' && (
          <div className="bg-white rounded-2xl border border-manikan-border shadow-card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Sparkles size={32} className="text-forest-600 animate-pulse" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Analysing your photo...</h3>
            <p className="text-sm text-gray-400 mb-6">AI is mapping your proportions and body shape</p>
            <div className="flex justify-center gap-2">
              {['Detecting silhouette', 'Analysing proportions', 'Generating outfits'].map((step, i) => (
                <span key={i} className="text-xs px-3 py-1.5 bg-gray-50 rounded-full text-gray-500 border border-gray-100">
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stage: Result */}
        {stage === 'result' && (
          <div className="animate-scale-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge color="forest" dot>Analysis complete</Badge>
                <span className="text-sm text-gray-400">Body type: Straight / Athletic</span>
              </div>
              <button
                onClick={() => setStage('upload')}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <RefreshCw size={12} /> New photo
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Placeholder avatar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-manikan-border shadow-soft overflow-hidden">
                  <div className="aspect-[2/3] bg-gradient-to-b from-sage-50 to-sage-100 flex items-center justify-center relative">
                    <img
                      src={mockStyles[activeStyle].imgHint}
                      alt="Style preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 text-center shadow">
                        <p className="text-xs font-semibold text-gray-700">{mockStyles[activeStyle].label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{mockStyles[activeStyle].fit}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-50">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Items in this look:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mockStyles[activeStyle].items.map((item, i) => (
                        <span key={i} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5 text-gray-600">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="lg:col-span-3 space-y-5">
                {/* Style suggestions */}
                <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Outfit Styles</h3>
                  <div className="space-y-2">
                    {mockStyles.map((style, i) => (
                      <button
                        key={style.id}
                        onClick={() => setActiveStyle(i)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                          activeStyle === i
                            ? 'border-sage-300 bg-forest-50'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          style.color === 'sage' ? 'bg-forest-600' :
                          style.color === 'blue' ? 'bg-blue-500' : 'bg-rose-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${activeStyle === i ? 'text-forest-700' : 'text-gray-700'}`}>{style.label}</p>
                          <p className="text-xs text-gray-400 truncate">{style.fit}</p>
                        </div>
                        <span className={`text-xs font-semibold shrink-0 ${activeStyle === i ? 'text-forest-600' : 'text-gray-400'}`}>
                          {style.score}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit feedback */}
                <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Fit Feedback</h3>
                  <div className="space-y-4">
                    {fitFeedback.map((f, i) => (
                      <div key={i}>
                        <ConfidenceBar value={f.value} label={f.label} color="forest" />
                        <p className="text-xs text-gray-400 mt-0.5 pl-0.5">{f.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button to="/store" fullWidth iconRight={<ArrowRight size={15} />}>
                  Shop These Looks
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
