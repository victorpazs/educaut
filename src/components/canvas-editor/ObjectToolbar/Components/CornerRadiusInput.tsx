"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import IconButton from "../../../ui/icon-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

type CornerRadiusInputProps = {
  value: number;
  onChange: (radius: number) => void;
};

export default function CornerRadiusInput({
  value,
  onChange,
}: CornerRadiusInputProps) {
  const [open, setOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState<number>(value ?? 0);

  React.useEffect(() => {
    setLocalValue(value ?? 0);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          title="Arredondamento dos cantos"
          aria-label="Arredondamento dos cantos"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17 5.75C10.787 5.75 5.75 10.787 5.75 17v2a.75.75 0 0 1-1.5 0v-2C4.25 9.958 9.958 4.25 17 4.25h2a.75.75 0 0 1 0 1.5z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[360px] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className=" text-sm font-medium">Arredondamento dos cantos</div>

          <Input
            type="number"
            className="w-16! h-7! text-center"
            min={0}
            max={100}
            value={localValue}
            onChange={(e) => {
              const next = Math.max(0, Number(e.target.value || 0));
              setLocalValue(next);
              onChange(next);
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <Slider
            min={0}
            max={100}
            step={1}
            value={[localValue]}
            onValueChange={(vals) => {
              const next = Math.max(0, Number(vals?.[0] ?? 0));
              setLocalValue(next);
              onChange(next);
            }}
            className="w-full"
            aria-label="Raio dos cantos"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
