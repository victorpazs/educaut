"use client";
import React from "react";
import { useCanvasEditor } from "./context";
import { Card, CardContent } from "../ui/card";
import ObjectToolbar from "./ObjectToolbar";

export default function Canvas() {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const {
    canvasRef,
    addRectAt,
    addCircleAt,
    addLineAt,
    addTextAt,
    addImageUrlAt,
    preview,
  } = useCanvasEditor();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (preview) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    if (preview) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (preview) return;
    e.preventDefault();
    setIsDragOver(false);
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const shape = e.dataTransfer.getData("application/x-shape");
    switch (shape) {
      case "rect":
        addRectAt(x, y);
        break;
      case "circle":
        addCircleAt(x, y);
        break;
      case "line":
        addLineAt(x - 60, y, x + 60, y);
        break;
      case "text":
        addTextAt(x, y, "Text");
        break;
      case "image": {
        const placeholderUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/upload-here.png`
            : "/upload-here.png";
        void addImageUrlAt(placeholderUrl, x, y);
        break;
      }
    }
  };
  return (
    <Card
      className={`shadow-none! rounded-lg! ${
        isDragOver ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      <CardContent className="p-0!">
        <div
          className={`w-full relative ${
            preview ? "pointer-events-none select-none" : ""
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <canvas className="rounded-lg!" ref={canvasRef} />
          <ObjectToolbar />
        </div>
      </CardContent>
    </Card>
  );
}
