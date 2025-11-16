import { Input } from "./input";
import type { ReactNode } from "react";

export default function ColorInput({
  value,
  onChange,
  icon = false,
  trigger,
}: {
  value: string;
  onChange: (color: string) => void;
  icon?: boolean;
  trigger?: ReactNode;
}) {
  if (trigger) {
    return (
      <label className="relative inline-flex">
        {trigger}
        <Input
          type="color"
          value={value}
          onChange={(e) => {
            const color = e.target.value;
            onChange(color);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Selecionar cor"
          title="Selecionar cor"
        />
      </label>
    );
  }
  if (icon) {
    return (
      <label className="relative h-7! w-7! px-2 flex items-center justify-center rounded-md border transition-colors border-border hover:bg-accent text-foreground bg-transparent cursor-pointer">
        <span
          className="h-[11px]! w-6! rounded-[4px] outline outline-border"
          style={{ backgroundColor: value }}
        />
        <Input
          type="color"
          value={value}
          onChange={(e) => {
            const color = e.target.value;
            onChange(color);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Selecionar cor"
          title="Selecionar cor"
        />
      </label>
    );
  }
  return (
    <Input
      type="color"
      value={value}
      onChange={(e) => {
        const color = e.target.value;
        onChange(color);
      }}
      className="w-7! h-7! p-0!"
    />
  );
}
