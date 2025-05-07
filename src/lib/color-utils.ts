/**
 * Color utilities for working with the application's color system.
 * This file provides helper functions and constants for using colors consistently.
 */

/**
 * Define types for color variants to ensure consistency
 */
type ColorVariant = {
  default: string;
  hover: string;
  foreground: string;
  dark?: {
    default?: string;
    hover?: string;
    foreground?: string;
  };
};

/**
 * Application color palette - these should match the CSS variables in globals.css
 */
export const colorPalette: Record<string, ColorVariant> = {
  // Primary colors
  primary: {
    default: 'blue-600',
    hover: 'blue-700',
    foreground: 'white',
    dark: {
      default: 'blue-500',
      hover: 'blue-600',
    },
  },
  
  // Secondary colors
  secondary: {
    default: 'gray-100',
    hover: 'gray-200',
    foreground: 'gray-700',
    dark: {
      default: 'gray-700',
      hover: 'gray-600',
      foreground: 'gray-300',
    },
  },
  
  // Destructive colors
  destructive: {
    default: 'red-600',
    hover: 'red-700',
    foreground: 'white',
    dark: {}, // Add empty dark object to maintain consistent structure
  },
  
  // Success colors
  success: {
    default: 'green-600',
    hover: 'green-700',
    foreground: 'white',
    dark: {
      default: 'green-600',
      hover: 'green-700',
    },
  },
  
  // Warning colors
  warning: {
    default: 'amber-500',
    hover: 'amber-600',
    foreground: 'gray-900',
    dark: {
      foreground: 'white',
    },
  },
  
  // Info colors
  info: {
    default: 'blue-500',
    hover: 'blue-600',
    foreground: 'gray-900',
    dark: {
      foreground: 'white',
    },
  },
};

/**
 * Get a Tailwind CSS color class based on the current theme
 * 
 * @param colorKey - The color key from the palette
 * @param variant - The variant of the color (default, hover, etc.)
 * @param prefix - The Tailwind prefix (bg, text, border, etc.)
 * @param isDarkMode - Whether dark mode is currently active
 * @returns A string with the appropriate Tailwind color class
 */
export function getColorClass(
  colorKey: keyof typeof colorPalette, 
  variant: 'default' | 'hover' | 'foreground' = 'default',
  prefix: 'bg' | 'text' | 'border' | 'ring' = 'bg',
  isDarkMode: boolean = false
): string {
  const color = colorPalette[colorKey];
  
  // Select the appropriate color based on the current theme
  let selectedColor: string;
  
  if (isDarkMode && color.dark && (color.dark[variant as keyof typeof color.dark])) {
    selectedColor = color.dark[variant as keyof typeof color.dark] as string;
  } else {
    selectedColor = color[variant];
  }
  
  return `${prefix}-${selectedColor}`;
}

/**
 * Generate class strings for different states of an element (normal, hover, focus)
 * 
 * @param colorKey - The color key from the palette
 * @param isDarkMode - Whether dark mode is currently active
 * @returns An object with class strings for normal, hover and focus states
 */
export function getInteractiveColorClasses(
  colorKey: keyof typeof colorPalette,
  isDarkMode: boolean = false
): {
  base: string;
  hover: string;
  focus: string;
} {
  return {
    base: `${getColorClass(colorKey, 'default', 'bg', isDarkMode)} ${getColorClass(colorKey, 'foreground', 'text', isDarkMode)}`,
    hover: getColorClass(colorKey, 'hover', 'bg', isDarkMode),
    focus: `ring-2 ring-offset-2 ${getColorClass(colorKey, 'default', 'ring', isDarkMode)}`,
  };
}