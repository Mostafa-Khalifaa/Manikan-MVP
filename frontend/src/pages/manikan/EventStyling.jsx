import React, { useState } from 'react';
import { Calendar, RefreshCw, Plus, Globe, CalendarCheck } from 'lucide-react';
import { upcomingEvents } from '../../data/manikan/events';
import EventCard from '../../components/manikan/EventCard';
import SectionHeader from '../../components/manikan/SectionHeader';
import Badge from '../../components/manikan/Badge';
import Button from '../../components/manikan/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const calendarSources = [
  { id: 'google',  label: 'Google Calendar', icon: Calendar,        connected: true,  color: 'blue'  },
  { id: 'global',  label: 'Global Holidays',  icon: Globe,         connected: true,  color: 'sage'  },
  { id: 'outlook', label: 'Outlook',          icon: CalendarCheck, connected: false, color: 'gray'  },
  { id: 'apple',   label: 'Apple Calendar',   icon: CalendarCheck, connected: false, color: 'gray'  },
];

const typeColors = {
  'Work Meeting':   'blue',
  'Wedding':        'rose',
  'Holiday':        'sand',
  'Casual Outing':  'orange',
};

export default function EventStyling() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [useWardrobe, setUseWardrobe]   = useState(true);

  const getEventTypeKey = (type) => 'event_type_' + type.replace(/\s+/g, '_');

  const types   = ['All', ...new Set(upcomingEvents.map((e) => e.type))];
  const filtered = activeFilter === 'All'
    ? upcomingEvents
    : upcomingEvents.filter((e) => e.type === activeFilter);

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SectionHeader
          label="Smart Event Styling"
          title={t('event_title')}
          subtitle={t('event_subtitle')}
        />

        {/* Calendar connections */}
        <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{t('event_calendars')}</h3>
            <button className="text-xs text-forest-600 hover:text-forest-600 flex items-center gap-1 font-medium">
              <Plus size={12} /> {t('event_add_calendar')}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {calendarSources.map((cal) => (
              <div
                key={cal.id}
                className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                  cal.connected ? 'border-forest-100 bg-forest-50' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cal.connected ? 'bg-forest-100' : 'bg-gray-100'}`}>
                  <cal.icon size={14} className={cal.connected ? 'text-forest-600' : 'text-gray-400'} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{cal.label}</p>
                  <p className={`text-xs ${cal.connected ? 'text-forest-600' : 'text-gray-400'}`}>
                    {cal.connected ? t('event_connected') : t('event_connect')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === type
                    ? 'bg-forest-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t(getEventTypeKey(type))}
              </button>
            ))}
          </div>

          {/* Wardrobe toggle */}
          <div className="flex items-center gap-2.5 bg-white border border-manikan-border rounded-xl px-4 py-2.5 shadow-soft shrink-0">
            <span className="text-xs font-medium text-gray-600">{t('event_use_wardrobe')}</span>
            <button
              onClick={() => setUseWardrobe(!useWardrobe)}
              className={`relative w-9 h-5 rounded-full transition-colors ${useWardrobe ? 'bg-forest-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useWardrobe ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        </div>

        {useWardrobe && (
          <div className="bg-forest-50 border border-forest-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5 text-sm text-forest-700">
            <RefreshCw size={14} className="shrink-0" />
            {t('event_wardrobe_mode_on')}
          </div>
        )}

        {/* Events */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-manikan-border">
              <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">{t('event_no_events')}</p>
            </div>
          ) : (
            filtered.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>

        {/* Add event prompt */}
        <div className="mt-8 bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500 mb-3">{t('event_manual_prompt')}</p>
          <Button variant="secondary" icon={<Plus size={15} />} size="sm">
            {t('event_add_manual')}
          </Button>
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { label: t('event_stat1_label'), value: '8', sub: t('event_stat1_sub') },
            { label: t('event_stat2_label'),  value: '3', sub: t('event_stat2_sub') },
            { label: t('event_stat3_label'), value: `2,100 ${t('currency')}`, sub: t('event_stat3_sub') },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-manikan-border shadow-soft p-4 text-center">
              <p className="text-2xl font-display text-forest-600">{s.value}</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
