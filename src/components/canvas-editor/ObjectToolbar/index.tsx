"use client";

import React from "react";
import { useCanvasEditor } from "../context";
import TextSettings from "./TextSettings";
import ShapeSettings from "./ShapeSettings";
import ImageSettings from "./ImageSettings";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import IconButton from "../../ui/icon-button";

type Coords = { top: number; left: number };

export default function ObjectToolbar() {
  const { canvas, canvasRef, hasSelection, deleteSelected, preview } =
    useCanvasEditor();
  const [pos, setPos] = React.useState<Coords | null>(null);
  const [active, setActive] = React.useState<any>(null);

  const updatePosition = React.useCallback(() => {
    if (!canvas || !canvasRef?.current) {
      setPos(null);
      setActive(null);
      return;
    }
    const objs = canvas.getActiveObjects?.() ?? [];
    // Usa o objeto ativo quando há múltiplos (ActiveSelection), ou o único selecionado
    const obj =
      objs?.length > 1
        ? canvas.getActiveObject?.()
        : objs?.length === 1
        ? objs[0]
        : null;
    if (!obj) {
      setPos(null);
      setActive(null);
      return;
    }
    try {
      const br = obj.getBoundingRect?.(true) ?? { left: 0, top: 0, width: 0 };
      const centerX = (br.left ?? 0) + (br.width ?? 0) / 2;
      const top = (br.top ?? 0) - 56; // 56px acima do objeto
      setPos({
        top: Math.max(8, top),
        left: Math.max(8, centerX),
      });
      setActive(obj);
    } catch {
      setPos(null);
      setActive(null);
    }
  }, [canvas, canvasRef]);

  React.useEffect(() => {
    if (!canvas) return;
    const onChange = () => updatePosition();
    const onClear = () => {
      setPos(null);
      setActive(null);
    };
    canvas.on?.("selection:created", onChange);
    canvas.on?.("selection:updated", onChange);
    canvas.on?.("selection:cleared", onClear);
    canvas.on?.("object:moving", onChange);
    canvas.on?.("object:scaling", onChange);
    canvas.on?.("object:modified", onChange);
    return () => {
      canvas.off?.("selection:created", onChange);
      canvas.off?.("selection:updated", onChange);
      canvas.off?.("selection:cleared", onClear);
      canvas.off?.("object:moving", onChange);
      canvas.off?.("object:scaling", onChange);
      canvas.off?.("object:modified", onChange);
    };
  }, [canvas, updatePosition]);

  React.useEffect(() => {
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [updatePosition]);

  if (preview || !hasSelection || !pos || !active) return null;

  const type = String(active?.type ?? "").toLowerCase();

  return (
    <div
      className="absolute z-50 -translate-x-1/2 bg-background border border-border rounded-md shadow-md px-2 py-2 flex items-center gap-2"
      style={{ top: pos.top - 50, left: pos.left }}
    >
      {type === "i-text" || type === "textbox" ? (
        <TextSettings object={active} />
      ) : (
        <></>
      )}
      {type === "circle" || type === "rect" || type === "line" ? (
        <ShapeSettings object={active} />
      ) : null}
      {type === "image" ? <ImageSettings object={active} /> : null}

      <IconButton
        title="Remover elemento"
        aria-label="Remover elemento"
        onClick={() => deleteSelected()}
        icon={<Trash2 className="h-4 w-4" />}
      />
    </div>
  );
}
