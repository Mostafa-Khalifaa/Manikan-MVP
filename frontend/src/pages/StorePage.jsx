import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'

/* ─────────────────────────────────────────────────────────────────────────
   Store Page — Premium dark-themed e-commerce product grid
   Now accessible at /store (linked from Manikan marketing site)
   ───────────────────────────────────────────────────────────────────────── */
export default function StorePage() {
  return (
    <div className="store-page pt-24">



      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <header className="store-hero">
        <div className="store-hero-bg" />
        <div className="store-hero-content">
          <div className="store-brand">
            <div>
              <h1 className="store-title">THREADCRAFT</h1>
              <p className="store-subtitle">Premium Essentials</p>
            </div>
          </div>
          <p className="store-tagline">Elevated basics crafted from the finest organic cotton. Each piece designed for the perfect fit.</p>
          <div className="store-hero-badge">
            <div className="manikan-badge-dot" />
            <span>Powered by <strong>Manikan</strong> Virtual Try-On</span>
          </div>
        </div>
      </header>

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      <section className="store-section">
        <div className="store-section-header">
          <h2 className="store-section-title">T-Shirt Collection</h2>
          <p className="store-section-desc">{PRODUCTS.length} styles available · Try on with AI-powered body visualization</p>
        </div>

        <div className="product-grid">
          {PRODUCTS.map((product, index) => (
            <Link
              key={product.id}
              to={`/store/${product.id}`}
              className="product-card"
              style={{ animationDelay: `${index * 80}ms` }}
              id={`product-card-${product.id}`}
            >
              {/* Product Image */}
              <div className="product-card-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-image"
                  loading="lazy"
                />
                <div className="product-card-overlay">
                  <span className="product-card-cta">View Details</span>
                </div>
                {/* Manikan badge */}
                <div className="product-card-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Try On
                </div>
              </div>

              {/* Product Info */}
              <div className="product-card-info">
                <div className="product-card-color-dot" style={{ background: product.color_hex }} />
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-color-name">{product.color_name}</p>
                <div className="product-card-bottom">
                  <span className="product-card-price">{product.price.toFixed(2)} EGP</span>
                  <span className="product-card-sizes">
                    {Object.keys(product.sizes).join(' · ')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
