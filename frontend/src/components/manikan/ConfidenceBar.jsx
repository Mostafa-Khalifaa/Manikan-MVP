import React from 'react';

export default function ConfidenceBar({ value, label, color = 'forest' }) {
  const colors = {
    forest: { bar: 'bg-forest-500',  text: 'text-forest-600',  bg: 'bg-forest-50' },
    sage:   { bar: 'bg-forest-500',  text: 'text-forest-600',  bg: 'bg-forest-50' },
    gold:   { bar: 'bg-gold-500',    text: 'text-gold-600',    bg: 'bg-gold-50' },
    amber:  { bar: 'bg-gold-400',    text: 'text-gold-600',    bg: 'bg-gold-50' },
    blue:   { bar: 'bg-blue-500',    text: 'text-blue-600',    bg: 'bg-blue-50' },
  };
  const c = colors[color] || colors.forest;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className={`font-semibold ${c.text}`}>{value}%</span>
        </div>
      )}
      <div className={`h-2.5 rounded-full ${c.bg} overflow-hidden border border-manikan-border`}>
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
