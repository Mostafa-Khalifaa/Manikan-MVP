import React, { useState } from 'react';
import { Ruler, ChevronRight, Info, RotateCcw, Zap, CheckCircle } from 'lucide-react';
import Button from '../../components/manikan/Button';
import SectionHeader from '../../components/manikan/SectionHeader';
import ConfidenceBar from '../../components/manikan/ConfidenceBar';
import Badge from '../../components/manikan/Badge';
import { useLanguage } from '../../contexts/LanguageContext';

const fitOptions = [
  { value: 'slim',    label: 'Slim',    desc: 'Fitted, close to body' },
  { value: 'regular', label: 'Regular', desc: 'Standard, comfortable fit' },
  { value: 'relaxed', label: 'Relaxed', desc: 'Loose, oversized feel' },
];

const genderOptions = [
  { value: 'women', label: 'Women', emoji: '👗' },
  { value: 'men',   label: 'Men',   emoji: '👔' },
];

function computeSize({ height, weight, fit, gender }) {
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (!h || !w) return null;

  const bmi = w / ((h / 100) ** 2);

  let baseTop = 'M';
  let baseBottom = 'M';
  let confidence = 88;

  if (gender === 'men') {
    // Men's BMI thresholds are slightly different due to body composition
    if (bmi < 18.5)     { baseTop = 'XS'; baseBottom = '28'; confidence = 90; }
    else if (bmi < 21)  { baseTop = 'S';  baseBottom = '30'; confidence = 93; }
    else if (bmi < 24)  { baseTop = 'M';  baseBottom = '32'; confidence = 95; }
    else if (bmi < 27)  { baseTop = 'L';  baseBottom = '34'; confidence = 92; }
    else if (bmi < 30)  { baseTop = 'XL'; baseBottom = '36'; confidence = 89; }
    else                { baseTop = '2XL'; baseBottom = '38'; confidence = 86; }
  } else {
    if (bmi < 18.5)     { baseTop = 'XS'; baseBottom = 'XS'; confidence = 91; }
    else if (bmi < 21)  { baseTop = 'S';  baseBottom = 'S';  confidence = 93; }
    else if (bmi < 24)  { baseTop = 'M';  baseBottom = 'M';  confidence = 95; }
    else if (bmi < 27)  { baseTop = 'L';  baseBottom = 'L';  confidence = 92; }
    else if (bmi < 30)  { baseTop = 'XL'; baseBottom = 'XL'; confidence = 89; }
    else                { baseTop = '2XL'; baseBottom = '2XL'; confidence = 86; }
  }

  const topSizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const fitShift = fit === 'slim' ? -1 : fit === 'relaxed' ? 1 : 0;
  const shiftTop = (base, shift) => {
    const idx = topSizeOrder.indexOf(base);
    return topSizeOrder[Math.max(0, Math.min(topSizeOrder.length - 1, idx + shift))] || base;
  };

  const heightLabel = gender === 'men'
    ? (h < 170 ? 'Short' : h < 180 ? 'Regular' : h < 190 ? 'Tall' : 'XL Tall')
    : (h < 160 ? 'Petite' : h < 170 ? 'Short' : h < 178 ? 'Regular' : 'Tall');

  return {
    top:    shiftTop(baseTop, fitShift),
    bottom: baseBottom,
    confidence,
    fit,
    gender,
    heightLabel,
    tips: [
      fit === 'slim'    ? 'You prefer a fitted look — we sized down slightly for a cleaner silhouette.' : '',
      fit === 'relaxed' ? 'You prefer an oversized look — we sized up for that relaxed drape.' : '',
      fit === 'regular' ? 'Standard sizing applied. Perfect for everyday comfort.' : '',
      gender === 'men' && h < 175 ? 'Consider shorter inseam options for a cleaner trouser break.' : '',
      gender === 'women' && h < 162 ? 'For your height, consider short-inseam options in trousers.' : '',
    ].filter(Boolean),
  };
}

const womenSizeGuide = [
  { size: 'XS',  chest: '80–84',   waist: '60–64', hip: '86–90'   },
  { size: 'S',   chest: '85–89',   waist: '65–69', hip: '91–95'   },
  { size: 'M',   chest: '90–94',   waist: '70–74', hip: '96–100'  },
  { size: 'L',   chest: '95–99',   waist: '75–79', hip: '101–105' },
  { size: 'XL',  chest: '100–105', waist: '80–85', hip: '106–111' },
  { size: '2XL', chest: '106–111', waist: '86–92', hip: '112–118' },
];

