'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padded = true, className = '', children, ...props }, ref) => {
    const isDarkMode = useDarkMode();

    const variantStyles = {
      default: isDarkMode ? 'bg-gray-800' : 'bg-white',
      outline: isDarkMode ? 'bg-transparent border border-gray-700' : 'bg-transparent border border-gray-200',
    };
    
    const paddingStyle = padded ? 'p-6' : '';
    
    return (
      <div
        ref={ref}
        className={`rounded-lg shadow-sm ${variantStyles[variant]} ${paddingStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';