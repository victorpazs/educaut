"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface IconInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  startIcon?: React.ComponentType<{ className?: string }>;
  endContent?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

// Size variants for input fields
const sizes = {
  sm: {
    height: "h-8",
    iconSize: "h-3 w-3",
    iconPadding: "pl-8",
    endPadding: "pr-10",
    fontSize: "text-sm",
  },
  md: {
    height: "h-10",
    iconSize: "h-4 w-4",
    iconPadding: "pl-9",
    endPadding: "pr-11",
    fontSize: "text-sm",
  },
  lg: {
    height: "h-12",
    iconSize: "h-5 w-5",
    iconPadding: "pl-12",
    endPadding: "pr-14",
    fontSize: "text-base",
  },
};

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  (
    {
      className,
      label,
      error,
      startIcon: StartIcon,
      endContent,
      size = "md",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const sizeConfig = sizes[size];

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {StartIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <StartIcon
                className={cn(sizeConfig.iconSize, "text-muted-foreground")}
              />
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            className={cn(
              sizeConfig.height,
              sizeConfig.fontSize,
              "bg-background border-border focus:border-primary focus:ring-primary placeholder:text-secondary",
              StartIcon && sizeConfig.iconPadding,
              endContent ? sizeConfig.endPadding : undefined,
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {endContent && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {endContent}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
IconInput.displayName = "IconInput";
