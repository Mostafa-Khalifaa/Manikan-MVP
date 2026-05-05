import React, { useState } from 'react';
import { Code2, BarChart3, Ruler, Zap, Shield, ArrowRight, Copy, Check, Globe, Layers } from 'lucide-react';
import Button from '../../components/manikan/Button';
import SectionHeader from '../../components/manikan/SectionHeader';
import Badge from '../../components/manikan/Badge';
import ConfidenceBar from '../../components/manikan/ConfidenceBar';
import { useLanguage } from '../../contexts/LanguageContext';

const widgetSnippet = `<!-- Manikan Widget — Add to your product page -->
<script src="https://cdn.manikan.io/widget.js"
  data-brand-id="YOUR_BRAND_ID"
  data-product-id="{{ product.id }}"
  data-currency="EGP"
  data-locale="en">
</script>

<!-- Size Finder button renders automatically -->
<!-- Customize via CSS variables: -->
<style>
  :root {
    --sf-primary: #2D6A4F;
    --sf-radius: 12px;
    --sf-font: inherit;
  }
</style>`;

const apiSnippet = `// Measurement API — Node.js example
const Manikan = require('@manikan/sdk');

const sf = new Manikan({ apiKey: 'sk_live_xxx' });

const result = await sf.size.recommend({
  height: 165,   // cm
  weight: 60,    // kg
  fit: 'regular',
  brandId: 'forma-basics',
  productId: 'shirt-001',
});

console.log(result);
// → { size: 'M', confidence: 0.94, topSize: 'M', bottomSize: 'M' }`;

const capabilities = [
  {
    icon: Ruler,
    title: 'Measurement AI',
    desc: 'Trained on 2M+ fitting sessions across 40+ local brands. Predicts size with 94% accuracy.',
    badge: '94% accuracy',
    badgeColor: 'forest',
  },
  {
    icon: Code2,
    title: 'Embeddable Widget',
    desc: 'One script tag. Works with Shopify, WooCommerce, Salla, Zid, and custom storefronts.',
    badge: 'Any platform',
    badgeColor: 'blue',
  },
  {
    icon: Globe,
    title: 'Event Styling API',
    desc: 'Push outfit recommendations based on calendar events, holidays, and trending occasions.',
    badge: 'New',
    badgeColor: 'sand',
  },
  {
    icon: BarChart3,
    title: 'Retailer Analytics',
    desc: 'Return driver reports, size distribution data, conversion by fit type — all in one dashboard.',
    badge: 'Dashboard',
    badgeColor: 'gray',
  },
  {
    icon: Layers,
    title: 'Wardrobe Integration',
    desc: 'Let customers build a wardrobe on your platform — increasing loyalty, session time, and repeat orders.',
    badge: 'Engagement',
    badgeColor: 'rose',
  },
  {
    icon: Shield,
    title: 'Privacy by Design',
    desc: 'No photo storage. GDPR & PDPA compliant. Measurement data belongs to the shopper.',
    badge: 'GDPR',
    badgeColor: 'green',
  },
];

const metrics = [
  { value: '−42%',  label: 'Average return rate reduction' },
  { value: '+28%',  label: 'Conversion rate uplift' },
  { value: '94%',   label: 'Size prediction accuracy' },
  { value: '3.2×',  label: 'Higher customer lifetime value' },
];

const integrations = ['Shopify', 'WooCommerce', 'Salla', 'Zid', 'Magento', 'Custom API'];

export default function BusinessPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('widget');
  const [copied, setCopied]       = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge color="blue" className="mb-4">{t('nav_for_biz')}</Badge>
          <h1 className="text-4xl sm:text-5xl text-forest-900 mb-4">
            {t('ben_1').split('up')[0]}<br />
            <span className="text-forest-600">{t('pricing_cta_sub')}</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
            Manikan is a plug-and-play sizing and styling platform built for local and mid-tier fashion brands. No ML team required. Results in days, not months.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button to="/pricing" size="lg" icon={<Zap size={16} />}>{t('pricing_start')}</Button>
            <Button variant="secondary" size="lg" iconRight={<ArrowRight size={15} />} to="/store">
              {t('store_title')}
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-manikan-border shadow-soft p-5 text-center">
              <p className="text-3xl font-display text-forest-600 mb-1">{m.value}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <SectionHeader label={t('nav_business')} title={t('feat_4_title')} subtitle={t('feat_4_desc')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {capabilities.map((cap, i) => (
            <div key={i} className="bg-white rounded-2xl border border-manikan-border shadow-soft p-5 hover:shadow-card transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-forest-50 rounded-xl flex items-center justify-center">
                  <cap.icon size={18} className="text-forest-600" />
                </div>
                <Badge color={cap.badgeColor}>{cap.badge}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{cap.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* Code Integration Section */}
        <div className="bg-white rounded-2xl border border-manikan-border shadow-soft overflow-hidden mb-16">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Integration</h3>
              <p className="text-xs text-gray-400 mt-0.5">Drop SmartFit into your store in minutes</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {[{ id: 'widget', label: 'Widget' }, { id: 'api', label: 'API' }].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="bg-forest-950 text-gray-300 text-xs leading-relaxed p-6 overflow-x-auto font-mono">
              <code>{activeTab === 'widget' ? widgetSnippet : apiSnippet}</code>
            </pre>
            <button
              onClick={() => handleCopy(activeTab === 'widget' ? widgetSnippet : apiSnippet)}
              className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied ? 'bg-forest-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Zap size={11} className="text-forest-400" />
              Works with: {integrations.join(' · ')}
            </p>
          </div>
        </div>

        {/* Results demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Before SmartFit</h3>
            <div className="space-y-3">
              {[
                { label: 'Return Rate',       value: 34, color: 'amber' },
                { label: 'Size Accuracy',     value: 58, color: 'amber' },
                { label: 'Conversion Rate',   value: 2.4, color: 'amber' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{m.label}</span>
                    <span className="font-semibold text-amber-600">{m.value}%</span>
                  </div>
                  <div className="h-2 bg-amber-50 rounded-full">
                    <div className="h-full bg-amber-300 rounded-full" style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-forest-100 shadow-soft p-6">
            <h3 className="font-semibold text-forest-700 mb-4 text-sm">After SmartFit — Month 1</h3>
            <div className="space-y-3">
              {[
                { label: 'Return Rate (↓)',     value: 19, color: 'sage' },
                { label: 'Size Accuracy (↑)',   value: 94, color: 'sage' },
                { label: 'Conversion Rate (↑)', value: 3.8, color: 'sage' },
              ].map((m, i) => (
                <ConfidenceBar key={i} label={m.label} value={m.value} color="forest" />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-forest-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl mb-3">{t('pricing_cta_title')}</h2>
          <p className="text-forest-100 mb-7 max-w-md mx-auto text-sm leading-relaxed">
            {t('pricing_cta_sub')}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button to="/pricing" variant="secondary" size="lg">{t('pricing_start')}</Button>
            <Button variant="ghost" size="lg" className="text-white border border-white/30 hover:bg-white/10">
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
