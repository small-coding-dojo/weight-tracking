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
    
    const getLabelClass = () => {
      return `block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`;
    };
    
    const getInputClass = () => {
      return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} 
        ${error ? 'border-red-500' : ''} ${className || ''}`;
    };
    
    const getDescriptionClass = () => {
      return `text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;
    };
    
    const getErrorClass = () => {
      return `text-xs mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`;
    };
    
    return (
      <div className="mb-4">
        <label 
          htmlFor={props.id} 
          className={getLabelClass()}
        >
          {label}
        </label>
        
        <input
          ref={ref}
          {...props}
          className={getInputClass()}
        />
        
        {description && !error && (
          <p className={getDescriptionClass()}>
            {description}
          </p>
        )}
        
        {error && (
          <p className={getErrorClass()}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';