import React, { ComponentProps } from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer rounded-lg';
  
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg',
    secondary: 'bg-canvas-white text-text-primary hover:bg-canvas hover:text-brand-primary shadow-sm border border-border-light',
    ghost: 'bg-transparent text-text-secondary hover:text-brand-primary hover:bg-brand-lavender/50',
    outline: 'bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-lavender/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
}
