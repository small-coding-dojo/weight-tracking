import { useState, useEffect } from 'react';
import ThemeManager from '@/lib/ThemeManager';
import { findColorToken } from '@/lib/color-utils';

/**
 * A hook that returns the appropriate class name based on the current theme
 * and re-renders the component when the theme changes.
 * 
 * @param colorName The name of the color to use (e.g., "Primary", "Secondary")
 * @param category The category of the color (e.g., "Primary", "Secondary")
 * @returns The appropriate class name for the current theme
 */
export function useThemeColor(colorName: string, category?: string): string {
  const themeManager = ThemeManager.getInstance();
  const [isDarkMode, setIsDarkMode] = useState(themeManager.isDarkMode);
  
  // Find the color token
  const colorToken = findColorToken(colorName, category);
  
  // Subscribe to theme changes
  useEffect(() => {
    // Set initial state
    setIsDarkMode(themeManager.isDarkMode);
    
    // Subscribe to changes
    const unsubscribe = themeManager.subscribe((isDark) => {
      setIsDarkMode(isDark);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [themeManager]);
  
  // Return the appropriate class name based on the current theme
  return colorToken 
    ? (isDarkMode ? colorToken.darkClassName : colorToken.lightClassName)
    : '';
}