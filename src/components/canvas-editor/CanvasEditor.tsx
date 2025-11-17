"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  addCircle,
  addImageFromDataURL,
  addImageFromFile,
  addLine,
  addRect,
  addText,
  changeBackgroundColor,
  exportVectorPDF,
  printVectorPDF,
  getSerializedState,
  loadInitialState,
  setBrush,
  toggleDrawing,
} from "@/lib/fabrics.utils";
import { CanvasEditorContext } from "./context";
import ClipboardProvider from "./ClipboardProvider";

type CanvasEditorProps = {
  initialState?: unknown;
  onSave?: (state: unknown) => Promise<void>;
  onLoaded?: (payload: { fabricNS: any; canvas: any }) => void;
  width?: number;
  height?: number;
  name?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  preview?: boolean;
  orientation?: "horizontal" | "vertical";
};

const PORTRAIT_A4_RATIO = 210 / 297;
export default function CanvasEditor({
  initialState,
  onSave,
  onLoaded,
  width = 800,
  height = 600,
  backgroundColor = "#f0f0f0",
  children,
  fullWidth = false,
  preview = false,
  orientation = "horizontal",
  name,
}: CanvasEditorProps) {
  const fabricNSRef = React.useRef<any>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = React.useState<any>(null);
  const canvasInstanceRef = React.useRef<any>(null);
  const [hasSelection, setHasSelection] = React.useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [backgroundColorState, setBackgroundColorState] =
    React.useState<string>(backgroundColor);
  const [orientationState, setOrientationState] = React.useState<
    "horizontal" | "vertical"
  >(orientation);

  const applyPreviewState = React.useCallback(
    (c: any) => {
      if (!c) return;
      if (preview) {
        try {
          c.selection = false;
          c.isDrawingMode = false;
          c.skipTargetFind = true;
          const objects = c.getObjects?.() ?? [];
          for (const obj of objects) {
            if (!obj) continue;
            obj.selectable = false;
            obj.evented = false;
            obj.hasControls = false;
            obj.lockMovementX = true;
            obj.lockMovementY = true;
            obj.lockRotation = true;
            obj.lockScalingX = true;
            obj.lockScalingY = true;
            obj.hoverCursor = "default";
          }
          c.discardActiveObject?.();
          c.requestRenderAll?.();
        } catch {}
      } else {
        try {
          c.selection = true;
          c.skipTargetFind = false;
          if (typeof c.setViewportTransform === "function") {
            c.setViewportTransform([1, 0, 0, 1, 0, 0]);
          }
          c.requestRenderAll?.();
        } catch {}
      }
    },
    [preview]
  );

  const fitPreviewToContent = React.useCallback(() => {
    if (!canvas || !preview) return;
    try {
      const objects = canvas.getObjects?.() ?? [];
      if (!objects.length) {
        canvas.setViewportTransform?.([1, 0, 0, 1, 0, 0]);
        canvas.requestRenderAll?.();
        return;
      }
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const obj of objects) {
        if (!obj) continue;
        const br = obj.getBoundingRect?.(true);
        if (!br) continue;
        minX = Math.min(minX, br.left ?? 0);
        minY = Math.min(minY, br.top ?? 0);
        maxX = Math.max(maxX, (br.left ?? 0) + (br.width ?? 0));
        maxY = Math.max(maxY, (br.top ?? 0) + (br.height ?? 0));
      }
      if (
        !isFinite(minX) ||
        !isFinite(minY) ||
        !isFinite(maxX) ||
        !isFinite(maxY)
      ) {
        return;
      }
      const contentW = Math.max(1, maxX - minX);
      const contentH = Math.max(1, maxY - minY);
      const canvasW =
        (typeof canvas.getWidth === "function"
          ? canvas.getWidth()
          : (canvas as any).width) || 1;
      const canvasH =
        (typeof canvas.getHeight === "function"
          ? canvas.getHeight()
          : (canvas as any).height) || 1;
      const padding = 12;
      const zoom =
        Math.min(
          (canvasW - padding * 2) / contentW,
          (canvasH - padding * 2) / contentH
        ) || 1;
      const clampedZoom = Math.max(0.01, Math.min(zoom, 10));
      const offsetX =
        (canvasW - contentW * clampedZoom) / 2 - minX * clampedZoom;
      const offsetY =
        (canvasH - contentH * clampedZoom) / 2 - minY * clampedZoom;
      canvas.setViewportTransform?.([
        clampedZoom,
        0,
        0,
        clampedZoom,
        offsetX,
        offsetY,
      ]);
      canvas.requestRenderAll?.();
    } catch {
      // no-op
    }
  }, [canvas, preview]);

  const deleteSelected = React.useCallback(() => {
    if (!canvas || preview) return;
    try {
      const activeObjects = canvas.getActiveObjects?.() ?? [];
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj: any) => {
          canvas.remove(obj);
        });
        canvas.discardActiveObject?.();
        canvas.requestRenderAll?.();
        setHasSelection(false);
      }
    } catch {
      // no-op
    }
  }, [canvas, preview]);

  React.useEffect(() => {
    if (!canvasRef.current || canvasInstanceRef.current) return;
    let mounted = true;
    (async () => {
      const mod = await import("fabric");
      const f =
        (mod as any).fabric ??
        (mod as any).default?.fabric ??
        (mod as any).default ??
        mod;
      if (!f || !f.Canvas) return;
      if (!mounted) return;
      fabricNSRef.current = f;
      const parentEl = canvasRef.current?.parentElement as HTMLElement | null;
      // Compute initial dimensions following orientation rules.
      const effH = height;
      let initialWidth: number;
      if (fullWidth && parentEl) {
        if (orientationState === "vertical") {
          const portraitWidth = Math.round(effH * PORTRAIT_A4_RATIO);
          initialWidth = Math.min(parentEl.clientWidth, portraitWidth);
        } else {
          initialWidth = parentEl.clientWidth;
        }
      } else {
        if (orientationState === "vertical") {
          initialWidth = Math.round(effH * PORTRAIT_A4_RATIO);
        } else {
          initialWidth = width;
        }
      }
      const inst = new f.Canvas(canvasRef.current, {
        width: initialWidth,
        height: effH,
        backgroundColor: backgroundColorState,
      });
      canvasInstanceRef.current = inst;

      applyPreviewState(inst);
      setCanvas(inst);
      onLoaded?.({ fabricNS: f, canvas: inst });
    })();
    return () => {
      mounted = false;
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!canvas) return;
    if (!initialState) return;
    void loadInitialState(fabricNSRef.current, canvas, initialState).then(
      () => {
        applyPreviewState(canvas);
        fitPreviewToContent();
      }
    );
  }, [canvas, initialState, applyPreviewState, fitPreviewToContent]);

  React.useEffect(() => {
    if (!canvas) return;
    changeBackgroundColor(canvas, backgroundColorState || "#f0f0f0");
  }, [canvas, backgroundColorState]);

  // Sync prop changes into internal state
  React.useEffect(() => {
    setBackgroundColorState(backgroundColor);
    setOrientationState(orientation);
  }, [backgroundColor, orientation]);

  React.useEffect(() => {
    if (!canvas) return;
    const effH = height;
    if (typeof effH === "number" && effH > 0) {
      canvas.setHeight(effH);
    }
    if (!fullWidth) {
      if (orientationState === "vertical") {
        const portraitWidth = Math.round(effH * PORTRAIT_A4_RATIO);
        canvas.setWidth(portraitWidth);
      } else if (typeof width === "number" && width > 0) {
        canvas.setWidth(width);
      }
    } else {
      // Full width: only horizontal fills parent. Vertical keeps A4-proportional width, bounded by parent width.
      const parentEl = canvasRef.current?.parentElement as HTMLElement | null;
      if (parentEl) {
        if (orientationState === "vertical") {
          const portraitWidth = Math.round(effH * PORTRAIT_A4_RATIO);
          const bounded = Math.min(parentEl.clientWidth, portraitWidth);
          canvas.setWidth(bounded);
        } else {
          canvas.setWidth(parentEl.clientWidth);
        }
      }
    }
    canvas.requestRenderAll?.();
    fitPreviewToContent();
  }, [canvas, width, height, fullWidth, orientationState, fitPreviewToContent]);

  // Re-apply preview state whenever flag changes
  React.useEffect(() => {
    if (!canvas) return;
    applyPreviewState(canvas);
    fitPreviewToContent();
  }, [canvas, applyPreviewState, fitPreviewToContent]);

  // Track selection state
  React.useEffect(() => {
    if (!canvas) return;
    const onSelection = () => {
      if (preview) {
        setHasSelection(false);
        return;
      }
      try {
        const count = (canvas.getActiveObjects?.() ?? []).length;
        setHasSelection(count > 0);
      } catch {
        setHasSelection(false);
      }
    };
    canvas.on?.("selection:created", onSelection);
    canvas.on?.("selection:updated", onSelection);
    canvas.on?.("selection:cleared", onSelection);
    return () => {
      canvas.off?.("selection:created", onSelection);
      canvas.off?.("selection:updated", onSelection);
      canvas.off?.("selection:cleared", onSelection);
    };
  }, [canvas, preview]);

  // Keyboard delete handler
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (preview) return;
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase?.() ?? "";
        const isEditable =
          tag === "input" ||
          tag === "textarea" ||
          (target as any).isContentEditable;
        if (isEditable) return;
      }
      if (!canvas) return;
      const hasAny = (canvas.getActiveObjects?.() ?? []).length > 0;
      if (hasAny) {
        e.preventDefault();
        deleteSelected();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canvas, preview, deleteSelected]);

  React.useEffect(() => {
    if (!canvas || !canvasRef.current || !fullWidth) return;
    const parentEl = canvasRef.current.parentElement as HTMLElement | null;
    if (!parentEl) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentBoxSize =
          (entry.contentBoxSize as any)?.[0]?.inlineSize ??
          (entry.contentRect?.width as number);
        const newWidth =
          typeof contentBoxSize === "number" && contentBoxSize > 0
            ? contentBoxSize
            : parentEl.clientWidth;
        let targetWidth = newWidth;
        if (orientationState === "vertical") {
          const effH = height || canvas.getHeight?.() || 0;
          const portraitWidth = Math.round(effH * PORTRAIT_A4_RATIO);
          targetWidth = Math.min(newWidth, portraitWidth);
        }
        if (targetWidth && Math.abs(canvas.getWidth() - targetWidth) > 0.5) {
          canvas.setWidth(targetWidth);
          canvas.requestRenderAll();
          fitPreviewToContent();
        }
      }
    });
    ro.observe(parentEl);
    return () => {
      ro.disconnect();
    };
  }, [canvas, fullWidth, fitPreviewToContent]);

  const value = React.useMemo(
    () => ({
      fabricNS: fabricNSRef.current,
      canvas,
      canvasRef,
      preview,
      lastSavedAt,
      isSaving,
      hasSelection,
      name,
      backgroundColor: backgroundColorState,
      orientation: orientationState,
      setOrientation: (o: "horizontal" | "vertical") => {
        setOrientationState(o);
      },
      deleteSelected,
      setBackgroundColor: (color: string) => {
        if (!canvas) return;
        changeBackgroundColor(canvas, color);
        setBackgroundColorState(color);
      },
      addTextDefault: () => {
        if (!canvas) return;
        addText(fabricNSRef.current, canvas, "Text", {
          left: 100,
          top: 100,
          fill: "#000",
          fontSize: 24,
        });
      },
      addTextAt: (left: number, top: number, text = "Text") => {
        if (!canvas) return;
        addText(fabricNSRef.current, canvas, text, {
          left,
          top,
          fill: "#000",
          fontSize: 24,
        });
      },
      addImageFile: async (file: File) => {
        if (!canvas || !file) return;
        await addImageFromFile(fabricNSRef.current, canvas, file, {
          left: 150,
          top: 150,
          scaleX: 0.5,
          scaleY: 0.5,
        });
      },
      addImageFileAt: async (file: File, left: number, top: number) => {
        if (!canvas || !file) return;
        await addImageFromFile(fabricNSRef.current, canvas, file, {
          left,
          top,
          scaleX: 0.5,
          scaleY: 0.5,
        });
      },
      addImageUrlAt: async (url: string, left: number, top: number) => {
        if (!canvas || !url) return;
        await addImageFromDataURL(fabricNSRef.current, canvas, url, {
          left,
          top,
          scaleX: 0.5,
          scaleY: 0.5,
        });
      },
      setDrawActive: (active: boolean) => {
        if (!canvas) return;
        toggleDrawing(canvas, active);
      },
      setDrawBrush: (color: string, width: number) => {
        if (!canvas) return;
        setBrush(canvas, color, width);
      },
      addLineShape: () => {
        if (!canvas) return;
        addLine(fabricNSRef.current, canvas);
      },
      addLineAt: (x1: number, y1: number, x2?: number, y2?: number) => {
        if (!canvas) return;
        const endX = x2 ?? x1 + 120;
        const endY = y2 ?? y1;
        addLine(fabricNSRef.current, canvas, [x1, y1, endX, endY]);
      },
      addRectShape: () => {
        if (!canvas) return;
        addRect(fabricNSRef.current, canvas);
      },
      addRectAt: (left: number, top: number) => {
        if (!canvas) return;
        addRect(fabricNSRef.current, canvas, { left, top });
      },
      addCircleShape: () => {
        if (!canvas) return;
        addCircle(fabricNSRef.current, canvas);
      },
      addCircleAt: (left: number, top: number) => {
        if (!canvas) return;
        addCircle(fabricNSRef.current, canvas, { left, top });
      },
      exportPDF: async (filename?: string) => {
        if (!canvas) return;
        await exportVectorPDF(canvas, filename ?? "design.pdf");
      },
      printPDF: async () => {
        if (!canvas) return;
        await printVectorPDF(canvas);
      },
      saveState: async () => {
        if (!canvas) return;
        try {
          setIsSaving(true);
          await onSave?.(getSerializedState(canvas));
          setLastSavedAt(new Date());
        } finally {
          setIsSaving(false);
        }
      },
    }),
    [
      canvas,
      onSave,
      hasSelection,
      deleteSelected,
      preview,
      name,
      lastSavedAt,
      isSaving,
      backgroundColorState,
      orientationState,
    ]
  );

  return (
    <CanvasEditorContext.Provider value={value}>
      <ClipboardProvider />
      {children}
    </CanvasEditorContext.Provider>
  );
}
