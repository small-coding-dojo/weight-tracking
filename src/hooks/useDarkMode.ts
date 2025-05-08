"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

/**
 * A custom hook that detects if dark mode is active.
 * Works safely with SSR and handles both manual theme selection and system preferences.
 *
 * @returns boolean indicating if dark mode is active
 */
export function useDarkMode() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Only run in the browser to avoid SSR issues
    if (typeof window !== "undefined") {
      setIsDarkMode(
        theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches),
      );
    }
  }, [theme]);

  return isDarkMode;
}
