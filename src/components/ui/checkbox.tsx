"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  id?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, label, id, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked);

    React.useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleChange = () => {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      onCheckedChange?.(newChecked);
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            className="sr-only"
            checked={isChecked}
            onChange={handleChange}
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded border-2 border-input bg-background cursor-pointer transition-colors duration-200 flex items-center justify-center",
              isChecked && "bg-primary border-primary",
              className
            )}
            onClick={handleChange}
          >
            {isChecked && (
              <Check className="h-3 w-3 text-primary-foreground" />
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";