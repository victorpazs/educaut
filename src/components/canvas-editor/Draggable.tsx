"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GripVertical } from "lucide-react";

interface DraggableProps {
  option: {
    shape: "text" | "line" | "rect" | "circle" | "image";
    label: string;
    icon: React.ReactNode;
  };
  onClick: () => void;
  dragIcon?: boolean;
}
export function Draggable({
  option,
  onClick,
  dragIcon = false,
}: DraggableProps) {
  const makeDraggableProps = (shape: DraggableProps["option"]["shape"]) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData("application/x-shape", shape);
      e.dataTransfer.effectAllowed = "copyMove";
    },
    title:
      shape === "text"
        ? "Texto"
        : shape === "line"
        ? "Linha"
        : shape === "rect"
        ? "Retângulo"
        : shape === "circle"
        ? "Círculo"
        : "Imagem",
    "aria-label":
      shape === "text"
        ? "Adicionar texto"
        : shape === "line"
        ? "Adicionar linha"
        : shape === "rect"
        ? "Adicionar retângulo"
        : shape === "circle"
        ? "Adicionar círculo"
        : "Adicionar imagem",
  });

  return (
    <div {...makeDraggableProps(option.shape)} className="w-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            title={option.label}
            aria-label={option.label}
            onClick={() => onClick()}
            className="w-full h-7 px-2 flex items-center justify-between rounded-md hover:bg-muted-foreground/10 text-foreground bg-transparent cursor-grab"
          >
            <div className="flex items-center gap-2">
              {option.icon}

              <span className="text-sm font-normal">{option.label}</span>
            </div>
            {dragIcon && <GripVertical className="h-4 w-4 text-secondary" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>{option.label}</TooltipContent>
      </Tooltip>
    </div>
  );
}
