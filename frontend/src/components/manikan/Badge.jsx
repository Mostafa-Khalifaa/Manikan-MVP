import React from 'react';

const colors = {
  forest: 'bg-forest-50 text-forest-700 border-forest-100',
  gold:   'bg-gold-50 text-gold-700 border-gold-100',
  sage:   'bg-forest-50 text-forest-700 border-forest-100',
  sand:   'bg-gold-50 text-gold-700 border-gold-100',
  blue:   'bg-blue-50 text-blue-700 border-blue-100',
  rose:   'bg-rose-50 text-rose-700 border-rose-100',
  gray:   'bg-gray-100 text-gray-600 border-gray-200',
  green:  'bg-forest-50 text-forest-700 border-forest-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
};

const dotColors = {
  forest: 'bg-forest-500',
  gold:   'bg-gold-500',
  sage:   'bg-forest-500',
  sand:   'bg-gold-500',
  blue:   'bg-blue-500',
  rose:   'bg-rose-500',
  gray:   'bg-gray-400',
  green:  'bg-forest-500',
  orange: 'bg-orange-500',
};

export default function Badge({ children, color = 'gray', className = '', dot }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.gray} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color] || dotColors.gray}`} />
      )}
      {children}
    </span>
  );
}
