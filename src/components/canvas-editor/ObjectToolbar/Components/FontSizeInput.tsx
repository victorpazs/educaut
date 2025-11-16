"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FontSizeInputProps = {
  value: number;
  onChange: (size: number) => void;
};

export default function FontSizeInput({ value, onChange }: FontSizeInputProps) {
  return (
    <div
      className="inline-flex h-7 items-center overflow-hidden rounded-md border border-input bg-transparent"
      aria-label="Tamanho da fonte"
      role="group"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-none"
            onClick={() => onChange(Math.max(6, value - 1))}
            aria-label="Diminuir o tamanho"
            title="Diminuir o tamanho"
          >
            −
          </Button>
        </TooltipTrigger>
        <TooltipContent>Diminuir o tamanho</TooltipContent>
      </Tooltip>

      <span className="px-3 text-sm font-medium tabular-nums select-none min-w-10 text-center">
        {value}
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-none"
            onClick={() => onChange(Math.min(200, value + 1))}
            aria-label="Aumentar o tamanho"
            title="Aumentar o tamanho"
          >
            +
          </Button>
        </TooltipTrigger>
        <TooltipContent>Aumentar o tamanho</TooltipContent>
      </Tooltip>
    </div>
  );
}
