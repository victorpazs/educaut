"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IconButton from "../../../ui/icon-button";

type TextAlignTabsProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextAlignTabs({ value, onChange }: TextAlignTabsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          title="Alinhamento do texto"
          aria-label="Alinhamento do texto"
          icon={<AlignLeft className="h-4 w-4" />}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] p-3">
        <div className="text-sm font-medium mb-2">Alinhamento do texto</div>
        <Tabs
          value={value}
          onValueChange={(v) => {
            onChange(v);
          }}
        >
          <TabsList className="h-7 p-[2px] w-full grid grid-cols-4">
            <TabsTrigger
              value="left"
              aria-label="Alinhar à esquerda"
              title="Alinhar à esquerda"
            >
              <AlignLeft className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
              value="center"
              aria-label="Centralizar"
              title="Centralizar"
            >
              <AlignCenter className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
              value="right"
              aria-label="Alinhar à direita"
              title="Alinhar à direita"
            >
              <AlignRight className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
              value="justify"
              aria-label="Justificar"
              title="Justificar"
            >
              <AlignJustify className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
