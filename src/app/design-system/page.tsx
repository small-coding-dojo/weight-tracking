'use client';

import { ColorTokens } from '@/components/design-system/ColorTokens';
import { Card } from '@/components/ui/Card';
import { ColorButton } from '@/components/design-system/ColorButton';
import { colorPalette } from '@/lib/color-utils';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function DesignSystemPage() {
  const isDarkMode = useDarkMode();
  // Create an array of all available color variants
  const colorVariants = Object.keys(colorPalette) as Array<keyof typeof colorPalette>;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Design System</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          This page documents the design system used throughout the application, including colors, typography, and UI components.
        </p>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Use this reference to ensure consistency when developing new features.
        </p>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Color Button Example</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          The following buttons demonstrate how to use the new color utilities for consistent styling:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {colorVariants.map(variant => (
            <div key={variant} className="space-y-2">
              <h3 className="text-lg font-semibold capitalize">{variant}</h3>
              <div className="flex flex-wrap gap-2">
                <ColorButton variant={variant}>Normal</ColorButton>
                <ColorButton variant={variant} isLoading>Loading</ColorButton>
                <ColorButton variant={variant} disabled>Disabled</ColorButton>
              </div>
            </div>
          ))}
        </div>
        
        <Card className='p-4 rounded-md' variant='outline'>   
          <h3 className="text-lg font-semibold mb-2">Implementation</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            This button uses the color utility functions from <code>src/lib/color-utils.ts</code>:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto text-sm">
{`// Example usage with useDarkMode hook
const isDarkMode = useDarkMode();

// Get the appropriate color based on the variant and dark mode state
const getVariantColor = (variant, type) => {
  const color = colorPalette[variant];
  
  if (isDarkMode && color.dark && color.dark[type]) {
    return color.dark[type];
  }
  
  return color[type];
};

// Apply as classes
className={\`bg-\${getVariantColor(variant, 'default')} text-\${getVariantColor(variant, 'foreground')}\``}
          </pre>
        </Card>
      </Card>
      
      <ColorTokens />
    </div>
  );
}