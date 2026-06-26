import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lavender' | 'mint' | 'outline' | 'blue';
  className?: string;
}

export function Badge({ children, variant = 'lavender', className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-none text-xs font-mono font-bold uppercase tracking-wider border-2';
  
  const variants = {
    lavender: 'bg-bg-elevated text-accent border-accent',
    mint: 'bg-accent text-accent-text border-border-inverse',
    outline: 'bg-transparent border-border-main text-text-secondary',
    blue: 'bg-text-primary text-bg-primary border-text-primary',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
