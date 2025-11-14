import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  onClick?: () => void;
  startIcon?: React.ComponentType<{ className?: string }>;
  endIcon?: React.ComponentType<{ className?: string }>;
  variant?: "standard" | "outlined";
  color?: "primary" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Chip({
  className,
  label,
  onClick,
  startIcon: StartIcon,
  endIcon: EndIcon,
  variant = "standard",
  color = "default",
  size = "md",
}: ChipProps) {
  const baseClasses =
    "inline-flex max-w-full items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const variants: Record<
    NonNullable<ChipProps["variant"]>,
    Record<NonNullable<ChipProps["color"]>, string>
  > = {
    standard: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      default: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
    outlined: {
      primary:
        "outline outline-primary text-primary bg-transparent hover:bg-primary/10",
      default:
        "outline outline-border text-foreground bg-transparent hover:bg-muted/60",
    },
  };

  const sizes: Record<
    NonNullable<ChipProps["size"]>,
    { container: string; icon: string; text: string }
  > = {
    sm: {
      container: "h-6 px-2 gap-1",
      icon: "h-3 w-3",
      text: "text-xs",
    },
    md: {
      container: "h-8 px-3 gap-1.5",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    lg: {
      container: "h-10 px-4 gap-2",
      icon: "h-5 w-5",
      text: "text-base",
    },
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={cn(
        baseClasses,
        "overflow-hidden min-w-0",
        variants[variant][color],
        sizes[size].container,
        sizes[size].text,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {StartIcon && <StartIcon className={cn(sizes[size].icon, "shrink-0")} />}
      <span className="truncate min-w-0 max-w-[240px]" title={label}>
        {label}
      </span>
      {EndIcon && <EndIcon className={cn(sizes[size].icon, "shrink-0")} />}
    </Component>
  );
}
