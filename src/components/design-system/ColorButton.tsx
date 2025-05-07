'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { colorPalette, getColorClass } from '@/lib/color-utils';
import { useDarkMode } from '@/hooks/useDarkMode';

export interface ColorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof colorPalette;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Example enhanced Button component that leverages the color utilities.
 * This demonstrates how future components can use the color system.
 */
export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
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
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeStyles = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      icon: 'p-2 aspect-square',
    };
    
    // Get the appropriate color based on the variant
    const bgColorClass = getColorClass(variant, 'default', 'bg', isDarkMode);
    const textColorClass = getColorClass(variant, 'foreground', 'text', isDarkMode);
    const hoverColorClass = !disabled && !isLoading ? `hover:${getColorClass(variant, 'hover', 'bg', isDarkMode)}` : '';
    const focusRingColorClass = `focus:${getColorClass(variant, 'default', 'ring', isDarkMode)}`;
    
    // Apply disabled styles if button is disabled or loading
    const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';
    
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${bgColorClass} ${textColorClass} ${hoverColorClass} ${focusRingColorClass} ${disabledClass} ${widthStyle} ${className}`}
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

ColorButton.displayName = 'ColorButton';