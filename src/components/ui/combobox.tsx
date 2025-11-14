"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
  value: number;
  label: string;
};

type BaseProps = {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  buttonClassName?: string;
  emptyComponent?: React.ReactNode;
};

type UncontrolledProps = {
  value?: undefined;
  onChange?: undefined;
};

type ControlledProps = {
  value: number | null;
  onChange: (value: number | null) => void;
};

type ComboboxProps = BaseProps & (UncontrolledProps | ControlledProps);

export function Combobox({
  options,
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nada encontrado.",
  className,
  buttonClassName,
  emptyComponent,
  ...maybeControlled
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isControlled =
    Object.prototype.hasOwnProperty.call(maybeControlled, "value") &&
    Object.prototype.hasOwnProperty.call(maybeControlled, "onChange");
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>("");

  const stringValue = React.useMemo(() => {
    if (isControlled) {
      const controlled = maybeControlled as ControlledProps;
      return controlled.value != null ? String(controlled.value) : "";
    }
    return uncontrolledValue;
  }, [isControlled, maybeControlled, uncontrolledValue]);

  const setStringValue = (next: string) => {
    if (isControlled) {
      const controlled = maybeControlled as ControlledProps;
      const parsed = next ? Number(next) : null;
      controlled.onChange(parsed);
    } else {
      setUncontrolledValue(next);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", buttonClassName)}
        >
          {stringValue
            ? options.find((option) => option.value.toString() === stringValue)
                ?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("w-[200px] p-0", className)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>
              {emptyComponent
                ? emptyComponent
                : emptyText || "Nenhum resultado encontrado"}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={(currentValue) => {
                    setStringValue(
                      currentValue === stringValue ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      stringValue === option.value.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
