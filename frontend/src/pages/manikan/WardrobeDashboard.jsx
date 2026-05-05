import React, { useState } from 'react';
import { Plus, Edit3, Shirt, Tag, Layers, ToggleLeft, ToggleRight } from 'lucide-react';
import { wardrobeItems, outfitCombinations, userProfile } from '../../data/manikan/wardrobe';
import SectionHeader from '../../components/manikan/SectionHeader';
import Badge from '../../components/manikan/Badge';
import Button from '../../components/manikan/Button';
import ConfidenceBar from '../../components/manikan/ConfidenceBar';
import { useLanguage } from '../../contexts/LanguageContext';

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear'];

const getTabLabel = (id, t) => {
  if (id === 'wardrobe') return t('wardrobe_tab_wardrobe');
  if (id === 'outfits') return t('wardrobe_tab_outfits');
  return t('wardrobe_tab_profile');
};

const tabs = [
  { id: 'wardrobe', icon: Shirt },
  { id: 'outfits',  icon: Layers },
  { id: 'profile',  icon: Tag },
];

export default function WardrobeDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab]           = useState('wardrobe');
  const [activeCategory, setActiveCategory] = useState('All');
  const [useWardrobe, setUseWardrobe]       = useState(true);
  const [editProfile, setEditProfile]       = useState(false);

  const filtered = wardrobeItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const getItemsByIds = (ids) => wardrobeItems.filter((w) => ids.includes(w.id));

  return (
    <div className="pt-24 min-h-screen bg-manikan-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em] mb-1.5">{t('wardrobe_header_pre')}</p>
            <h1 className="text-3xl font-display text-forest-900">{t('wardrobe_title')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('wardrobe_hi')}, {userProfile.name} — {wardrobeItems.length} {t('wardrobe_items_saved')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-manikan-border rounded-xl px-4 py-2.5 shadow-soft">
              <span className="text-xs font-medium text-gray-600">{t('wardrobe_use_wardrobe')}</span>
              <button onClick={() => setUseWardrobe(!useWardrobe)}>
                {useWardrobe
                  ? <ToggleRight size={22} className="text-forest-500" />
                  : <ToggleLeft size={22} className="text-gray-300" />}
              </button>
            </div>
            <Button size="sm" icon={<Plus size={14} />}>{t('wardrobe_add_item')}</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-manikan-border rounded-2xl p-1 mb-8 w-fit shadow-soft">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-forest-600 text-white shadow-soft'
                  : 'text-gray-500 hover:text-forest-700 hover:bg-forest-50'
              }`}
            >
              <tab.icon size={14} />
              {getTabLabel(tab.id, t)}
            </button>
          ))}
        </div>

        {/* ── WARDROBE TAB ── */}
        {activeTab === 'wardrobe' && (
          <div className="animate-fade-in">
            {/* Category filter */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-forest-600 text-white shadow-soft'
                      : 'bg-white border border-manikan-border text-gray-600 hover:border-forest-200 hover:text-forest-700'
                  }`}
                >
                  {t(`cat_${cat}`)}
                </button>
              ))}
            </div>

            {/* Item grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-manikan-border overflow-hidden shadow-soft group card-hover">
                  <div className="aspect-square overflow-hidden bg-manikan-muted relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {useWardrobe && (
                      <div className="absolute top-2 right-2">
                        <span className="w-5 h-5 bg-forest-500 rounded-full flex items-center justify-center shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-forest-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.color}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} color="forest" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add placeholder */}
              <button className="bg-manikan-muted rounded-2xl border-2 border-dashed border-manikan-border aspect-square flex flex-col items-center justify-center gap-2 hover:border-forest-400 hover:bg-forest-50 transition-all duration-200 group">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center group-hover:bg-forest-100 transition-colors border border-manikan-border">
                  <Plus size={18} className="text-gray-300 group-hover:text-forest-500 transition-colors" />
                </div>
                <p className="text-xs text-gray-400 group-hover:text-forest-500 transition-colors">{t('wardrobe_add_item')}</p>
              </button>
            </div>
          </div>
        )}

        {/* ── OUTFITS TAB ── */}
        {activeTab === 'outfits' && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-sm text-gray-500">
              {t('wardrobe_outfits_desc')}
            </p>
            {outfitCombinations.map((outfit) => {
              const items = getItemsByIds(outfit.items);
              return (
                <div key={outfit.id} className="bg-white rounded-2xl border border-manikan-border shadow-soft p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg text-forest-900">{outfit.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{t('wardrobe_occasion')} {outfit.occasion}</p>
                    </div>
                    <Badge color="forest">{outfit.confidence}% {t('wardrobe_match')}</Badge>
                  </div>
                  <ConfidenceBar value={outfit.confidence} color="forest" />
                  <div className="flex gap-3 mt-5 flex-wrap">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col items-center gap-1.5">
                        <div className="w-14 h-16 rounded-xl overflow-hidden bg-manikan-muted border border-manikan-border shadow-soft">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[10px] text-gray-500 text-center leading-tight max-w-[56px] truncate">{item.name}</p>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-1.5 justify-center">
                      <button className="w-14 h-16 rounded-xl bg-manikan-muted border-2 border-dashed border-manikan-border flex items-center justify-center hover:border-forest-300 hover:bg-forest-50 transition-colors">
                        <Plus size={14} className="text-gray-300" />
                      </button>
                      <p className="text-[10px] text-gray-400">{t('wardrobe_add_piece')}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-manikan-border flex items-center justify-between">
                    <span className="text-xs text-gray-400">{t('wardrobe_all_owned')}</span>
                    <Button to="/events" size="sm" variant="outline">{t('wardrobe_style_event')}</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Measurements */}
            <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl text-forest-900">{t('wardrobe_measurements')}</h3>
                <button
                  onClick={() => setEditProfile(!editProfile)}
                  className="text-xs text-forest-500 hover:text-forest-700 flex items-center gap-1 font-medium transition-colors"
                >
                  <Edit3 size={12} /> {editProfile ? t('wardrobe_save') : t('wardrobe_edit')}
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: t('wardrobe_height'), value: `${userProfile.height} cm` },
                  { label: t('wardrobe_weight'), value: `${userProfile.weight} kg` },
                  { label: t('wardrobe_top_size'), value: userProfile.topSize },
                  { label: t('wardrobe_bottom_size'), value: userProfile.bottomSize },
                  { label: t('wardrobe_shoe_size'), value: userProfile.shoeSize },
                  { label: t('wardrobe_fit_pref'), value: userProfile.fitPreference },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-manikan-border last:border-0">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    {editProfile
                      ? <input defaultValue={row.value} className="text-sm font-medium text-forest-900 text-right border-b border-forest-300 outline-none bg-transparent w-24" />
                      : <span className="text-sm font-medium text-forest-900">{row.value}</span>}
                  </div>
                ))}
              </div>
              <Button to="/size" variant="outline" fullWidth className="mt-5" size="sm">
                {t('wardrobe_recalc')}
              </Button>
            </div>

            {/* Preferences + Stats */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-manikan-border shadow-soft p-6">
                <h3 className="font-display text-xl text-forest-900 mb-5">{t('wardrobe_style_pref')}</h3>
                <div className="mb-5">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{t('wardrobe_fav_colors')}</p>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.favoriteColors.map((c) => (
                      <Badge key={c} color="forest">{c}</Badge>
                    ))}
                    <button className="text-xs text-gray-400 hover:text-forest-500 flex items-center gap-1 transition-colors">
                      <Plus size={10} /> {t('wardrobe_add')}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{t('wardrobe_style_tags')}</p>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.stylePreferences.map((s) => (
                      <Badge key={s} color="blue">{s}</Badge>
                    ))}
                    <button className="text-xs text-gray-400 hover:text-forest-500 flex items-center gap-1 transition-colors">
                      <Plus size={10} /> {t('wardrobe_add')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wardrobe Stats */}
              <div className="bg-gradient-to-br from-forest-600 to-forest-800 border border-forest-700 rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold text-gold-300 mb-4 uppercase tracking-widest">{t('wardrobe_stats')}</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: t('wardrobe_total_items'),   value: wardrobeItems.length },
                    { label: t('wardrobe_tab_outfits'), value: outfitCombinations.length },
                    { label: t('wardrobe_cost_saved'),    value: `~4K ${t('currency')}` },
                  ].map((s, i) => (
                    <div key={i}>
                      <p className="text-2xl font-display text-gold-200">{s.value}</p>
                      <p className="text-[10px] text-forest-300 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
