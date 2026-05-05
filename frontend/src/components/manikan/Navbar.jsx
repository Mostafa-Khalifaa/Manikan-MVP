import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, lang, toggleLang } = useLanguage();

  const navLinks = [
    { label: t('nav_store'), path: '/store' },
    { label: t('nav_size'), path: '/size' },
    { label: t('nav_styling'), path: '/events' },
    { label: t('nav_wardrobe'), path: '/wardrobe' },
    { label: t('nav_business'), path: '/business' },
    { label: t('nav_pricing'), path: '/pricing' },
  ];

  // /store = engine store, /engine = raw avatar generator

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass border-b border-manikan-border shadow-soft' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo — wordmark */}
          <Link to="/" className="shrink-0">
            <img src="/logo.png" className="h-24 w-auto object-contain" alt="Manikan" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(link.path) ? 'text-forest-700' : 'text-gray-600 hover:text-forest-700'
                  }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold-500 rounded-full transition-all duration-300 ${isActive(link.path) ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                  }`} />
              </Link>
            ))}
          </nav>

          {/* CTA + Language toggle */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-manikan-border text-sm font-medium text-forest-700 hover:bg-forest-50 hover:border-forest-200 transition-all"
            >
              <Globe size={14} />
              <span className="font-semibold">{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Avatar Engine — direct link */}
            <Link
              to="/engine"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-accent-bright border border-accent/20 bg-accent/5 rounded-xl hover:bg-accent/10 transition-all"
              style={{ color: '#6366f1' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('nav_try_demo')} →
            </Link>

            <Link
              to="/business"
              className="px-5 py-2.5 bg-gold-400 text-forest-900 text-sm font-semibold rounded-xl hover:bg-gold-500 transition-all duration-200 shadow-gold hover:shadow-md"
            >
              {t('nav_for_biz')}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-xl text-forest-700 hover:bg-forest-50 transition-colors border border-manikan-border"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-manikan-border px-4 pb-5 pt-3 shadow-card animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${isActive(link.path)
                ? 'bg-forest-50 text-forest-700 border border-forest-100'
                : 'text-gray-700 hover:bg-forest-50 hover:text-forest-700'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-manikan-border">
            <button
              onClick={toggleLang}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-manikan-border rounded-xl text-sm font-medium text-forest-700 hover:bg-forest-50 transition-colors"
            >
              <Globe size={14} />
              {lang === 'en' ? 'عربي' : 'English'}
            </button>
            <Link
              to="/business"
              className="w-full text-center px-4 py-2.5 bg-gold-400 text-forest-900 rounded-xl text-sm font-semibold hover:bg-gold-500 transition-colors"
            >
              {t('nav_for_biz')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
