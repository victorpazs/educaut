"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
  renderEmpty?: (query: string, onClose?: () => void) => React.ReactNode;
  disabled?: boolean;
  // Modo de seleção:
  // - "single": comportamento padrão (valor único)
  // - "additive": não mantém um value; apenas chama onAdd ao selecionar
  mode?: "single" | "additive";
  // Usado para exibir o check quando em modo "additive"
  selectedValues?: number[];
  // Callback chamado ao selecionar um item no modo "additive"
  onAdd?: (option: ComboboxOption) => void;
  // Callback chamado ao clicar num item já selecionado no modo "additive"
  onRemove?: (option: ComboboxOption) => void;
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
  renderEmpty,
  disabled = false,
  mode = "single",
  selectedValues = [],
  onAdd,
  onRemove,
  ...maybeControlled
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isControlled =
    Object.prototype.hasOwnProperty.call(maybeControlled, "value") &&
    Object.prototype.hasOwnProperty.call(maybeControlled, "onChange");
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>("");
  const [searchValue, setSearchValue] = React.useState<string>("");

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

  const isAdditive = mode === "additive" && typeof onAdd === "function";

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!disabled) setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-[200px] justify-between", buttonClassName)}
        >
          {isAdditive
            ? placeholder
            : stringValue
            ? options.find((option) => option.value.toString() === stringValue)
                ?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("w-[200px] p-0", className)}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            onValueChange={setSearchValue}
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>
              {renderEmpty
                ? renderEmpty(searchValue, () => setOpen(false))
                : emptyText || "Nenhum resultado encontrado"}
            </CommandEmpty>
            <CommandGroup className="pt-1.5">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={(currentValue) => {
                    if (disabled) return;
                    if (isAdditive) {
                      const found = options.find(
                        (opt) => opt.value.toString() === currentValue
                      );
                      if (found) {
                        const isSelected = selectedValues.includes(found.value);
                        if (isSelected) {
                          onRemove?.(found);
                        } else {
                          onAdd?.(found);
                        }
                      }
                      return;
                    }
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
                      isAdditive
                        ? selectedValues.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                        : stringValue === option.value.toString()
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
