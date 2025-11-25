/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { changeBackgroundColor } from "@/lib/fabrics.utils";
import type { IActivityContent } from "@/app/(app)/activities/_models";

interface CanvasPreviewProps {
  data: IActivityContent["data"];
  height?: number;
  width?: number;
  className?: string;
}

export function CanvasPreview({
  data,
  height = 180,
  width,
  className = "",
}: CanvasPreviewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = React.useRef<any>(null);
  const fabricNSRef = React.useRef<any>(null);

  const fitContentToCanvas = React.useCallback(() => {
    if (!canvasInstanceRef.current) return;

    try {
      const canvas = canvasInstanceRef.current;
      const objects = canvas.getObjects?.() ?? [];

      if (!objects.length) {
        canvas.setViewportTransform?.([1, 0, 0, 1, 0, 0]);
        canvas.requestRenderAll?.();
        return;
      }

      // Calculate bounding box of all objects
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
        canvas.setViewportTransform?.([1, 0, 0, 1, 0, 0]);
        canvas.requestRenderAll?.();
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
    } catch (error) {
      console.error("Error fitting content to canvas:", error);
    }
  }, []);

  // Initialize canvas
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

      if (!f || !f.Canvas || !mounted) return;

      fabricNSRef.current = f;

      const parentEl = canvasRef.current?.parentElement as HTMLElement | null;
      const canvasWidth = width || (parentEl?.clientWidth ?? 800);

      const inst = new f.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: height,
        backgroundColor: data?.background || "#ffffff",
      });

      // Disable interactions for preview
      inst.selection = false;
      inst.isDrawingMode = false;
      inst.skipTargetFind = true;

      canvasInstanceRef.current = inst;

      // Load initial state
      if (data) {
        // Load JSON with callback to ensure objects are loaded
        await new Promise<void>((resolve) => {
          inst.loadFromJSON(data, () => {
            inst.requestRenderAll();
            resolve();
          });
        });

        changeBackgroundColor(inst, data.background || "#ffffff");

        // Disable interactions on all objects
        const objects = inst.getObjects?.() ?? [];
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

        inst.discardActiveObject?.();
        inst.requestRenderAll?.();

        // Fit content after objects are rendered
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fitContentToCanvas();
          });
        });
      }
    })();

    return () => {
      mounted = false;
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
    };
  }, []);

  // Update dimensions and handle resize
  React.useEffect(() => {
    if (!canvasInstanceRef.current || !canvasRef.current) return;

    const canvas = canvasInstanceRef.current;
    const parentEl = canvasRef.current.parentElement as HTMLElement | null;

    const updateDimensions = () => {
      if (!canvas || !parentEl) return;
      const canvasWidth = width || parentEl.clientWidth || 800;
      // Use provided height, or parent height, or default
      const canvasHeight =
        height !== undefined ? height : parentEl.clientHeight || 180;
      canvas.setHeight(canvasHeight);
      canvas.setWidth(canvasWidth);
      canvas.requestRenderAll?.();
      fitContentToCanvas();
    };

    // Initial update with a small delay to ensure parent has dimensions
    const timeoutId = setTimeout(updateDimensions, 0);

    // Always watch for resize to handle dynamic height changes
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (parentEl) {
      resizeObserver.observe(parentEl);
    }
    resizeObserver.observe(canvasRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [height, width, fitContentToCanvas]);

  return (
    <div className={`w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
