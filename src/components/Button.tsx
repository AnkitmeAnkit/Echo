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
  const baseStyles = 'inline-flex items-center justify-center font-mono font-bold uppercase transition-colors duration-75 cursor-pointer border-2 rounded-none';
  
  const variants = {
    primary: 'bg-accent text-accent-text border-accent hover:bg-bg-primary hover:text-accent',
    secondary: 'bg-bg-inverted text-text-inverted border-text-inverted hover:bg-bg-primary hover:text-text-primary hover:border-text-primary',
    ghost: 'bg-transparent text-text-secondary border-transparent hover:border-text-primary hover:text-text-primary',
    outline: 'bg-transparent border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary',
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
