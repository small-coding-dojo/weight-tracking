"use client";

import { useSyncThemeManager } from "@/hooks/useSyncThemeManager";

/**
 * This component synchronizes the application's theme state with the ThemeManager singleton.
 * It should be included once in the application, preferably near the root component.
 */
export function ThemeSync() {
  // Use the useSyncThemeManager hook to keep ThemeManager in sync with theme state
  useSyncThemeManager();

  return null; // This is a utility component with no UI
}
