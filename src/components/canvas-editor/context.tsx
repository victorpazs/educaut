"use client";

import React from "react";

export type CanvasContextValue = {
  fabricNS: any;
  canvas: any;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  preview: boolean;
  name?: string;
  hasSelection: boolean;
  deleteSelected: () => void;
  setBackground: (color: string) => void;
  addTextDefault: () => void;
  addTextAt: (left: number, top: number, text?: string) => void;
  addImageFile: (file: File) => Promise<void>;
  addImageFileAt: (file: File, left: number, top: number) => Promise<void>;
  setDrawActive: (active: boolean) => void;
  setDrawBrush: (color: string, width: number) => void;
  addLineShape: () => void;
  addLineAt: (x1: number, y1: number, x2?: number, y2?: number) => void;
  addRectShape: () => void;
  addRectAt: (left: number, top: number) => void;
  addCircleShape: () => void;
  addCircleAt: (left: number, top: number) => void;
  exportPDF: (filename?: string) => Promise<void>;
  printPDF: () => Promise<void>;
  saveState: () => void;
};

export const CanvasEditorContext =
  React.createContext<CanvasContextValue | null>(null);

export function useCanvasEditor() {
  const ctx = React.useContext(CanvasEditorContext);
  if (!ctx) throw new Error("CanvasEditor.* must be used within CanvasEditor");
  return ctx;
}
