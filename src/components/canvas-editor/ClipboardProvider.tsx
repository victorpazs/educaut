"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCanvasEditor } from "./context";

export default function ClipboardProvider() {
  const { canvas, fabricNS, preview } = useCanvasEditor();
  const clipboardRef = React.useRef<any | null>(null);

  const isTextEditingTarget = (el: HTMLElement | null) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase?.() ?? "";
    const isEditable =
      tag === "input" || tag === "textarea" || (el as any).isContentEditable;
    return isEditable;
  };

  const copySelection = React.useCallback(async () => {
    if (!canvas || preview) return;
    try {
      const active = canvas.getActiveObject?.();
      if (!active) return;
      const cloned =
        typeof active.clone === "function" ? await active.clone() : null;
      if (cloned) {
        clipboardRef.current = cloned;
      }
    } catch {
      // no-op
    }
  }, [canvas, preview]);

  const pasteClipboard = React.useCallback(async () => {
    if (!canvas || preview) return;
    const source = clipboardRef.current;
    if (!source) return;
    try {
      const clonedObj =
        typeof source.clone === "function" ? await source.clone() : null;
      if (!clonedObj) return;

      canvas.discardActiveObject?.();
      clonedObj.set?.({
        left: (clonedObj.left ?? 0) + 10,
        top: (clonedObj.top ?? 0) + 10,
        evented: true,
      });

      const isActiveSelection =
        fabricNS?.ActiveSelection &&
        clonedObj instanceof fabricNS.ActiveSelection;

      if (isActiveSelection) {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject?.((obj: any) => {
          canvas.add(obj);
        });
        clonedObj.setCoords?.();
      } else {
        canvas.add(clonedObj);
      }

      if (typeof source.top === "number") source.top += 10;
      if (typeof source.left === "number") source.left += 10;

      canvas.setActiveObject?.(clonedObj);
      canvas.requestRenderAll?.();
    } catch {
      // no-op
    }
  }, [canvas, preview, fabricNS]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (preview) return;
      const target = e.target as HTMLElement | null;
      if (isTextEditingTarget(target)) return;
      const key = (e.key || "").toLowerCase();
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      if (key === "c") {
        e.preventDefault();
        void copySelection();
      } else if (key === "v") {
        e.preventDefault();
        void pasteClipboard();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [copySelection, pasteClipboard, preview]);

  return null;
}
