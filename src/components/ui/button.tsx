"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

const base =
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-muted-foreground text-white hover:bg-muted-foreground/40",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
  outline: "border border-border bg-transparent hover:bg-muted/60",
  ghost: "bg-transparent hover:bg-muted/60",
  destructive: "bg-red-600 text-white hover:bg-red-600/90",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-7 px-2.5 md:h-8 md:px-3",
  md: "h-9 px-3.5 md:h-10 md:px-4",
  lg: "h-10 px-5 text-sm md:h-12 md:px-6 md:text-base",
  icon: "h-9 w-9 md:h-10 md:w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
