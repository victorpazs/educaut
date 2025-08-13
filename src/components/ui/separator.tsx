import * as React from "react";
import { cn } from "@/lib/utils";

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        "bg-border",
        className
      )}
      {...props}
    />
  );
}
