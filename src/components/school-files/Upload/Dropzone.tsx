"use client";

import * as React from "react";
import { CloudUpload } from "lucide-react";
import { Upload, type UploadProps, type UploadRenderState } from "./index";
import { Button } from "@/components/ui/button";

function buildAcceptFromFileTypes(fileTypes?: string[]): UploadProps["accept"] {
  if (!fileTypes || fileTypes.length === 0) return undefined;
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    txt: "text/plain",
    csv: "text/csv",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    json: "application/json",
  };

  const accept: NonNullable<UploadProps["accept"]> = {};
  for (const rawExt of fileTypes) {
    const ext = rawExt.replace(/^\./, "").toLowerCase();
    const mime = map[ext];
    if (mime) {
      accept[mime] = [];
    } else {
      // fallback por extensão
      const key = "*/*";
      const arr = accept[key] ?? [];
      if (!arr.includes(`.${ext}`)) {
        accept[key] = [...arr, `.${ext}`];
      }
    }
  }
  return Object.keys(accept).length ? accept : undefined;
}

type UploadDropzoneProps = Omit<UploadProps, "accept" | "children"> & {
  fileTypes?: string[];
  children?: React.ReactNode | ((state: UploadRenderState) => React.ReactNode);
  className?: string;
};

export function UploadDropzone({
  fileTypes,
  children,
  className,
  ...props
}: UploadDropzoneProps) {
  const accept = React.useMemo(
    () => buildAcceptFromFileTypes(fileTypes),
    [fileTypes]
  );

  return (
    <Upload
      accept={accept}
      {...props}
      multiple={false}
      maxFiles={1}
      noClick
      noKeyboard
    >
      {(state) => {
        if (typeof children === "function") {
          return children(state);
        }
        if (children) {
          return children;
        }
        const isActive = state.isDragActive;
        return (
          <div
            className={[
              "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center transition-colors",
              isActive ? "bg-muted/50 border-foreground/30" : "bg-transparent",
              className ?? "",
            ].join(" ")}
            onClick={state.open}
            role="button"
            aria-label="Selecionar ou soltar arquivos para upload"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                state.open();
              }
            }}
          >
            <CloudUpload className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm">
              {isActive
                ? "Solte os arquivos aqui"
                : "Arraste e solte arquivos, ou clique para selecionar"}
            </div>
            <div className="text-xs text-secondary">
              {fileTypes && fileTypes.length
                ? `Tipos de arquivos permitidos:`
                : "Todos os tipos são permitidos"}
              <br />
              <br />
              {fileTypes && fileTypes.length ? (
                <span className="text-xs font-semibold text-muted-foreground">
                  {fileTypes.join(", ")}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      }}
    </Upload>
  );
}

export default UploadDropzone;
