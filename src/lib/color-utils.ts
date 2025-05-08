/**
 * Color utilities for working with the application's color system.
 * This file provides helper functions and constants for using colors consistently.
 */

/**
 * Define types for color categories and tokens matching the ColorTokens component
 */
export type ColorToken = {
  name: string;
  lightClassName: string;
  darkClassName: string;
  variable?: string;
  description?: string;
};

export type ColorCategory = {
  name: string;
  description: string;
  colors: ColorToken[];
};

/**
 * Color tokens extracted from the ColorTokens component
 * These match the definitions in src/components/design-system/ColorTokens.tsx
 */
export const tokenCategories: ColorCategory[] = [
  {
    name: "Primary",
    description: "Used for primary actions, key UI elements, and brand colors",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-blue-500",
        darkClassName: "bg-blue-600",
        variable: "--primary",
        description: "Main brand color for buttons, links and key UI elements",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-blue-700",
        darkClassName: "hover:bg-blue-800",
        variable: "--primary-hover",
        description: "Hover state for interactive primary elements",
      },

      // Text colors
      {
        name: "Text",
        lightClassName: "text-blue-600",
        darkClassName: "text-blue-500",
        description: "For text that uses primary brand color",
      },
      {
        name: "Text Hover",
        lightClassName: "hover:text-blue-800",
        darkClassName: "hover:text-blue-300",
        description: "For text that uses primary brand color",
      },
      {
        name: "On",
        lightClassName: "text-white",
        darkClassName: "text-white",
        variable: "--primary-foreground",
        description: "Text color used on primary backgrounds",
      },
      {
        name: "Border",
        lightClassName: "border-blue-500",
        darkClassName: "border-blue-500",
        variable: "--primary-border",
        description: "Border color for primary elements",
      },
      {
        name: "Border On",
        lightClassName: "border-white",
        darkClassName: "border-white",
        variable: "--primary-border-on",
        description: "Border color used on primary backgrounds",
      },
    ],
  },
  {
    name: "Secondary",
    description: "Used for secondary actions and supporting UI elements",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-gray-100",
        darkClassName: "bg-gray-700",
        variable: "--secondary",
        description: "Used for secondary actions and less prominent elements",
      },
      {
        name: "Subtle",
        lightClassName: "bg-gray-200",
        darkClassName: "bg-gray-600",
        variable: "--secondary-subtle",
        description: "Subtle background using secondary color",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-gray-300",
        darkClassName: "hover:bg-gray-500",
        variable: "--secondary-hover",
        description: "Hover state for secondary elements",
      },

      // Text colors
      {
        name: "Text",
        lightClassName: "text-gray-600",
        darkClassName: "text-gray-300",
        description: "For text that uses secondary color",
      },
      {
        name: "On",
        lightClassName: "text-gray-700",
        darkClassName: "text-gray-100",
        variable: "--secondary-foreground",
        description: "Text color used on secondary backgrounds",
      },
      {
        name: "Border",
        lightClassName: "border-gray-800",
        darkClassName: "border-gray-200",
        variable: "--secondary-border",
        description: "Border color for secondary elements",
      },
    ],
  },
  {
    name: "Accent",
    description: "Used for accent elements, highlights, and tertiary actions",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-purple-500",
        darkClassName: "bg-purple-600",
        variable: "--accent",
        description: "Used for accent elements and highlights",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-purple-600",
        darkClassName: "hover:bg-purple-700",
        variable: "--accent-hover",
        description: "Hover state for accent elements",
      },

      // Text colors
      {
        name: "Text",
        lightClassName: "text-purple-600",
        darkClassName: "text-purple-400",
        description: "For text that uses accent color",
      },
      {
        name: "On",
        lightClassName: "text-white",
        darkClassName: "text-white",
        variable: "--accent-foreground",
        description: "Text color used on accent backgrounds",
      },

      // Subtle variations
      {
        name: "Subtle",
        lightClassName: "bg-purple-100",
        darkClassName: "bg-purple-900",
        variable: "--accent-subtle",
        description: "Subtle background using accent color",
      },
      {
        name: "Muted",
        lightClassName: "text-purple-400",
        darkClassName: "text-purple-500",
        variable: "--accent-muted",
        description: "Muted accent color for subtle elements",
      },
    ],
  },
  {
    name: "Destructive",
    description: "Used for errors, deletions, and destructive actions",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-red-600",
        darkClassName: "bg-red-600",
        variable: "--destructive",
        description: "Used for destructive actions, errors, and warnings",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-red-700",
        darkClassName: "hover:bg-red-700",
        variable: "--destructive-hover",
        description: "Hover state for destructive actions",
      },
      {
        name: "Hover Subtle",
        lightClassName: "hover:bg-red-100",
        darkClassName: "hover:bg-red-300",
        variable: "--destructive-hover-subtle",
        description: "Hover state for subtle destructive actions",
      },
      // Text colors
      {
        name: "Text",
        lightClassName: "text-red-600",
        darkClassName: "text-red-600",
        description: "For text that indicates errors or warnings",
      },
      {
        name: "Text Hover",
        lightClassName: "hover:text-red-800",
        darkClassName: "hover:text-red-800",
        description: "For text that indicates errors or warnings",
      },
      {
        name: "On",
        lightClassName: "text-white",
        darkClassName: "text-white",
        variable: "--destructive-foreground",
        description: "Text color used on destructive backgrounds",
      },

      {
        name: "Border",
        lightClassName: "border-red-500",
        darkClassName: "border-red-500",
        variable: "--destructive-border",
        description: "Border color for destructive elements",
      },
    ],
  },
  {
    name: "Success",
    description: "Used for positive confirmations and successful actions",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-green-600",
        darkClassName: "bg-green-600",
        variable: "--success",
        description: "Used for success messages and positive outcomes",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-green-800",
        darkClassName: "hover:bg-green-800",
        variable: "--success-hover",
        description: "Hover state for success elements",
      },

      // Text colors
      {
        name: "Text",
        lightClassName: "text-green-600",
        darkClassName: "text-green-500",
        description: "For text that indicates success",
      },
      {
        name: "On",
        lightClassName: "text-white",
        darkClassName: "text-white",
        variable: "--success-foreground",
        description: "Text color used on success backgrounds",
      },

      {
        name: "Border",
        lightClassName: "border-green-500",
        darkClassName: "border-green-500",
        variable: "--success-border",
        description: "Border color for success elements",
      },
    ],
  },
  {
    name: "Warning",
    description: "Used for cautionary messages and actions requiring attention",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-amber-500",
        darkClassName: "bg-amber-500",
        variable: "--warning",
        description: "Used for warnings and cautions",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-amber-600",
        darkClassName: "hover:bg-amber-600",
        variable: "--warning-hover",
        description: "Hover state for warning elements",
      },

      // Text colors
      {
        name: "Text",
        lightClassName: "text-amber-600",
        darkClassName: "text-amber-500",
        description: "For text that indicates warnings",
      },
      {
        name: "On",
        lightClassName: "text-gray-900",
        darkClassName: "text-white",
        variable: "--warning-foreground",
        description: "Text color used on warning backgrounds",
      },

      {
        name: "Border",
        lightClassName: "border-amber-500",
        darkClassName: "border-amber-500",
        variable: "--warning-border",
        description: "Border color for warning elements",
      },
    ],
  },
  {
    name: "Info",
    description: "Used for informational messages and notifications",
    colors: [
      // Base colors
      {
        name: "Main",
        lightClassName: "bg-blue-500",
        darkClassName: "bg-blue-500",
        variable: "--info",
        description: "Used for informational messages",
      },
      {
        name: "Hover",
        lightClassName: "hover:bg-blue-600",
        darkClassName: "hover:bg-blue-600",
        variable: "--info-hover",
        description: "Hover state for info elements",
      },

      // Text colors
      {
        name: "Text",
        lightClassName: "text-blue-500",
        darkClassName: "text-blue-400",
        description: "For text that provides information",
      },
      {
        name: "On",
        lightClassName: "text-gray-900",
        darkClassName: "text-white",
        variable: "--info-foreground",
        description: "Text color used on info backgrounds",
      },
    ],
  },
  // Add to your tokenCategories in src/lib/color-utils.ts
  {
    name: "Assets",
    description: "Additional asset tokens for consistent UI surfaces",
    colors: [
      {
        name: "Focus Ring",
        lightClassName: "ring-blue-500",
        darkClassName: "ring-blue-400",
        variable: "--ring",
        description: "Focus ring color for interactive elements",
      },
      {
        name: "Border Hover",
        lightClassName: "hover:border-gray-300",
        darkClassName: "hover:border-gray-600",
        variable: "--border-hover",
        description: "Border color for hover states",
      },
    ],
  },

  {
    name: "Button",
    description: "Used for custom button styling",
    colors: [
      // Outline variants
      {
        name: "Outline Border",
        lightClassName: "border-gray-300",
        darkClassName: "border-gray-600",
        variable: "--outline-border",
        description: "Border color for outline variant elements",
      },
      {
        name: "Outline Text",
        lightClassName: "text-gray-700",
        darkClassName: "text-gray-300",
        variable: "--outline-text",
        description: "Text color for outline variant elements",
      },
      {
        name: "Outline Hover",
        lightClassName: "hover:bg-gray-100",
        darkClassName: "hover:bg-gray-800",
        variable: "--outline-hover",
        description: "Background color for outline variant hover state",
      },

      // Ghost variants
      {
        name: "Ghost Text",
        lightClassName: "text-gray-300",
        darkClassName: "text-gray-300",
        variable: "--ghost-text",
        description: "Text color for ghost variant elements",
      },
      {
        name: "Ghost Hover",
        lightClassName: "hover:bg-gray-100",
        darkClassName: "hover:bg-gray-800",
        variable: "--ghost-hover",
        description: "Background color for ghost variant hover state",
      },
      {
        name: "Ghost Hover Text",
        lightClassName: "hover:text-gray-800",
        darkClassName: "hover:text-gray-100",
        variable: "--ghost-hover-text",
        description: "Text color for ghost variant hover state",
      },
    ],
  },
];

