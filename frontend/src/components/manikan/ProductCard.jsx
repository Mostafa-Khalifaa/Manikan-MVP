import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Ruler } from 'lucide-react';
import Badge from './Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { localizeProduct } from '../../data/manikan/products';

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage();
  const localizedProduct = localizeProduct(product, lang);
  return (
    <Link
      to={`/store/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-manikan-border shadow-soft card-hover"
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-manikan-muted relative">
        <img
          src={localizedProduct.images[0]}
          alt={localizedProduct.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {localizedProduct.tags.slice(0, 1).map((tag) => (
            <Badge key={tag} color="forest" className="backdrop-blur-sm shadow-sm">{tag}</Badge>
          ))}
        </div>

        {/* SmartFit badge */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur text-forest-700 text-[10px] font-semibold px-2 py-1 rounded-lg shadow-sm border border-forest-100">
            <Ruler size={10} /> {t('prod_ai_fit')}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium mb-0.5 tracking-wide uppercase">{localizedProduct.brand}</p>
        <h3 className="font-semibold text-forest-900 text-sm leading-snug mb-2.5 group-hover:text-forest-600 transition-colors">
          {localizedProduct.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-semibold text-forest-900">
            {localizedProduct.price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">{t('currency')}</span>
          </span>
          <div className="flex items-center gap-1 text-gold-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs text-gray-600">{localizedProduct.rating}</span>
            <span className="text-xs text-gray-400">({localizedProduct.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">{t('prod_sizes_label')}</span>
          <div className="flex gap-1 flex-wrap">
            {localizedProduct.sizes.slice(0, 4).map((s) => (
              <span key={s} className="text-xs px-1.5 py-0.5 bg-manikan-muted border border-manikan-border rounded text-forest-700 font-medium">
                {s}
              </span>
            ))}
            {localizedProduct.sizes.length > 4 && (
              <span className="text-xs text-gray-400">+{localizedProduct.sizes.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
