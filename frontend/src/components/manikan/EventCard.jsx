import React, { useState } from 'react';
import { Calendar, Briefcase, Heart, Star, Coffee, ChevronDown, ChevronUp, CheckCircle, ShoppingBag } from 'lucide-react';
import Badge from './Badge';
import ConfidenceBar from './ConfidenceBar';

const iconMap = {
  briefcase: Briefcase,
  heart:     Heart,
  star:      Star,
  coffee:    Coffee,
  calendar:  Calendar,
};

const colorMap = {
  blue:   'blue',
  rose:   'rose',
  amber:  'sand',
  orange: 'orange',
};

export default function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[event.icon] || Calendar;

  return (
    <div className="bg-white rounded-2xl border border-manikan-border overflow-hidden shadow-soft">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            event.color === 'blue'   ? 'bg-blue-50 text-blue-500' :
            event.color === 'rose'  ? 'bg-rose-50 text-rose-500' :
            event.color === 'amber' ? 'bg-amber-50 text-amber-500' :
            'bg-orange-50 text-orange-500'
          }`}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{event.date} · {event.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge color={colorMap[event.color] || 'gray'}>{event.type}</Badge>
                <span className="text-xs text-gray-400">{event.source}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              <span className="font-medium text-gray-700">Dress code:</span> {event.dresscode} — {event.outfitTip}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-forest-600 hover:text-forest-700 transition-colors"
        >
          {expanded ? 'Hide outfits' : 'See outfit suggestions'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4 space-y-4 animate-fade-in">
          {event.suggestedOutfits.map((outfit, i) => (
            <div key={i} className={`rounded-xl p-4 ${outfit.new ? 'bg-sand-50 border border-sand-200' : 'bg-forest-50 border border-forest-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${outfit.new ? 'text-sand-700' : 'text-forest-700'}`}>
                  {outfit.new ? <span className="flex items-center gap-1"><ShoppingBag size={12} />{outfit.label}</span>
                              : <span className="flex items-center gap-1"><CheckCircle size={12} />{outfit.label}</span>}
                </span>
                <span className={`text-xs font-bold ${outfit.new ? 'text-sand-600' : 'text-forest-600'}`}>
                  {outfit.score}% match
                </span>
              </div>
              <ConfidenceBar value={outfit.score} color={outfit.new ? 'amber' : 'sage'} />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {outfit.items.map((item, j) => (
                  <span key={j} className={`text-xs px-2 py-0.5 rounded-full font-medium ${outfit.new ? 'bg-sand-100 text-sand-700' : 'bg-white text-gray-700 border border-gray-100'}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
