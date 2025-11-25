"use client";

import * as React from "react";
import { CloudUpload } from "lucide-react";
import axios from "axios";
import { Upload, type UploadProps, type UploadRenderState } from "./index";
import { generateUploadLink, confirmUpload } from "@/app/(app)/_files/actions";
import { toast } from "@/lib/toast";

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

type UploadDropzoneProps = Omit<
  UploadProps,
  "accept" | "children" | "onFiles"
> & {
  fileTypes?: string[];
  children?: React.ReactNode | ((state: UploadRenderState) => React.ReactNode);
  className?: string;
  onUploadSuccess?: () => void;
};

export function UploadDropzone({
  fileTypes,
  children,
  className,
  onUploadSuccess,
  ...props
}: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const accept = React.useMemo(
    () => buildAcceptFromFileTypes(fileTypes),
    [fileTypes]
  );

  const handleFiles = React.useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const file = files[0];
      setIsUploading(true);

      try {
        const linkResponse = await generateUploadLink(
          file.name,
          file.size,
          file.type || "application/octet-stream"
        );

        if (!linkResponse.success || !linkResponse.data) {
          toast.error("Erro ao gerar link de upload", linkResponse.message);
          setIsUploading(false);
          return;
        }

        const { uploadUrl, fileId, url } = linkResponse.data;
        console.log("Upload URL:", uploadUrl);
        console.log("File type:", typeof file);

        // Usar axios.put diretamente para garantir que o File seja enviado corretamente
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        const confirmResponse = await confirmUpload(fileId);

        if (confirmResponse.success) {
          toast.success("Arquivo enviado com sucesso.");
          onUploadSuccess?.();
        } else {
          toast.error("Erro ao confirmar upload", confirmResponse.message);
        }
      } catch (error: unknown) {
        console.error("Erro ao fazer upload:", error);
        const err = error as {
          response?: { data?: { message?: string } };
        };
        if (err.response) {
          toast.error(
            "Erro ao fazer upload",
            err.response.data?.message || "Erro desconhecido"
          );
        } else {
          toast.error(
            "Erro",
            "Não foi possível enviar o arquivo. Verifique sua conexão."
          );
        }
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadSuccess]
  );

  return (
    <Upload
      accept={accept}
      {...props}
      multiple={false}
      maxFiles={1}
      noClick
      noKeyboard
      onFiles={handleFiles}
      disabled={isUploading}
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
              {isUploading
                ? "Enviando arquivo..."
                : isActive
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
