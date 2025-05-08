"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, description, error, className, ...props }, ref) => {
    const onSecondary = useThemeColor("On", "Secondary");
    const backgroundSecondary = useThemeColor("Main", "Secondary");
    const borderHover = useThemeColor("Border Hover", "Assets");
    const focusRing = useThemeColor("Focus Ring", "Assets");
    const destructiveBorder = useThemeColor("Border", "Destructive");
    const infoText = useThemeColor("Text", "Info");
    const destructiveText = useThemeColor("Text", "Destructive");

    const getLabelClass = () => {
      return `block text-sm font-medium mb-1 ${onSecondary}`;
    };

    const getInputClass = () => {
      return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:${focusRing} 
      ${backgroundSecondary} ${borderHover} ${onSecondary}
        ${error ? destructiveBorder : ""} ${className || ""}`;
    };

    const getDescriptionClass = () => {
      return `text-xs mt-1 ${infoText}`;
    };

    const getErrorClass = () => {
      return `text-xs mt-1 ${destructiveText}`;
    };

    return (
      <div className="mb-4">
        <label htmlFor={props.id} className={getLabelClass()}>
          {label}
        </label>

        <input ref={ref} {...props} className={getInputClass()} />

        {description && !error && (
          <p className={getDescriptionClass()}>{description}</p>
        )}

        {error && <p className={getErrorClass()}>{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
