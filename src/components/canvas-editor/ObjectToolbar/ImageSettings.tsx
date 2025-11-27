"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCanvasEditor } from "../context";
import IconButton from "../../ui/icon-button";
import { Image as ImageIcon } from "lucide-react";
import {
  ensureImageAutoRender,
  setObjectImageFromDataUrl,
} from "./utils/image.utils";
import { SchoolFilesDialog } from "@/components/school-files";
import { ISchoolFile } from "@/app/(app)/_files/_models";

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

  const handleSelectFile = React.useCallback(
    async (file: ISchoolFile) => {
      if (!object || !file || !file.url) return;
      const url = file.url;
      try {
        await setObjectImageFromDataUrl(object, url, canvas);
      } catch (error) {
        console.error("Erro ao atualizar imagem:", error);
      }
    },
    [object, canvas]
  );

  return (
    <div className="flex items-center gap-2">
      <SchoolFilesDialog
        onSelectFile={handleSelectFile}
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
