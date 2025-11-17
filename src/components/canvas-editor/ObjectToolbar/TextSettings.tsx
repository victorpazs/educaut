"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { List } from "lucide-react";
import { useCanvasEditor } from "../context";
import ColorInput from "@/components/ui/color-input";
import FontSelector from "./Components/FontSelector";
import FontSizeInput from "./Components/FontSizeInput";
import FontStyleButtons from "./Components/FontStyleButtons";
import TextAlignTabs from "./Components/TextAlignTabs";
import IconButton from "../../ui/icon-button";
import { Separator } from "@/components/ui/separator";

type TextSettingsProps = {
  object: any;
};

export default function TextSettings({ object }: TextSettingsProps) {
  const { canvas } = useCanvasEditor();
  const [, forceRerender] = React.useReducer((x: number) => x + 1, 0);

  const [font, setFont] = React.useState<string>(object?.fontFamily ?? "Arial");
  const [fontSize, setFontSize] = React.useState<number>(
    Number(object?.fontSize ?? 24)
  );
  const [color, setColor] = React.useState<string>(object?.fill ?? "#000000");
  const [align, setAlign] = React.useState<string>(object?.textAlign ?? "left");

  const isBold = String(object?.fontWeight ?? "normal") === "bold";
  const isItalic = String(object?.fontStyle ?? "normal") === "italic";
  const isUnderline = Boolean(object?.underline ?? false);
  const isStrike = Boolean(object?.linethrough ?? false);

  const apply = React.useCallback(
    (props: Record<string, any>) => {
      if (!object) return;
      object.set(props);
      object.setCoords?.();
      canvas?.requestRenderAll?.();
      forceRerender();
    },
    [canvas, object]
  );

  const toggleList = () => {
    if (!object || typeof object.text !== "string") return;
    const lines = object.text.split("\n");
    const hasBullets = lines.every((l: string) =>
      l.trimStart().startsWith("• ")
    );
    const next = hasBullets
      ? lines.map((l: string) => l.replace(/^(\s*)•\s+/u, "$1")).join("\n")
      : lines.map((l: string) => (l.trim().length ? `• ${l}` : l)).join("\n");
    apply({ text: next });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <FontSelector
          value={font}
          onChange={(v) => {
            setFont(v);
            apply({ fontFamily: v });
          }}
        />

        <FontSizeInput
          value={fontSize}
          onChange={(v) => {
            setFontSize(v);
            apply({ fontSize: v });
          }}
        />

        <ColorInput
          icon
          value={color}
          onChange={(c) => {
            setColor(c);
            apply({ fill: c });
          }}
        />
      </div>
      <div className="h-5! w-px! bg-secondary!" />
      <FontStyleButtons
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        isStrike={isStrike}
        onToggleBold={() => apply({ fontWeight: isBold ? "normal" : "bold" })}
        onToggleItalic={() =>
          apply({ fontStyle: isItalic ? "normal" : "italic" })
        }
        onToggleUnderline={() => apply({ underline: !isUnderline })}
        onToggleStrikethrough={() => apply({ linethrough: !isStrike })}
      />
      <div className="h-5! w-px! bg-secondary!" />

      <div className="flex items-center gap-1">
        <TextAlignTabs
          value={align}
          onChange={(v) => {
            setAlign(v);
            apply({ textAlign: v });
          }}
        />

        <IconButton
          title="Lista com marcadores"
          onClick={toggleList}
          icon={<List className="h-4 w-4" />}
        />
      </div>
      <div className="h-5! w-px! bg-secondary!" />
    </div>
  );
}
