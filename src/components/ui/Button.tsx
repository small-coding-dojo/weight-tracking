"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "danger"
  | "success"
  | "outline"
  | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  children?: ReactNode;
}

function GetVariantStyles(
  variant: ButtonVariant,
  disabled?: boolean,
  isLoading?: boolean,
) {
  const disabledStyle =
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

  const primaryStyles = `${useThemeColor("Main", "Primary")} ${useThemeColor("Hover", "Primary")} ${useThemeColor("On", "Primary")} ${disabledStyle}`;
  const secondaryStyles = `${useThemeColor("Main", "Secondary")} ${useThemeColor("Hover", "Secondary")} ${useThemeColor("On", "Secondary")} ${disabledStyle}`;
  const accentStyles = `${useThemeColor("Text", "Primary")} ${useThemeColor("Text Hover", "Primary")}`;
  const dangerStyles = `${useThemeColor("Main", "Destructive")} ${useThemeColor("Hover", "Destructive")} ${useThemeColor("On Destructive", "Destructive")} ${disabledStyle}`;
  const successStyles = `${useThemeColor("Main", "Success")} ${useThemeColor("Hover", "Success")} ${useThemeColor("On", "Success")} ${disabledStyle}`;
  const outlineStyles = `bg-transparent border ${useThemeColor("Outline Border", "Button")} ${useThemeColor("Outline Text", "Button")} ${useThemeColor("Outline Hover", "Button")} ${disabledStyle}`;
  const ghostStyles = `bg-transparent ${useThemeColor("Ghost Text", "Button")} ${useThemeColor("Ghost Hover", "Button")} ${useThemeColor("Ghost Hover Text", "Button")} ${disabledStyle}`;

  return {
    primary: primaryStyles,
    secondary: secondaryStyles,
    accent: accentStyles,
    danger: dangerStyles,
    success: successStyles,
    outline: outlineStyles,
    ghost: ghostStyles,
  }[variant];
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      asChild = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles = `inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${useThemeColor("Focus Ring", "Assets")}`;

    const sizeStyles = {
      xs: "px-2 py-0.5 text-xs",
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
      icon: "p-2 aspect-square",
    };

    const variantStyle = GetVariantStyles(variant, disabled, isLoading);
    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyle} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {typeof children === "string" &&
              (children.includes("...") ? children : `${children}...`)}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";
