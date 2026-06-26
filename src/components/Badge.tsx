import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lavender' | 'mint' | 'outline' | 'blue';
  className?: string;
}

export function Badge({ children, variant = 'lavender', className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-wider';
  
  const variants = {
    lavender: 'bg-brand-lavender text-brand-primary',
    mint: 'bg-brand-mint text-success',
    outline: 'bg-transparent border border-border-light text-text-secondary',
    blue: 'bg-brand-primary text-white',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
