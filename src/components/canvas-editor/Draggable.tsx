"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DraggableProps {
  option: {
    shape: "text" | "line" | "rect" | "circle";
    label: string;
    icon: React.ReactNode;
  };
  onClick: () => void;
}
export function Draggable({ option, onClick }: DraggableProps) {
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
        : "Círculo",
    "aria-label":
      shape === "text"
        ? "Adicionar texto"
        : shape === "line"
        ? "Adicionar linha"
        : shape === "rect"
        ? "Adicionar retângulo"
        : "Adicionar círculo",
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={
            "h-8 w-8 flex items-center justify-center rounded-md cursor-grab hover:bg-accent"
          }
          onClick={() => onClick()}
          {...makeDraggableProps(option.shape)}
        >
          {option.icon}
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{option.label}</TooltipContent>
    </Tooltip>
  );
}
