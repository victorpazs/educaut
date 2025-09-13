"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { IconInput } from "./icon-input";
import { Button } from "./button";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  onClear?: () => void;
  showClearButton?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      showClearButton = true,
      placeholder = "Buscar...",
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = React.useState(value || "");

    React.useEffect(() => {
      if (value !== undefined) {
        setSearchValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);
      onChange?.(e);
    };

    const handleClear = () => {
      setSearchValue("");
      onClear?.();

      // Create synthetic event for onChange
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const clearButton =
      showClearButton && searchValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="px-3 py-0 h-full hover:bg-transparent cursor-pointer"
          onClick={handleClear}
          tabIndex={-1}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Limpar busca</span>
        </Button>
      ) : undefined;

    return (
      <IconInput
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        startIcon={Search}
        endContent={clearButton}
        className="min-w-[200px] text-sm "
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";
