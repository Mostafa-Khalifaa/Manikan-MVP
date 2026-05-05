import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary:   'bg-forest-600 text-white hover:bg-forest-700 shadow-soft hover:shadow-card btn-glow',
  secondary: 'bg-white text-forest-800 border border-manikan-border hover:border-forest-200 hover:bg-forest-50',
  outline:   'bg-transparent text-forest-600 border border-forest-400 hover:bg-forest-50 hover:border-forest-500',
  ghost:     'bg-transparent text-gray-600 hover:bg-forest-50 hover:text-forest-700',
  gold:      'bg-gold-500 text-white hover:bg-gold-600 shadow-gold',
  dark:      'bg-forest-900 text-white hover:bg-forest-800 shadow-soft',
};

const sizes = {
  sm:  'px-4 py-2 text-xs',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-3.5 text-sm',
  xl:  'px-9 py-4 text-base',
};

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  to,
  href,
  onClick,
  disabled,
  className = '',
  icon,
  iconRight,
  fullWidth,
  type = 'button',
}) {
  const base = [
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
    'transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  );

  if (to)   return <Link to={to} className={base}>{content}</Link>;
  if (href)  return <a href={href} className={base} target="_blank" rel="noopener noreferrer">{content}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {content}
    </button>
  );
}
