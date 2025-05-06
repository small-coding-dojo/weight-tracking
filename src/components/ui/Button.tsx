'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false, 
    children, 
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const isDarkMode = useDarkMode();
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    
    const sizeStyles = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };
    
    const variantStyles = {
      primary: `bg-blue-600 hover:bg-blue-700 text-white ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
      secondary: isDarkMode 
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      danger: `bg-red-600 hover:bg-red-700 text-white ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
      success: `bg-green-600 hover:bg-green-700 text-white ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
      outline: isDarkMode
        ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    };
    
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {typeof children === 'string' && (children.includes('...') ? children : `${children}...`)}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';