"use client";

import { useThemeColor } from "@/hooks/useThemeColor";
import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "custom";
  padded?: boolean;
  backgroundColor?: string;
  withShadow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padded = true,
      backgroundColor = undefined,
      withShadow = true,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const secondary = useThemeColor("Main", "Secondary");
    const borderSecondary = useThemeColor("Border", "Secondary");
    const subtleSecondary = useThemeColor("Subtle", "Secondary");

    const variantStyles = {
      default: secondary,
      outline: `${borderSecondary} border-2 ${subtleSecondary}`,
      custom: backgroundColor,
    };

    const paddingStyle = padded ? "p-6" : "";
    const shadow = withShadow ? "shadow-sm" : "";

    return (
      <div
        ref={ref}
        className={`rounded-lg ${shadow} ${variantStyles[variant]} ${paddingStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
