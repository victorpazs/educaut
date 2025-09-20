"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
  error?: string;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, value, onValueChange, placeholder, children, error, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");
    
    const selectRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string, label: string) => {
      setSelectedValue(value);
      onValueChange?.(value);
      setIsOpen(false);
    };

    const selectedLabel = React.useMemo(() => {
      if (!selectedValue) return placeholder || "Selecione uma opção";
      
      let label = "";
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && 
            (child.props as any).value === selectedValue) {
          label = (child.props as any).children;
        }
      });
      return label || selectedValue;
    }, [selectedValue, children, placeholder]);

    return (
      <div className="space-y-1">
        <div
          ref={selectRef}
          className={cn("relative", className)}
          {...props}
        >
          <div
            className={cn(
              "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500",
              !selectedValue && "text-muted-foreground"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </div>
          
          {isOpen && (
            <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-background shadow-lg">
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                      onSelect: () => handleSelect((child.props as any).value, (child.props as any).children as string),
                    })
                  : child
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, onSelect, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="cursor-pointer px-3 py-2 text-sm hover:bg-muted transition-colors"
        onClick={onSelect}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";