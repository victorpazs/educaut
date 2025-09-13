"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { IconInput } from "./icon-input";

export interface EmailInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showIcon?: boolean;
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label = "Email", error, showIcon = true, ...props }, ref) => {
    return (
      <IconInput
        ref={ref}
        type="email"
        autoComplete="email"
        label={label}
        error={error}
        startIcon={showIcon ? Mail : undefined}
        {...props}
      />
    );
  }
);
EmailInput.displayName = "EmailInput";
