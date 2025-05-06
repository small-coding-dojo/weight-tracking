'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  description?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, description, error, className, ...props }, ref) => {
    const isDarkMode = useDarkMode();
    
    return (
      <div className="mb-4">
        <label 
          htmlFor={props.id} 
          className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : ''}`}
        >
          {label}
        </label>
        
        <select
          ref={ref}
          {...props}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-300'
          } ${error ? 'border-red-500' : ''} ${className || ''}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select';