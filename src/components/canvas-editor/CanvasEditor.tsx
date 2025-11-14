"use client";
import React from "react";
import {
  addCircle,
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

type CanvasEditorProps = {
  initialState?: unknown;
  onSave?: (state: unknown) => void;
  onLoaded?: (payload: { fabricNS: any; canvas: any }) => void;
  width?: number;
  height?: number;
  name?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  preview?: boolean;
};

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
  name,
}: CanvasEditorProps) {
  const fabricNSRef = React.useRef<any>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = React.useState<any>(null);
  const canvasInstanceRef = React.useRef<any>(null);
  const [hasSelection, setHasSelection] = React.useState<boolean>(false);

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
          c.requestRenderAll?.();
        } catch {}
      }
    },
    [preview]
  );

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

  // Initialize ONCE
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
      const initialWidth = fullWidth && parentEl ? parentEl.clientWidth : width;
      const inst = new f.Canvas(canvasRef.current, {
        width: initialWidth,
        height,
        backgroundColor,
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
      }
    );
  }, [canvas, initialState, applyPreviewState]);

  React.useEffect(() => {
    if (!canvas) return;
    changeBackgroundColor(canvas, backgroundColor || "#f0f0f0");
  }, [canvas, backgroundColor]);

  React.useEffect(() => {
    if (!canvas) return;
    if (typeof height === "number" && height > 0) {
      canvas.setHeight(height);
      canvas.requestRenderAll();
    }
  }, [canvas, height]);

  // Re-apply preview state whenever flag changes
  React.useEffect(() => {
    if (!canvas) return;
    applyPreviewState(canvas);
  }, [canvas, applyPreviewState]);

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

  // Resize observer to keep canvas width = container width when fullWidth
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
        if (newWidth && Math.abs(canvas.getWidth() - newWidth) > 0.5) {
          canvas.setWidth(newWidth);
          canvas.requestRenderAll();
        }
      }
    });
    ro.observe(parentEl);
    return () => {
      ro.disconnect();
    };
  }, [canvas, fullWidth]);

  const value = React.useMemo(
    () => ({
      fabricNS: fabricNSRef.current,
      canvas,
      canvasRef,
      preview,
      hasSelection,
      name,
      deleteSelected,
      setBackground: (color: string) => {
        if (!canvas) return;
        changeBackgroundColor(canvas, color);
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
      saveState: () => {
        if (!canvas) return;
        onSave?.(getSerializedState(canvas));
      },
    }),
    [canvas, onSave, hasSelection, deleteSelected, preview, name]
  );

  return (
    <CanvasEditorContext.Provider value={value}>
      {children}
    </CanvasEditorContext.Provider>
  );
}
