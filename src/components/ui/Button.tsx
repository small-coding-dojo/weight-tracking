'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useDarkMode } from '@/hooks/useDarkMode';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false, 
    asChild = false,
    children, 
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const isDarkMode = useDarkMode();
    const Comp = asChild ? Slot : "button";
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    
    const sizeStyles = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      icon: 'p-2 aspect-square',
    };
    const disabledStyle = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';
    const getLightVariantStyles = () => ({
      primary: `bg-blue-600 hover:bg-blue-700 text-white ${disabledStyle}`,
      secondary: `bg-gray-100 text-gray-700 hover:bg-gray-200`,
      danger: `bg-red-600 hover:bg-red-700 text-white ${disabledStyle}`,
      success: `bg-green-600 hover:bg-green-700 text-white ${disabledStyle}`,
      outline: `border border-gray-300 text-gray-700 hover:bg-gray-50`,
      ghost: `text-gray-700 hover:bg-gray-100 hover:text-gray-800`,
    });

    const getDarkVariantStyles = () => ({
      primary: `bg-blue-600 hover:bg-blue-700 text-white ${disabledStyle}`,
      secondary: `bg-gray-700 text-gray-300 hover:bg-gray-600`,
      danger: `bg-red-600 hover:bg-red-700 text-white ${disabledStyle}`,
      success: `bg-green-600 hover:bg-green-700 text-white ${disabledStyle}`,
      outline: `border border-gray-600 text-gray-300 hover:bg-gray-700`,
      ghost: `text-gray-300 hover:bg-gray-800 hover:text-gray-100`,
    });

    
    
    const variantStyles = isDarkMode ? getDarkVariantStyles() : getLightVariantStyles();
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <Comp
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
      </Comp>
    );
  }
);

Button.displayName = 'Button';