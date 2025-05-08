"use client";

/**
 * Custom hook to synchronize the application theme with the ThemeManager singleton
 * This hook ensures that the theme system stays in sync with user preferences
 */

import { useEffect } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";
import ThemeManager from "@/lib/ThemeManager";

/**
 * Hook that synchronizes the ThemeManager with the current dark mode state
 * Should be used high in the component tree, typically in a layout component
 */
export function useSyncThemeManager() {
  const isDarkMode = useDarkMode(); // This returns a boolean directly

  useEffect(() => {
    // Use the isDarkMode setter property instead of a setDarkMode method
    ThemeManager.getInstance().isDarkMode = isDarkMode;
  }, [isDarkMode]);
}

export default useSyncThemeManager;