/**
 * Get a flattened map of all color tokens for easy lookup by name
 */
export const colorTokenMap = tokenCategories.reduce((acc, category) => {
  category.colors.forEach((color) => {
    acc[color.name.toLowerCase().replace(/\s+/g, "-")] = color;
  });
  return acc;
}, {} as Record<string, ColorToken>);

/**
 * Find a color token by name and optional category
 *
 * @param colorName - The name of the color token
 * @param categoryName - Optional category to narrow the search
 * @returns The color token or undefined if not found
 */
export function findColorToken(
  colorName: string,
  categoryName?: string
): ColorToken | undefined {
  // Convert the color name to a lookup key format (lowercase with hyphens)
  const normalizedName = colorName.toLowerCase().replace(/\s+/g, "-");

  // If a category is specified, search only within that category
  if (categoryName) {
    const categoryObj = tokenCategories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryObj) {
      return categoryObj.colors.find(
        (color) =>
          color.name.toLowerCase() === colorName.toLowerCase() ||
          color.name.toLowerCase().replace(/\s+/g, "-") === normalizedName
      );
    }
    return undefined;
  }

  // If no direct match and no category specified, search all categories
  for (const cat of tokenCategories) {
    const found = cat.colors.find(
      (color) =>
        color.name.toLowerCase() === colorName.toLowerCase() ||
        color.name.toLowerCase().replace(/\s+/g, "-") === normalizedName
    );
    if (found) return found;
  }

  return undefined;
}
