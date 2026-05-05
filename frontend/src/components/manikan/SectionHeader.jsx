import React from 'react';

export default function SectionHeader({ label, title, subtitle, center = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {label && (
        <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-500" />
          <span className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">
            {label}
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-500" />
        </div>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display text-forest-900 leading-tight text-balance ${center ? 'max-w-2xl mx-auto' : ''}`}>
        {title}
      </h2>
      {/* Sand Tan accent line below title */}
      <div className={`mt-4 h-0.5 w-12 bg-gold-400 rounded-full ${center ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className={`mt-4 text-gray-500 leading-relaxed ${center ? 'max-w-xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