const menSizeGuide = [
  { size: 'XS',  chest: '84–88',   waist: '72–76', shoulder: '40–41' },
  { size: 'S',   chest: '89–93',   waist: '77–81', shoulder: '42–43' },
  { size: 'M',   chest: '94–98',   waist: '82–86', shoulder: '44–45' },
  { size: 'L',   chest: '99–103',  waist: '87–91', shoulder: '46–47' },
  { size: 'XL',  chest: '104–109', waist: '92–97', shoulder: '48–49' },
  { size: '2XL', chest: '110–116', waist: '98–104', shoulder: '50–51' },
];

export default function SizeRecommendation() {
  const { t } = useLanguage();
  const [form, setForm]     = useState({ height: '', weight: '', fit: 'regular', gender: 'women' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fitOptions = [
    { value: 'slim',    label: t('size_slim'),    desc: t('size_slim_desc') },
    { value: 'regular', label: t('size_regular'), desc: t('size_reg_desc') },
    { value: 'relaxed', label: t('size_relaxed'), desc: t('size_rel_desc') },
  ];

  const genderOptions = [
    { value: 'women', label: t('size_women'), emoji: '👗' },
    { value: 'men',   label: t('size_men'),   emoji: '👔' },
  ];

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(computeSize(form));
      setLoading(false);
    }, 1400);
  };

  const reset = () => { setForm((f) => ({ height: '', weight: '', fit: 'regular', gender: f.gender })); setResult(null); };

  const valid = form.height && form.weight && parseFloat(form.height) > 0 && parseFloat(form.weight) > 0;

  return (
    <div className="pt-24 min-h-screen bg-manikan-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SectionHeader
          label={t('size_label')}
          title={t('size_title')}
          subtitle={t('size_sub')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-7 animate-fade-up">
            <h3 className="font-display text-xl text-forest-900 mb-5 flex items-center gap-2">
              <div className="w-9 h-9 bg-forest-50 rounded-xl flex items-center justify-center border border-forest-100">
                <Ruler size={18} className="text-forest-600" />
              </div>
              {t('size_label')}
            </h3>

            {/* Gender selector */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-forest-800 mb-2">{t('size_gender_label')}</label>
              <div className="grid grid-cols-2 gap-2">
                {genderOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { handleChange('gender', opt.value); setResult(null); }}
                    className={`py-3 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                      form.gender === opt.value
                        ? 'border-forest-500 bg-forest-600 text-white shadow-soft'
                        : 'border-manikan-border hover:border-forest-300 bg-white text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-forest-800 mb-2">{t('size_height')}</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="e.g. 165"
                min="140"
                max="210"
                className="w-full px-4 py-3 border border-manikan-border rounded-xl text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-100 transition bg-manikan-muted text-forest-900 placeholder:text-gray-400"
              />
              {form.height && (parseFloat(form.height) < 140 || parseFloat(form.height) > 210) && (
                <p className="text-xs text-red-400 mt-1">{t('size_err_height')}</p>
              )}
            </div>

            {/* Weight */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-forest-800 mb-2">{t('size_weight')}</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="e.g. 60"
                min="35"
                max="200"
                className="w-full px-4 py-3 border border-manikan-border rounded-xl text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-100 transition bg-manikan-muted text-forest-900 placeholder:text-gray-400"
              />
            </div>

            {/* Fit Preference */}
            <div className="mb-7">
              <label className="block text-sm font-medium text-forest-800 mb-2">{t('size_fit_label')}</label>
              <div className="grid grid-cols-3 gap-2">
                {fitOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('fit', opt.value)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      form.fit === opt.value
                        ? 'border-forest-500 bg-forest-50 shadow-soft'
                        : 'border-manikan-border hover:border-forest-200 bg-white'
                    }`}
                  >
                    <p className={`text-sm font-medium ${form.fit === opt.value ? 'text-forest-700' : 'text-gray-700'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!valid || loading}
              fullWidth
              size="lg"
              icon={loading ? null : <Zap size={16} />}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('size_loading')}
                </span>
              ) : t('size_cta')}
            </Button>

            {result && (
              <button onClick={reset} className="mt-3 w-full text-sm text-gray-400 hover:text-forest-600 flex items-center justify-center gap-1.5 transition-colors">
                <RotateCcw size={13} /> {t('size_start_over')}
              </button>
            )}
          </div>

          {/* Result */}
          <div>
            {!result && !loading && (
              <div className="bg-manikan-muted rounded-2xl border border-dashed border-manikan-border h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mb-5 border border-forest-100">
                  <Ruler size={26} className="text-forest-400" />
                </div>
                <p className="font-display text-lg text-forest-800 mb-2">{t('size_awaiting')}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('size_fill')}
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-manikan-border shadow-soft h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mb-5 animate-bounce-gentle border border-forest-100">
                  <Zap size={26} className="text-forest-500" />
                </div>
                <p className="font-display text-lg text-forest-800 mb-2">{t('size_analysing')}</p>
                <p className="text-sm text-gray-500 mb-4">{t('size_ai_calc')}</p>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-forest-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-7 animate-scale-in">
                {/* Top bar */}
                <div className="h-1 -mx-7 -mt-7 mb-5 rounded-t-2xl bg-gradient-to-r from-forest-400 via-gold-400 to-forest-400" />

                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-xl text-forest-900">{t('size_result')}</h3>
                  <Badge color="forest" dot>{t('size_ai_result')}</Badge>
                </div>

                {/* Size boxes */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: t('size_tops'),    size: result.top },
                    { label: t('size_bottoms'), size: result.bottom },
                  ].map((item) => (
                    <div key={item.label} className="bg-forest-50 border border-forest-100 rounded-xl p-4 text-center">
                      <p className="text-xs text-forest-600 font-medium mb-1">{item.label}</p>
                      <p className="text-5xl font-display text-forest-700">{item.size}</p>
                      <Badge color="forest" className="mt-2">{result.fit} {t('size_fit_badge')}</Badge>
                    </div>
                  ))}
                </div>

                {/* Confidence */}
                <div className="mb-5 space-y-2">
                  <ConfidenceBar value={result.confidence} label={t('size_confidence')} color="sage" />
                  <p className="text-xs text-gray-400 flex items-start gap-1">
                    <Info size={11} className="mt-0.5 shrink-0" />
                    {t('size_note')}
                  </p>
                </div>

                {/* Height label */}
                <div className="flex items-center gap-2 mb-5">
                  <Badge color="blue">{result.heightLabel} {t('size_height_val')}</Badge>
                  <span className="text-xs text-gray-400">{t('size_height_det')} {form.height} {t('size_height_cm')}</span>
                </div>

                {/* Tips */}
                <div className="space-y-2 mb-5">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-forest-700 bg-forest-50 rounded-xl p-3 border border-forest-100">
                      <CheckCircle size={12} className="text-forest-500 shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>

                <Button to="/store" variant="outline" fullWidth>
                  {t('size_shop_size')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Size Guide Table */}
        <div className="mt-10 bg-white rounded-2xl border border-manikan-border shadow-soft p-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-display text-lg text-forest-900">
              {form.gender === 'men' ? t('size_guide_men') : t('size_guide_women')}
            </h3>
            <span className="text-xl">{form.gender === 'men' ? '👔' : '👗'}</span>
          </div>
          <div className="overflow-x-auto">
            {form.gender === 'women' ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-start border-b border-manikan-border">
                    <th className="pb-3 text-xs font-semibold text-gray-500 pe-6">{t('size_guide_size')}</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 pe-6">{t('size_guide_chest')}</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 pe-6">{t('size_guide_waist')}</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500">{t('size_guide_hip')}</th>
                  </tr>
                </thead>
                <tbody>
                  {womenSizeGuide.map((row, i) => (
                    <tr key={i} className={`border-b border-manikan-border last:border-0 transition-colors ${result && result.top === row.size ? 'bg-forest-50' : 'hover:bg-manikan-muted'}`}>
                      <td className="py-3 pr-6">
                        <span className={`font-semibold ${result && result.top === row.size ? 'text-forest-600' : 'text-gray-700'}`}>
                          {row.size}
                          {result && result.top === row.size && (
                            <span className="ms-2 text-xs text-gold-500 font-medium">{t('size_your_size')}</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 pr-6 text-gray-500">{row.chest}</td>
                      <td className="py-3 pr-6 text-gray-500">{row.waist}</td>
                      <td className="py-3 text-gray-500">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-start border-b border-manikan-border">
                    <th className="pb-3 text-xs font-semibold text-gray-500 pe-6">{t('size_guide_size')}</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 pe-6">{t('size_guide_chest')}</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500 pe-6">{t('size_guide_waist')}</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500">{t('size_guide_shldr')}</th>
                  </tr>
                </thead>
                <tbody>
                  {menSizeGuide.map((row, i) => (
                    <tr key={i} className={`border-b border-manikan-border last:border-0 transition-colors ${result && result.top === row.size ? 'bg-forest-50' : 'hover:bg-manikan-muted'}`}>
                      <td className="py-3 pr-6">
                        <span className={`font-semibold ${result && result.top === row.size ? 'text-forest-600' : 'text-gray-700'}`}>
                          {row.size}
                          {result && result.top === row.size && (
                            <span className="ml-2 text-xs text-gold-500 font-medium">← Your size</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 pr-6 text-gray-500">{row.chest}</td>
                      <td className="py-3 pr-6 text-gray-500">{row.waist}</td>
                      <td className="py-3 text-gray-500">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
