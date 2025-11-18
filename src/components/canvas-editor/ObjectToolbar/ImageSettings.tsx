"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCanvasEditor } from "../context";
import IconButton from "../../ui/icon-button";
import { Image as ImageIcon } from "lucide-react";
import {
  openImageFilePickerAndReplace,
  ensureImageAutoRender,
} from "./utils/image.utils";
import { SchoolFilesDialog } from "@/components/school-files";

type ImageSettingsProps = {
  object: any;
};

export default function ImageSettings({ object }: ImageSettingsProps) {
  const { canvas } = useCanvasEditor();

  React.useEffect(() => {
    if (object) {
      ensureImageAutoRender(object, canvas);
    }
  }, [object, canvas]);

  return (
    <div className="flex items-center gap-2">
      <SchoolFilesDialog
        fileTypes={["png", "jpg", "jpeg", "webp", "svg"]}
        trigger={
          <IconButton
            title="Trocar imagem"
            aria-label="Trocar imagem"
            icon={<ImageIcon className="h-4 w-4" />}
          />
        }
      />
    </div>
  );
}
