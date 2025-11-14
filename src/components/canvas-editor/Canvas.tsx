"use client";
import React from "react";
import { useCanvasEditor } from "./context";
import { Card, CardContent } from "../ui/card";

export default function Canvas() {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const {
    canvasRef,
    addRectAt,
    addCircleAt,
    addLineAt,
    addTextAt,
    addImageFileAt,
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
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);
        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            await addImageFileAt(file, x, y);
          }
          document.body.removeChild(input);
        };
        input.click();
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
          className={`w-full ${
            preview ? "pointer-events-none select-none" : ""
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <canvas className="rounded-lg!" ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  );
}
