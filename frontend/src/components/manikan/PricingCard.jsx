import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

export default function PricingCard({ plan, highlight }) {
  return (
    <div className={`relative rounded-2xl p-7 flex flex-col transition-all duration-200 ${
      highlight
        ? 'bg-forest-600 text-white shadow-lift scale-[1.02]'
        : 'bg-white border border-manikan-border shadow-soft hover:shadow-card'
    }`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-sand-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-6">
        <p className={`text-sm font-semibold mb-1 ${highlight ? 'text-forest-100' : 'text-forest-600'}`}>{plan.name}</p>
        <div className="flex items-end gap-1">
          <span className={`text-4xl font-display ${highlight ? 'text-white' : 'text-gray-900'}`}>
            {plan.price}
          </span>
          {plan.period && (
            <span className={`text-sm mb-1 ${highlight ? 'text-forest-200' : 'text-gray-400'}`}>
              / {plan.period}
            </span>
          )}
        </div>
        <p className={`text-sm mt-2 ${highlight ? 'text-forest-100' : 'text-gray-500'}`}>{plan.description}</p>
      </div>

      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check size={15} className={`mt-0.5 shrink-0 ${highlight ? 'text-forest-200' : 'text-forest-600'}`} />
            <span className={`text-sm ${highlight ? 'text-sage-50' : 'text-gray-600'}`}>{feat}</span>
          </li>
        ))}
      </ul>

      <Button
        to="/business"
        variant={highlight ? 'secondary' : 'primary'}
        fullWidth
      >
        {plan.cta}
      </Button>
    </div>
  );
}
