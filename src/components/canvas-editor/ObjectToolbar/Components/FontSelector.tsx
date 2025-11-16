"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FontSelectorProps = {
  value: string;
  onChange: (font: string) => void;
};

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        onChange(v);
      }}
    >
      <SelectTrigger className="w-44 h-7! px-2 py-0">
        <SelectValue placeholder="Fonte" />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value="Aharoni CLM">Aharoni CLM</SelectItem>
        <SelectItem value="Arial">Arial</SelectItem>
        <SelectItem value="Roboto">Roboto</SelectItem>
        <SelectItem value="Poppins">Poppins</SelectItem>
        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
        <SelectItem value="Courier New">Courier New</SelectItem>
      </SelectContent>
    </Select>
  );
}
