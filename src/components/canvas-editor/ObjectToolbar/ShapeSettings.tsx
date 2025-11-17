"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useCanvasEditor } from "../context";
import ColorInput from "@/components/ui/color-input";
import CornerRadiusInput from "./Components/CornerRadiusInput";

type ShapeSettingsProps = {
  object: any;
};

export default function ShapeSettings({ object }: ShapeSettingsProps) {
  const { canvas } = useCanvasEditor();
  const [, forceRerender] = React.useReducer((x: number) => x + 1, 0);

  const type = String(object?.type ?? "").toLowerCase();
  const [stroke, setStroke] = React.useState<string>(
    object?.stroke ?? "#111111"
  );
  const [cornerRadius, setCornerRadius] = React.useState<number>(
    Number(object?.rx ?? object?.ry ?? 0)
  );

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

  const isRect = type === "rect";

  return (
    <div className="flex items-center gap-2">
      <ColorInput
        icon
        value={stroke}
        onChange={(c) => {
          setStroke(c);
          apply({ stroke: c });
        }}
      />

      {isRect ? (
        <CornerRadiusInput
          value={cornerRadius}
          onChange={(v) => {
            setCornerRadius(v);
            apply({ rx: v, ry: v });
          }}
        />
      ) : null}
    </div>
  );
}
