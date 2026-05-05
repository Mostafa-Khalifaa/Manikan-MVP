import React, { useState } from 'react';
import { Check, HelpCircle, Zap, ArrowRight, Star } from 'lucide-react';
import SectionHeader from '../../components/manikan/SectionHeader';
import Button from '../../components/manikan/Button';
import Badge from '../../components/manikan/Badge';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useLanguage();

  const plans = [
    {
      nameKey: 'plan_starter',
      price: 'Free',
      period: null,
      descKey: 'plan_starter_desc',
      ctaKey: 'pricing_start',
      icon: '🌱',
      features: [
        t('pricing_feat_s1') || 'Up to 500 size recommendations / month',
        t('pricing_feat_s2') || 'Size Finder widget (1 storefront)',
        t('pricing_feat_s3') || 'Basic fit analytics dashboard',
        t('pricing_feat_s4') || 'Email support',
        t('pricing_feat_s5') || 'Works with Shopify & WooCommerce',
      ],
    },
    {
      nameKey: 'plan_growth',
      price: '799',
      period: 'month',
      descKey: 'plan_growth_desc',
      ctaKey: 'pricing_start',
      icon: '🚀',
      features: [
        t('pricing_feat_g1') || 'Up to 10,000 recommendations / month',
        t('pricing_feat_g2') || 'Multi-storefront widget (up to 3)',
        t('pricing_feat_g3') || 'Event-based styling suggestions',
        t('pricing_feat_g4') || 'Wardrobe integration module',
        t('pricing_feat_g5') || 'Full analytics & return driver reports',
        t('pricing_feat_g6') || 'Priority support + onboarding call',
        t('pricing_feat_g7') || 'Shopify, WooCommerce, Salla, Zid',
      ],
    },
    {
      nameKey: 'plan_scale',
      price: '2,499',
      period: 'month',
      descKey: 'plan_scale_desc',
      ctaKey: 'pricing_contact',
      icon: '🏆',
      features: [
        t('pricing_feat_sc1') || 'Unlimited recommendations',
        t('pricing_feat_sc2') || 'Unlimited storefronts',
        t('pricing_feat_sc3') || 'Custom AI model per brand sizing',
        t('pricing_feat_sc4') || 'Advanced visualisation (try-on)',
        t('pricing_feat_sc5') || 'Dedicated account manager',
        t('pricing_feat_sc6') || 'SLA-backed uptime (99.9%)',
        t('pricing_feat_sc7') || 'Custom integrations & API access',
        t('pricing_feat_sc8') || 'White-label widget option',
      ],
    },
  ];

  const payPerUse = [
    { action: t('ppu_action_1'), price: `0.15 ${t('currency')}`, unit: t('ppu_unit_1') },
    { action: t('ppu_action_2'),  price: `0.30 ${t('currency')}`, unit: t('ppu_unit_2') },
    { action: t('ppu_action_3'),    price: `1.50 ${t('currency')}`, unit: t('ppu_unit_3') },
    { action: t('ppu_action_4'),  price: `0.05 ${t('currency')}`, unit: t('ppu_unit_4') },
  ];

  const faqs = [
    {
      q: t('faq_1_q'),
      a: t('faq_1_a'),
    },
    {
      q: t('faq_2_q'),
      a: t('faq_2_a'),
    },
    {
      q: t('faq_3_q'),
      a: t('faq_3_a'),
    },
    {
      q: t('faq_4_q'),
      a: t('faq_4_a'),
    },
    {
      q: t('faq_5_q'),
      a: t('faq_5_a'),
    },
  ];

  const currency = t('pricing_currency');

  return (
    <div className="pt-24 min-h-screen bg-manikan-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="text-center mb-14">
          <SectionHeader
            label={t('nav_pricing')}
            title={t('pricing_title')}
            subtitle={t('pricing_sub')}
            center
          />

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium transition-colors ${billing === 'monthly' ? 'text-forest-800' : 'text-gray-400'}`}>{t('pricing_monthly')}</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${billing === 'annual' ? 'bg-forest-500' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 ${t('dir') === 'rtl' ? 'right-0.5' : 'left-0.5'} w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${billing === 'annual' ? (t('dir') === 'rtl' ? '-translate-x-6' : 'translate-x-6') : ''}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${billing === 'annual' ? 'text-forest-800' : 'text-gray-400'}`}>
              {t('pricing_annual')}
              <Badge color="gold" className="ms-2 align-middle">{t('pricing_save_20')}</Badge>
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 items-start">
          {plans.map((plan, i) => {
            const isHighlight = i === 1;
            const rawPrice = plan.price === 'Free' ? plan.price : plan.price;
            const displayPrice = billing === 'annual' && plan.price !== 'Free'
              ? Math.round(parseInt(plan.price.replace(',', '')) * 0.8).toLocaleString()
              : plan.price;

            return (
              <div
                key={plan.nameKey}
                className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                  isHighlight
                    ? 'bg-forest-800 text-white shadow-lift md:scale-[1.04] animate-glow-pulse'
                    : 'bg-white border border-manikan-border shadow-soft card-hover'
                }`}
              >
                {/* Gradient top on highlight */}
                {isHighlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-forest-400 via-gold-400 to-forest-400" />
                )}

                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-400 text-forest-900 text-xs font-semibold px-4 py-1 rounded-full shadow-gold flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {t('pricing_popular')}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{plan.icon}</span>
                    <p className={`text-sm font-semibold tracking-wide ${isHighlight ? 'text-gold-300' : 'text-forest-600'}`}>{t(plan.nameKey)}</p>
                  </div>
                  <div className="flex items-end gap-1.5 mb-2">
                    {plan.price !== 'Free' && (
                      <span className={`text-sm ${isHighlight ? 'text-forest-300' : 'text-gray-400'}`}>{currency}</span>
                    )}
                    <span className={`text-4xl font-display ${isHighlight ? 'text-white' : 'text-forest-900'}`}>
                      {plan.price === 'Free' ? t('pricing_free') : displayPrice}
                    </span>
                    {plan.period && (
                      <span className={`text-sm mb-1 ${isHighlight ? 'text-forest-300' : 'text-gray-400'}`}>{t('pricing_month')}</span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${isHighlight ? 'text-forest-200' : 'text-gray-500'}`}>{t(plan.descKey)}</p>
                </div>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check size={14} className={`mt-0.5 shrink-0 ${isHighlight ? 'text-gold-300' : 'text-forest-500'}`} />
                      <span className={`text-sm ${isHighlight ? 'text-forest-100' : 'text-gray-600'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  to="/business"
                  variant={isHighlight ? 'gold' : 'primary'}
                  fullWidth
                  size="md"
                >
                  {t(plan.ctaKey)}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Pay per use */}
        <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-7 mb-16">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-2xl text-forest-900">{t('pricing_ppu_title')}</h2>
            <Badge color="gold">{t('pricing_flexible')}</Badge>
          </div>
          <p className="text-sm text-gray-500 mb-6">{t('pricing_ppu_sub')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {payPerUse.map((item, i) => (
              <div key={i} className="bg-manikan-muted rounded-xl border border-manikan-border p-5 card-hover">
                <p className="text-xs text-gray-500 mb-2">{item.action}</p>
                <p className="text-xl font-display text-forest-700">{item.price}</p>
                <p className="text-xs text-gray-400 mt-1">{item.unit}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">{t('pricing_billed')} {currency}.</p>
        </div>

        {/* FAQ */}
        <SectionHeader label="FAQ" title={t('pricing_faq_title')} center />
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-manikan-border shadow-soft overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-start hover:bg-forest-50 transition-colors"
              >
                <span className="text-sm font-medium text-forest-900 flex items-center gap-2">
                  <HelpCircle size={14} className="text-gold-400 shrink-0" />
                  {faq.q}
                </span>
                <span className={`text-forest-400 text-lg leading-none transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 animate-fade-in border-t border-manikan-border">
                  <p className="text-sm text-gray-500 leading-relaxed pt-4 ps-[22px]">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl border border-manikan-border shadow-card p-10 max-w-xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400" />
            <div className="w-14 h-14 rounded-xl bg-forest-700 flex items-center justify-center mx-auto mb-5 shadow-soft">
              <span className="font-display text-white text-2xl font-bold leading-none">M</span>
            </div>
            <h2 className="font-display text-3xl text-forest-900 mb-2">{t('pricing_cta_title')}</h2>
            <p className="text-sm text-gray-500 mb-7">{t('pricing_cta_sub')}</p>
            <Button to="/business" size="lg" fullWidth>{t('pricing_cta_btn')}</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
