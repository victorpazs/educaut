"use client";

import React from "react";
import {
  Type as TypeIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  Minus as LineIcon,
  Image as ImageIcon,
  Shapes as ShapesIcon,
  CloudUpload,
  Settings2,
  Wallpaper,
} from "lucide-react";
import { useCanvasEditor } from "./context";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "@/components/ui/menu-bar";
import { Draggable } from "./Draggable";
import { cn, getAge } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 as LoaderIcon } from "lucide-react";
import ColorInput from "../ui/color-input";
import IconButton from "../ui/icon-button";
import { RectangleHorizontal, RectangleVertical } from "lucide-react";

type OptionsProps = {
  className?: string;
};

export default function Options({ className }: OptionsProps) {
  const {
    addTextDefault,
    addLineShape,
    addRectShape,
    addCircleShape,
    backgroundColor,
    setBackgroundColor,
    addImageUrlAt,
    preview,
    lastSavedAt,
    isSaving,
    orientation,
    setOrientation,
  } = useCanvasEditor();

  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <div className="flex items-center gap-2">
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
            shape: "image",
            label: "Imagem",
            icon: <ImageIcon className="h-4 w-4" />,
          }}
          onClick={() =>
            addImageUrlAt(
              typeof window !== "undefined"
                ? `${window.location.origin}/upload-here.png`
                : "/upload-here.png",
              150,
              150
            )
          }
        />
        <Menubar
          className={cn("bg-transparent! shadow-none! border-none!", className)}
        >
          <MenubarMenu>
            <MenubarTrigger
              disabled={preview}
              className={cn(
                "cursor-pointer! text-sm! font-normal! hover:bg-muted-foreground/10 text-foreground bg-transparent",
                preview ? "opacity-60 pointer-events-none" : ""
              )}
            >
              <ShapesIcon className="h-4 w-4 mr-2" />
              Formas
            </MenubarTrigger>
            <MenubarContent>
              <div className="flex flex-col items-stretch gap-2 p-1 min-w-[180px]">
                <Draggable
                  option={{
                    shape: "line",
                    label: "Linha",
                    icon: <LineIcon className="h-4 w-4" />,
                  }}
                  dragIcon={true}
                  onClick={() => addLineShape()}
                />
                <Draggable
                  option={{
                    shape: "rect",
                    label: "Retângulo",
                    icon: <SquareIcon className="h-4 w-4" />,
                  }}
                  dragIcon={true}
                  onClick={() => addRectShape()}
                />
                <Draggable
                  option={{
                    shape: "circle",
                    label: "Círculo",
                    icon: <CircleIcon className="h-4 w-4" />,
                  }}
                  dragIcon={true}
                  onClick={() => addCircleShape()}
                />
              </div>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="flex items-center gap-1">
        <ColorInput
          value={backgroundColor}
          onChange={(c) => {
            setBackgroundColor(c);
          }}
          trigger={
            <Button
              size="sm"
              className="font-normal! gap-2! px-1!"
              variant="ghost"
            >
              <span
                className="h-[11px]! w-3! rounded-[4px] outline outline-border"
                style={{ backgroundColor: backgroundColor }}
              />
              Cor de fundo
            </Button>
          }
        />
        <IconButton
          aria-label="Alternar orientação"
          title={`Orientação: ${
            orientation === "horizontal" ? "Horizontal" : "Vertical"
          }`}
          disabled={preview}
          onClick={() =>
            setOrientation(
              orientation === "horizontal" ? "vertical" : "horizontal"
            )
          }
          icon={
            orientation === "horizontal" ? (
              <RectangleHorizontal className="h-4 w-4" />
            ) : (
              <RectangleVertical className="h-4 w-4" />
            )
          }
        />
      </div>
    </div>
  );
}
