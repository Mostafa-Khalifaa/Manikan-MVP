import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t('footer_product')]: [
      { label: t('footer_demo'), path: '/store' },
      { label: t('footer_size'), path: '/size' },
      { label: t('footer_styling'), path: '/events' },
      { label: t('footer_wardrobe'), path: '/wardrobe' },
      { label: t('footer_visual'), path: '/visualize' },
    ],
    [t('footer_biz')]: [
      { label: t('footer_retail'), path: '/business' },
      { label: t('footer_pricing'), path: '/pricing' },
      { label: t('footer_api'), path: '/business' },
      { label: t('footer_cases'), path: '/business' },
    ],
    [t('footer_company')]: [
      { label: t('footer_about'), path: '/' },
      { label: t('footer_blog'), path: '/' },
      { label: t('footer_careers'), path: '/' },
      { label: t('footer_contact'), path: '/' },
    ],
  };

  return (
    <footer className="bg-forest-950 mt-0">
      {/* Top gradient accent */}
      <div className="h-1 bg-gradient-to-r from-forest-500 via-gold-400 to-forest-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand — wordmark only */}
          <div className="md:col-span-2">
            <Link to="/" className="block mb-5 w-fit">
              <img src="/logo.png" className="h-20 w-auto object-contain" alt="Manikan" />
            </Link>

            <p className="text-sm text-forest-300 leading-relaxed max-w-xs mb-6">
              {t('footer_desc')}
            </p>

            <div className="flex items-center gap-4">
              {[
                { icon: Mail, href: 'mailto:hello@manikan.io', label: 'Email' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Instagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-forest-400 hover:text-white hover:bg-forest-700 transition-all border border-forest-700"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-forest-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forest-500">{t('footer_copy')}</p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-forest-600">{t('footer_mock')}</p>
            <div className="flex items-center gap-1.5 text-xs text-forest-500">
              <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-pulse" />
              {t('footer_ai')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
