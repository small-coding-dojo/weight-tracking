/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Safelist all the color variants you need
    // Background colors
    'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 
    'bg-amber-500', 'bg-amber-600', 'bg-amber-700', 'bg-amber-800', 'bg-amber-900',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
    'bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 
    'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900',
    'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 
    'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 
    'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
    // Border colors
    'border-amber-50', 'border-amber-200', 'border-amber-800', 'border-amber-900',
    'border-blue-50', 'border-blue-200', 'border-blue-800', 'border-blue-900',
    'border-green-50', 'border-green-200', 'border-green-800', 'border-green-900',
    'border-red-50', 'border-red-200', 'border-red-800', 'border-red-900',
    'border-gray-50', 'border-gray-200', 'border-gray-800', 'border-gray-900',
    // Text colors
    'text-amber-50', 'text-amber-200', 'text-amber-800', 'text-amber-900',
    'text-blue-50', 'text-blue-200', 'text-blue-800', 'text-blue-900',
    'text-green-50', 'text-green-200', 'text-green-800', 'text-green-900',
    'text-red-50', 'text-red-200', 'text-red-800', 'text-red-900',
    'text-gray-50', 'text-gray-200', 'text-gray-800', 'text-gray-900',
  ],
  theme: {
    extend: {
      colors: {
        // Use the semantic color variables from globals.css for base colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary-hover))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          hover: 'hsl(var(--destructive-hover))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          hover: 'hsl(var(--success-hover))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          hover: 'hsl(var(--info-hover))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          hover: 'hsl(var(--warning-hover))',
        },
              },
    },
  },
  plugins: [],
}