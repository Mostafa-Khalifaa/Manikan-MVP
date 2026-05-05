import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products } from '../../data/manikan/products';
import ProductCard from '../../components/manikan/ProductCard';
import SectionHeader from '../../components/manikan/SectionHeader';
import Badge from '../../components/manikan/Badge';
import { useLanguage } from '../../contexts/LanguageContext';

// Products that are men-focused by category/name pattern
const isMensProduct = (p) => {
  const menKeywords = ['chino', 'trouser', 'blazer', 'shirt'];
  return menKeywords.some((kw) => p.name.toLowerCase().includes(kw));
};
const isWomensProduct = (p) => ['Dresses'].includes(p.category);

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];
const categoryKeys = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear'];

const getSortKey = (sortStr) => 'sort_' + sortStr.replace(/[^a-zA-Z]/g, '');

export default function StorePage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy]               = useState('Featured');
  const [search, setSearch]               = useState('');
  const [activeGender, setActiveGender]   = useState('all');

  const genders = [
    { value: 'all',   label: t('store_gender_all') },
    { value: 'women', label: t('store_women') },
    { value: 'men',   label: t('store_men') },
  ];

  const filtered = products
    .filter((p) => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
      const matchGender = activeGender === 'all'
        || (activeGender === 'men'   && !isWomensProduct(p))
        || (activeGender === 'women' && !isMensProduct(p));
      return matchCat && matchSearch && matchGender;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High')  return a.price - b.price;
      if (sortBy === 'Price: High to Low')  return b.price - a.price;
      if (sortBy === 'Top Rated')           return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="pt-20 min-h-screen bg-manikan-bg">
      {/* Header */}
      <div className="bg-white border-b border-manikan-border px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-forest-50 border border-forest-100 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-forest-600 tracking-wide">{t('store_title')}</span>
          </div>
          <SectionHeader
            label=""
            title={t('store_title')}
            subtitle={t('store_sub')}
          />

          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('store_search')}
                className="w-full ps-9 pe-4 py-2.5 border border-manikan-border rounded-xl text-sm bg-manikan-muted focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-100 transition"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-manikan-border rounded-xl text-sm px-3 py-2.5 bg-white focus:outline-none focus:border-forest-400 transition text-forest-800"
              >
                {sortOptions.map((o) => <option key={o} value={o}>{t(getSortKey(o))}</option>)}
              </select>
            </div>
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-2 mt-5 mb-1">
            {genders.map((g) => (
              <button
                key={g.value}
                onClick={() => setActiveGender(g.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeGender === g.value
                    ? 'bg-forest-800 text-white shadow-soft'
                    : 'bg-white border border-manikan-border text-gray-600 hover:border-forest-200 hover:text-forest-700'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-forest-600 text-white shadow-soft'
                    : 'bg-white border border-manikan-border text-gray-600 hover:border-forest-200 hover:text-forest-700'
                }`}
              >
                {t(`cat_${cat}`)}
              </button>
            ))}
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <X size={12} /> {t('store_clear')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{filtered.length} {t('nav_store')}</p>
          <Badge color="forest" dot>{t('store_ai_fit')}</Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-sm">{t('store_no_results')}</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-3 text-sm text-forest-500 hover:underline">
              {t('store_clear')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
