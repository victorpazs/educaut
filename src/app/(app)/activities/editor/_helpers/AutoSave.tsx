"use client";

import React from "react";
import { useCanvasEditor } from "@/components/canvas-editor/context";

export function AutoSave({ delayMs = 1500 }: { delayMs?: number }) {
  const { canvas, saveState, preview } = useCanvasEditor();
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!canvas || preview) return;
    const schedule = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        saveState();
      }, delayMs);
    };
    const onModified = () => schedule();
    const onAdded = () => schedule();
    const onRemoved = () => schedule();
    const onPath = () => schedule();
    canvas.on?.("object:modified", onModified);
    canvas.on?.("object:added", onAdded);
    canvas.on?.("object:removed", onRemoved);
    canvas.on?.("path:created", onPath);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      canvas.off?.("object:modified", onModified);
      canvas.off?.("object:added", onAdded);
      canvas.off?.("object:removed", onRemoved);
      canvas.off?.("path:created", onPath);
    };
  }, [canvas, preview, saveState, delayMs]);

  return null;
}
