'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, description, error, className, ...props }, ref) => {
    const isDarkMode = useDarkMode();
    
    return (
      <div className="mb-4">
        <label 
          htmlFor={props.id} 
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`}
        >
          {label}
        </label>
        
        <input
          ref={ref}
          {...props}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-300'
          } ${error ? 'border-red-500' : ''} ${className || ''}`}
        />
        
        {description && !error && (
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
        
        {error && (
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';