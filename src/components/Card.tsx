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
  const baseStyles = 'rounded-none transition-none';
  
  const variants = {
    default: 'bg-bg-secondary border-4 border-border-main',
    elevated: 'bg-bg-elevated border-4 border-text-primary',
    lavender: 'bg-accent text-accent-text border-4 border-border-inverse',
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
