"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  isSelected?: boolean;
};

export default function IconButton({
  icon,
  isSelected,
  className,
  ...rest
}: IconButtonProps) {
  const base =
    "h-7 w-7 flex items-center justify-center rounded-md border transition-colors";
  const notSelected =
    "border-border hover:bg-accent text-foreground bg-transparent";
  const selected = "bg-primary text-primary-foreground border-primary";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={`${base} ${isSelected ? selected : notSelected} ${
            className ?? ""
          }`}
          {...rest}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>{rest.title || ""}</TooltipContent>
    </Tooltip>
  );
}
