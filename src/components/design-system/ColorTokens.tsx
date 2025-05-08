
'use client';

import { useThemeColor } from "@/hooks/useThemeColor";
import { Card } from "../ui/Card";
import { tokenCategories } from "@/lib/color-utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function ColorHookWrapper({colorName, category, onLoad}:{
    colorName: string;
    category?: string;
    onLoad: (name: string, themeColor: string) => void;
}) {
    const identifier = `${colorName}${category}`;
    const themeColor = useThemeColor(colorName, category);

    // Use a ref to track if we've already loaded this color
    const hasLoadedRef = useRef(false);

    // Call the onLoad callback after the hook is called
    useEffect(() => {
        if(!hasLoadedRef.current) {
            onLoad(identifier, themeColor);
            hasLoadedRef.current = true; // Mark as loaded
        }
    }, [identifier, themeColor, onLoad]);

    return null; // No UI to render
}

export function ColorTokens() {  
  const subtleSecondary = useThemeColor("Subtle", "Secondary");
  const onSecondary = useThemeColor("On", "Secondary");
  const backgroundSecondary = useThemeColor("Main", "Secondary");
  
  // Pre-compute all token classes at the component top level
  const [colorClasses, setColorClasses] = useState<Record<string, string>>({});
  
  // Get all color names from all categories first
  const amountOfColors = useMemo(() => tokenCategories.flatMap(category =>
    category.colors.map(color => color.name)
  ), []).length;


  // Track loading state
  const [loadedColors, setLoadedColors] = useState(0);
  const allColorsLoaded = loadedColors === amountOfColors;
  
  // Callback to store the class names
  const handleColorLoadWithTracking = useCallback((name: string, themeColor: string) => {
    setColorClasses((prev) => ({ ...prev, [name]: themeColor }));
    setLoadedColors(prev => prev + 1);
  }, []);

  const colorWrappers = useMemo(() => (
    tokenCategories.flatMap(category => (
        category.colors.map(color => (
            <ColorHookWrapper
                key={`${color.name}${category.name}`} 
                colorName={color.name} 
                category={category.name}
                onLoad={handleColorLoadWithTracking}
            />
        ))
    ))
    ), [handleColorLoadWithTracking]);

  return (
    <>
    {colorWrappers}
    {allColorsLoaded ? (
        <div className="grid gap-6">
            {tokenCategories.map((category, index) => (
                <Card key={`index-${index}`} variant='custom' withShadow={false} backgroundColor={``}>
                    <div key={`${category.name},${index}`}>
                        <h2 className="font-bold text-xl mb-2">{category.name}</h2>
                        <p className={`${onSecondary} mb-4`}>{category.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.colors.map((color, colorIndex) => (
                                <Card key={colorIndex} className={`p-4`} variant='custom' backgroundColor={subtleSecondary}>
                                    <div className={`h-16 rounded-md mb-2 ${colorClasses[`${color.name}${category.name}`]} border-2`}>
                                        {color.lightClassName.includes("text") ? "Lorem ipsum dolor sit amet..." : "" }
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className={`font-medium ${onSecondary}`}>{color.name}</h3>
                                        {color.variable && (
                                            <code className={`text-sm ${backgroundSecondary} ${onSecondary} px-1 py-0.5 rounded`}>
                                            {color.variable}
                                            </code>
                                        )}
                                        {color.description && (
                                            <p className={`text-sm ${subtleSecondary} ${onSecondary}`}>
                                            {color.description}
                                            </p>
                                        )}
                                        <div className={`text-xs mt-2 ${backgroundSecondary} ${onSecondary}`}>
                                            <div>
                                            Light: <code>{color.lightClassName}</code>
                                            </div>
                                            <div>
                                            Dark: <code>{color.darkClassName}</code>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    ) : (
        <div className="text-center py-8">
            Loading color tokens... ({loadedColors}/{amountOfColors})
        </div>
    )}
    </>
  );
}