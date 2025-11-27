"use client";

import * as React from "react";
import { FileAudio } from "lucide-react";
import { getIconByType } from "./utils";

type FilePreviewProps = {
  url: string;
  type: string;
  className?: string;
};

export function FilePreview({ url, type, className = "" }: FilePreviewProps) {
  const [imageError, setImageError] = React.useState(false);
  const fileType = (type || "").toLowerCase();
  const Icon = getIconByType(type);

  if (
    !imageError &&
    (fileType === "png" ||
      fileType === "jpg" ||
      fileType === "jpeg" ||
      fileType === "webp" ||
      fileType === "gif" ||
      fileType === "svg")
  ) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <img
          src={url}
          alt="Preview"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  if (fileType === "mp4" || fileType === "webm" || fileType === "ogg") {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-muted ${className}`}
      >
        <video
          src={url}
          className="w-full h-full object-contain"
          controls={false}
          preload="metadata"
        >
          Seu navegador não suporta vídeo.
        </video>
      </div>
    );
  }

  // Renderizar áudio
  if (fileType === "mp3" || fileType === "wav" || fileType === "ogg") {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-muted ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <FileAudio className="h-16 w-16 text-muted-foreground" />
          <audio src={url} controls className="w-full max-w-xs" />
        </div>
      </div>
    );
  }

  // Renderizar PDF (iframe)
  if (fileType === "pdf") {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-muted ${className}`}
      >
        <iframe
          src={url}
          className="w-full h-full min-w-[220px] min-h-[200px]"
          title="PDF Preview"
        />
      </div>
    );
  }

  // Fallback: ícone do tipo de arquivo
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-muted ${className}`}
    >
      <Icon className="h-16 w-16 text-muted-foreground" />
    </div>
  );
}
