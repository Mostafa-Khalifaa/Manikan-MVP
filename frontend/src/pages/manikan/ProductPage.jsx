import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingBag, ChevronRight, Check, Ruler } from 'lucide-react';
import { getProductById, products, localizeProduct } from '../../data/manikan/products';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/manikan/Button';
import Badge from '../../components/manikan/Badge';
import ProductCard from '../../components/manikan/ProductCard';
import ManikanWidget from '../../components/manikan/ManikanWidget';

export default function ProductPage() {
  const { t, lang }       = useLanguage();
  const { id }            = useParams();
  const navigate          = useNavigate();
  const rawProduct        = getProductById(id);
  const product           = localizeProduct(rawProduct, lang);
  const [activeImg, setActiveImg]     = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [wishlist, setWishlist]       = useState(false);
  const [added, setAdded]             = useState(false);

  if (!product) return (
    <div className="pt-32 text-center">
      <p className="text-gray-500">{t('prod_not_found')}</p>
      <Button to="/store" variant="secondary" className="mt-4">{t('prod_back_store')}</Button>
    </div>
  );

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/store" className="hover:text-gray-600 flex items-center gap-1">
            <ArrowLeft size={14} className={lang === 'ar' ? 'rotate-180' : ''} /> {t('nav_store')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-500">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 items-start">
          {/* Images — smaller column */}
          <div className="space-y-2">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-warm-border">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-sage-500' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-400 font-medium">{product.brand}</p>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`p-2 rounded-xl transition-all ${wishlist ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'}`}
              >
                <Heart size={18} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} {t('prod_reviews')})</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-semibold text-gray-900">{product.price.toLocaleString()} {t('currency')}</span>
              <Badge color="sage" dot>{t('prod_in_stock')}</Badge>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">{product.description}</p>

            <div className="space-y-1 text-sm text-gray-500 mb-6">
              <p><span className="font-medium text-gray-700">{t('prod_fabric')}</span> {product.fabric}</p>
              <p><span className="font-medium text-gray-700">{t('prod_fit')}</span> {product.fit}</p>
              <p><span className="font-medium text-gray-700">{t('prod_category')}</span> {product.category}</p>
            </div>

            {/* Colors */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">{t('prod_colour')} <span className="text-gray-500 font-normal">{selectedColor || t('prod_select')}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 rounded-lg border text-sm transition-all ${
                      selectedColor === c
                        ? 'border-sage-500 bg-sage-50 text-sage-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">{t('prod_size')} <span className="text-gray-500 font-normal">{selectedSize || t('prod_select')}</span></p>
                <Link to="/size" className="text-xs text-sage-500 hover:text-sage-600 flex items-center gap-1 font-medium">
                  <Ruler size={12} /> {t('prod_size_guide')}
                </Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-xl border text-sm font-medium transition-all ${
                      selectedSize === s
                        ? 'border-sage-500 bg-sage-500 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-sage-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Manikan Virtual Try-On Widget */}
            <div className="mb-5">
              <ManikanWidget product={product} />
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                onClick={handleAdd}
                size="lg"
                fullWidth
                icon={added ? <Check size={18} /> : <ShoppingBag size={18} />}
                className={added ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
              >
                {added ? t('prod_added_to_bag') : t('prod_add_to_bag')}
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {product.tags.map((tag) => (
                <Badge key={tag} color="gray">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl text-gray-900 mb-6">{t('prod_more_from')} {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
