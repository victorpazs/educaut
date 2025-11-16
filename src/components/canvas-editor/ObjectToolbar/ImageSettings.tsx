"use client";
import React from "react";
import { useCanvasEditor } from "../context";
import CornerRadiusInput from "./Components/CornerRadiusInput";
import IconButton from "../../ui/icon-button";
import { Image as ImageIcon } from "lucide-react";
import {
  applyCornerRadiusToImage,
  openImageFilePickerAndReplace,
  ensureImageAutoRender,
} from "./utils/image.utils";

type ImageSettingsProps = {
  object: any;
};

export default function ImageSettings({ object }: ImageSettingsProps) {
  const { canvas, fabricNS } = useCanvasEditor();
  const [, forceRerender] = React.useReducer((x: number) => x + 1, 0);

  const initialRadius =
    Number(
      (object?.clipPath?.rx as number | undefined) ??
        (object?._cornerRadius as number | undefined) ??
        0
    ) || 0;
  const [cornerRadius, setCornerRadius] = React.useState<number>(initialRadius);

  React.useEffect(() => {
    if (object) {
      ensureImageAutoRender(object, canvas);
    }
  }, [object, canvas]);

  return (
    <div className="flex items-center gap-2">
      <IconButton
        title="Trocar imagem"
        aria-label="Trocar imagem"
        onClick={() => {
          openImageFilePickerAndReplace(object, canvas);
        }}
        icon={<ImageIcon className="h-4 w-4" />}
      />
      <CornerRadiusInput
        value={cornerRadius}
        onChange={(v) => {
          setCornerRadius(v);
          applyCornerRadiusToImage(object, fabricNS, canvas, v);
          forceRerender();
        }}
      />
    </div>
  );
}
