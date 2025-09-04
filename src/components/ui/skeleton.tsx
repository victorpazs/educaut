import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "avatar" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variants: Record<NonNullable<SkeletonProps["variant"]>, string> = {
    text: "h-4 w-full rounded",
    avatar: "h-10 w-10 rounded-full",
    rectangular: "w-full h-4 rounded",
    rounded: "w-full h-4 rounded-md",
  };

  const combinedStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={cn("animate-pulse bg-muted", variants[variant], className)}
      style={combinedStyle}
      {...props}
    />
  );
}

// Predefined skeleton components for common use cases
export function SkeletonText({
  lines = 1,
  className,
  ...props
}: { lines?: number } & Omit<SkeletonProps, "variant">) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={index === lines - 1 ? "w-3/4" : "w-full"}
          {...props}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar(props: Omit<SkeletonProps, "variant">) {
  return <Skeleton variant="avatar" {...props} />;
}

export function SkeletonCard({
  className,
  ...props
}: Omit<SkeletonProps, "variant">) {
  return (
    <div className={cn("space-y-3 p-4", className)} {...props}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonButton(props: Omit<SkeletonProps, "variant">) {
  return <Skeleton className="h-10 w-20 rounded-md" {...props} />;
}

export function SkeletonTable({
  rows = 3,
  columns = 4,
  className,
  ...props
}: { rows?: number; columns?: number } & Omit<SkeletonProps, "variant">) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Table header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-4 flex-1" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
