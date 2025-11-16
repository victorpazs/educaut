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
  } = useCanvasEditor();

  const formatElapsed = React.useCallback((date: Date | null) => {
    if (!date) return "poucos segundos";
    const nowMs = Date.now();
    const thenMs = date.getTime();
    const diffMs = Math.max(0, nowMs - thenMs);
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) {
      return "poucos segundos";
    }
    const min = Math.floor(sec / 60);
    if (min < 60) {
      return min === 1 ? "1 minuto" : `${min} minutos`;
    }
    const hrs = Math.floor(min / 60);
    if (hrs < 24) {
      return hrs === 1 ? "1 hora" : `${hrs} horas`;
    }
    return getAge(date) ?? "—";
  }, []);
  const savedAgo = `Alterações salvas há ${formatElapsed(lastSavedAt)}`;
  const statusText = isSaving ? "Salvando as alterações..." : savedAgo;
  return (
    <div className="flex items-center">
      <Menubar
        className={cn("bg-transparent! shadow-none! border-none!", className)}
      >
        <MenubarMenu>
          <MenubarTrigger
            disabled={preview}
            className={cn(
              "cursor-pointer! text-sm! font-normal!",
              preview ? "opacity-60 pointer-events-none" : ""
            )}
          >
            <ShapesIcon className="h-4 w-4 mr-2" />
            Elementos
          </MenubarTrigger>
          <MenubarContent>
            <div className="flex flex-col items-stretch gap-2 p-1 min-w-[220px]">
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
            </div>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <ColorInput
        value={backgroundColor}
        onChange={(c) => {
          setBackgroundColor(c);
        }}
        trigger={
          <Button size="sm" className="font-normal! gap-2!" variant="ghost">
            <span
              className="h-[11px]! w-3! rounded-[4px] outline outline-border"
              style={{ backgroundColor: backgroundColor }}
            />
            Background
          </Button>
        }
      />
      <Button
        size="sm"
        className="font-normal! text-secondary"
        disabled={isSaving}
        variant="ghost"
      >
        {isSaving ? (
          <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CloudUpload className="h-4 w-4 mr-2" />
        )}
        {statusText}
      </Button>
    </div>
  );
}
