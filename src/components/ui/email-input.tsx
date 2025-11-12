"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { IconInput } from "./icon-input";

export interface EmailInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label = "Email", error, showIcon = true, size, ...props }, ref) => {
    return (
      <IconInput
        ref={ref}
        type="email"
        autoComplete="email"
        label={label}
        error={error}
        size={size}
        startIcon={showIcon ? Mail : undefined}
        {...props}
      />
    );
  }
);
EmailInput.displayName = "EmailInput";
