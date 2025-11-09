"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Popover, PopoverContent } from "./popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export type AutocompleteOption = {
  label: string;
  value: string;
};

export interface AutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  options: AutocompleteOption[];
  emptyMessage?: string;
  onSelectOption?: (option: AutocompleteOption) => void;
  maxVisibleOptions?: number;
  className?: string;
  listClassName?: string;
  optionClassName?: string;
}

export const Autocomplete = React.forwardRef<
  HTMLInputElement,
  AutocompleteProps
>(
  (
    {
      options,
      value,
      onChange,
      onSelectOption,
      onKeyDown,
      onBlur,
      onFocus,
      placeholder = "Digite para filtrar...",
      emptyMessage = "Nenhuma opção encontrada",
      disabled,
      maxVisibleOptions = 6,
      className,
      listClassName,
      optionClassName,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value ?? "");
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

    // Sync controlled value
    React.useEffect(() => {
      if (value !== undefined) {
        setInputValue(value);
      }
    }, [value]);

    const filteredOptions = React.useMemo(() => {
      const normalized = String(inputValue ?? "")
        .toLowerCase()
        .trim();
      const result = normalized
        ? options.filter((o) => o.label.toLowerCase().includes(normalized))
        : options.slice();
      return result.slice(0, Math.max(1, maxVisibleOptions));
    }, [inputValue, options, maxVisibleOptions]);

    const hasResults = filteredOptions.length > 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      setInputValue(newVal);
      setOpen(true);
      onChange?.(e);
      setHighlightedIndex(0);
    };

    const commitSelection = (option: AutocompleteOption | undefined) => {
      if (!option) return;
      setInputValue(option.label);
      onSelectOption?.(option);
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) {
        onKeyDown?.(e);
        return;
      }
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setOpen(true);
      }

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (!hasResults) break;
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (!hasResults) break;
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        }
        case "Enter": {
          if (
            open &&
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            e.preventDefault();
            commitSelection(filteredOptions[highlightedIndex]);
          }
          break;
        }
        case "Escape": {
          if (open) {
            e.preventDefault();
            setOpen(false);
          }
          break;
        }
      }
      onKeyDown?.(e);
    };

    // Keep popover open while interacting with list
    const blurTimeoutRef = React.useRef<number | null>(null);
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      setOpen(true);
      onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Delay closing to allow click selection
      if (blurTimeoutRef.current) {
        window.clearTimeout(blurTimeoutRef.current);
      }
      blurTimeoutRef.current = window.setTimeout(() => {
        setOpen(false);
      }, 100);
      onBlur?.(e);
    };

    // Anchor ensures correct positioning with a non-trigger element
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Anchor asChild>
          <div className="w-full">
            <Input
              ref={ref}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={open ? "autocomplete-listbox" : undefined}
              role="combobox"
              className={cn(className)}
              {...props}
            />
          </div>
        </PopoverPrimitive.Anchor>

        <PopoverContent
          align="start"
          sideOffset={4}
          className={cn(
            "p-0 w-[var(--radix-popover-trigger-width)] min-w-[12rem] overflow-hidden",
            listClassName
          )}
        >
          <div
            id="autocomplete-listbox"
            role="listbox"
            aria-label="Sugestões"
            className="max-h-64 overflow-y-auto py-1"
          >
            {hasResults ? (
              filteredOptions.map((option, index) => {
                const isActive = index === highlightedIndex;
                return (
                  <button
                    type="button"
                    key={option.value}
                    role="option"
                    aria-selected={isActive}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block w-full cursor-pointer text-left text-sm px-2 py-1.5",
                      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "",
                      optionClassName
                    )}
                    onMouseDown={(e) => {
                      // Prevent input blur before click handler
                      e.preventDefault();
                    }}
                    onClick={() => commitSelection(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    data-selected={isActive ? "true" : undefined}
                  >
                    {option.label}
                  </button>
                );
              })
            ) : (
              <div className="text-secondary px-2 py-2 text-sm">
                {emptyMessage}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
