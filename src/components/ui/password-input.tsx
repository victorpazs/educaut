"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { IconInput } from "./icon-input";
import { Button } from "./button";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showIcon?: boolean;
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    { label = "Password", error, showIcon = true, showToggle = true, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const toggleButton = showToggle ? (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="px-3 py-0 h-full hover:bg-transparent"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    ) : undefined;

    return (
      <IconInput
        ref={ref}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        label={label}
        error={error}
        startIcon={showIcon ? Lock : undefined}
        endContent={toggleButton}
        {...props}
      />
    );
  }
);
PasswordInput.displayName = "PasswordInput";
