"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Type as TypeIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  Minus as LineIcon,
  Trash2 as TrashIcon,
  Pencil,
  MousePointer2,
  Image as ImageIcon,
  Palette,
} from "lucide-react";
import { useCanvasEditor } from "./context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Draggable } from "./Draggable";

type OptionsProps = {
  className?: string;
};

export default function Options({ className }: OptionsProps) {
  const {
    setBackground,
    addTextDefault,
    addTextAt,
    setDrawActive,
    setDrawBrush,
    addLineShape,
    addLineAt,
    addRectShape,
    addRectAt,
    addCircleShape,
    addCircleAt,
    addImageFile,
    deleteSelected,
    hasSelection,
    preview,
  } = useCanvasEditor();
  const [brushColor, setBrushColor] = React.useState("#ff0000");
  const [brushWidth, setBrushWidthState] = React.useState(5);
  const [drawOn, setDrawOn] = React.useState(false);

  const iconButton =
    "h-10 w-10 flex items-center justify-center rounded-md border border-border hover:bg-accent";

  const makeDraggableProps = (shape: "text" | "line" | "rect" | "circle") => ({
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
    <div
      className={`flex flex-wrap items-center gap-3 px-2 ${className ?? ""}`}
    >
      <Draggable
        option={{
          shape: "text",
          label: "Texto",
          icon: <TypeIcon className="h-4 w-4" />,
        }}
        onClick={() => addTextDefault()}
      />
      <Draggable
        option={{
          shape: "line",
          label: "Linha",
          icon: <LineIcon className="h-4 w-4" />,
        }}
        onClick={() => addLineShape()}
      />
      <Draggable
        option={{
          shape: "rect",
          label: "Retângulo",
          icon: <SquareIcon className="h-4 w-4" />,
        }}
        onClick={() => addRectShape()}
      />
      <Draggable
        option={{
          shape: "circle",
          label: "Círculo",
          icon: <CircleIcon className="h-4 w-4" />,
        }}
        onClick={() => addCircleShape()}
      />

      <Tabs
        value={drawOn ? "pencil" : "select"}
        onValueChange={(val) => {
          const next = val === "pencil";
          setDrawActive(next);
          setDrawOn(next);
        }}
      >
        <TabsList>
          <TabsTrigger
            value="select"
            aria-label="Selecionar"
            title="Selecionar"
          >
            <MousePointer2 className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="pencil" aria-label="Lápis" title="Lápis">
            <Pencil className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className={`flex items-center gap-2 ${drawOn ? "" : "opacity-60"}`}>
        <div
          className="h-10 w-10 flex items-center justify-center rounded-md border border-border"
          title="Cor do traço"
        >
          <Palette className="h-5 w-5 opacity-60" />
        </div>
        <Input
          type="color"
          value={brushColor}
          onChange={(e) => {
            const color = e.target.value;
            setBrushColor(color);
            setDrawBrush(color, brushWidth);
          }}
          className="w-10 h-10 p-1"
          aria-label="Selecionar cor do pincel"
          title="Selecionar cor do pincel"
        />
        <Input
          type="number"
          min={1}
          max={50}
          value={brushWidth}
          onChange={(e) => {
            const w = Number(e.target.value || 1);
            setBrushWidthState(w);
            setDrawBrush(brushColor, w);
          }}
          className="w-16"
          aria-label="Largura do pincel"
          title="Largura do pincel"
        />
      </div>
      <div className="h-6 w-px bg-border mx-1" />
      <label
        className={iconButton}
        title="Inserir imagem"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/x-shape", "image");
          e.dataTransfer.effectAllowed = "copyMove";
        }}
      >
        <ImageIcon className="h-5 w-5" />
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) await addImageFile(f);
          }}
          className="hidden"
          aria-label="Inserir imagem"
        />
      </label>
      <div className="h-6 w-px bg-border mx-1" />
      <button
        className={`${iconButton} ${
          !hasSelection || preview ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Remover seleção"
        aria-label="Remover seleção"
        onClick={() => {
          if (!hasSelection || preview) return;
          deleteSelected();
        }}
        disabled={!hasSelection || preview}
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
