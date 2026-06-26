import React, { ComponentProps } from 'react';

type CardProps = ComponentProps<'div'> & {
  variant?: 'default' | 'elevated' | 'lavender';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
};

export function Card({
  children,
  variant = 'default',
  padding = 'lg',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-canvas-white shadow-soft border border-border-light/50',
    elevated: 'bg-canvas-white shadow-card border border-border-light/20',
    lavender: 'bg-gradient-lavender shadow-lavender border-none',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
