"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string | null;
  alt?: string;
  fallback?: string;
};

export function Avatar({
  className,
  children,
  src,
  alt,
  fallback,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-medium",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : children ? (
        children
      ) : (
        <UserIcon className="h-4 w-4" />
      )}
    </div>
  );
}
