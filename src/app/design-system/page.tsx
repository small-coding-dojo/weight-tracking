"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ColorTokens } from "@/components/design-system/ColorTokens";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonVariant } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

function ExampleButtons(colorVariant?: ButtonVariant) {
  return (
    <div key={colorVariant} className="space-y-2">
      <h3 className="text-lg font-semibold capitalize">{colorVariant}</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant={colorVariant}>Normal</Button>
        <Button variant={colorVariant} isLoading>
          Loading
        </Button>
        <Button variant={colorVariant} disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const router = useRouter();
  //const colorVariants = Object.keys(colorPalette) as Array<keyof typeof colorPalette>;
  const buttonVariants = [
    "primary",
    "secondary",
    "accent",
    "danger",
    "success",
    "outline",
    "ghost",
  ] as ButtonVariant[];
  const onSecondary = useThemeColor("On", "Secondary");
  const subtleSecondary = useThemeColor("Subtle", "Secondary");
  const mainSecondary = useThemeColor("Main", "Secondary");

  useEffect(() => {
    // Check if we're in production environment
    if (process.env.NODE_ENV === "production") {
      router.replace("/");
    }
  }, [router]);

  // If in production, return nothing while redirecting
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // Only render in development environment
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Design System</h1>
        <p className={`${onSecondary} mb-2`}>
          This page documents the design system used throughout the application,
          including colors, typography, and UI components.
        </p>
        <p className={onSecondary}>
          Use this reference to ensure consistency when developing new features.
        </p>
        <Alert className="mt-4 p-3 rounded-md" variant="warning">
          <strong>Development Only:</strong> This page is only visible in
          development mode and will not be accessible in production.
        </Alert>
      </Card>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Button Example</h2>
        <p className={`${onSecondary} mb-4`}>
          The following buttons demonstrate how to use the new color utilities
          for consistent styling:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {buttonVariants.map((variant) => ExampleButtons(variant))}
        </div>
        {/* new example */}

        <Card
          className="p-4 rounded-md"
          variant="custom"
          backgroundColor={subtleSecondary}
        >
          <h3 className="text-lg font-semibold mb-2">Implementation</h3>
          <p className={`${onSecondary} mb-2`}>
            Use the useThemeColor hook to apply themed styles:
          </p>
          <pre
            className={`${mainSecondary} ${onSecondary} p-4 rounded-md overflow-auto text-sm`}
          >
            {`// Import the hook
import { useThemeColor } from '@/hooks/useThemeColor';

// Use inside your component
function MyComponent() {
  // Get color tokens
  const primaryToken = useThemeColor("Main", "Primary");
  const onPrimaryToken = useThemeColor("On", "Primary");
  
  return (
    <Button className={\`\${primaryToken} \${onPrimaryToken}\`}>
      Themed Button
    </Button>
  );
}`}
          </pre>
        </Card>
      </Card>
      <Card className="mb-8">
        <ColorTokens />
      </Card>
    </div>
  );
}
