'use client';

import { Card } from "../ui/Card";
import { useDarkMode } from "@/hooks/useDarkMode";

type ColorCategory = {
  name: string;
  description: string;
  colors: {
    name: string;
    lightClassName: string;
    darkClassName: string;
    variable: string;
  }[];
};

export function ColorTokens() {
  const isDarkMode = useDarkMode();
  
  const colorCategories: ColorCategory[] = [
    {
      name: "Primary",
      description: "Used for primary actions, key UI elements, and brand colors",
      colors: [
        { name: "Primary", lightClassName: "bg-blue-600", darkClassName: "bg-blue-500", variable: "--primary" },
        { name: "Primary Hover", lightClassName: "bg-blue-700", darkClassName: "bg-blue-600", variable: "--primary-hover" },
      ],
    },
    {
      name: "Secondary",
      description: "Used for secondary actions and less prominent UI elements",
      colors: [
        { name: "Secondary", lightClassName: "bg-gray-100", darkClassName: "bg-gray-700", variable: "--secondary" },
        { name: "Secondary Hover", lightClassName: "bg-gray-200", darkClassName: "bg-gray-600", variable: "--secondary-hover" },
      ],
    },
    {
      name: "Destructive/Danger",
      description: "Used for destructive actions and error states",
      colors: [
        { name: "Destructive", lightClassName: "bg-red-600", darkClassName: "bg-red-600", variable: "--destructive" },
        { name: "Destructive Hover", lightClassName: "bg-red-700", darkClassName: "bg-red-700", variable: "--destructive-hover" },
      ],
    },
    {
      name: "Success",
      description: "Used for success states and confirmations",
      colors: [
        { name: "Success", lightClassName: "bg-green-600", darkClassName: "bg-green-600", variable: "--success" },
        { name: "Success Hover", lightClassName: "bg-green-700", darkClassName: "bg-green-700", variable: "--success-hover" },
      ],
    },
    {
      name: "Warning",
      description: "Used for warning states and notifications",
      colors: [
        { name: "Warning", lightClassName: "bg-amber-500", darkClassName: "bg-amber-500", variable: "--warning" },
        { name: "Warning Hover", lightClassName: "bg-amber-600", darkClassName: "bg-amber-600", variable: "--warning-hover" },
      ],
    },
    {
      name: "Info",
      description: "Used for informational states and notifications",
      colors: [
        { name: "Info", lightClassName: "bg-blue-500", darkClassName: "bg-blue-500", variable: "--info" },
        { name: "Info Hover", lightClassName: "bg-blue-600", darkClassName: "bg-blue-600", variable: "--info-hover" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Color System</h1>
        <p className={`text-${isDarkMode ? 'gray-400' : 'gray-600'}`}>
          This reference shows all available colors in the application's color system.
          Use these consistent colors throughout the application.
        </p>
      </div>

      {colorCategories.map((category) => (
        <div key={category.name} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className={`text-${isDarkMode ? 'gray-400' : 'gray-600'}`}>{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.colors.map((color) => (
              <Card key={color.name} className="overflow-hidden">
                <div className={`h-24 ${isDarkMode ? color.darkClassName : color.lightClassName}`}></div>
                <div className="p-4">
                  <h3 className="font-medium">{color.name}</h3>
                  <p className={`text-sm text-${isDarkMode ? 'gray-400' : 'gray-600'}`}>
                    CSS Variable: {color.variable}
                  </p>
                  <p className={`text-sm text-${isDarkMode ? 'gray-400' : 'gray-600'}`}>
                    Class: {isDarkMode ? color.darkClassName : color.lightClassName}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}