"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { Camera } from "lucide-react";
import { uploadImageToS3 } from "@/app/(app)/_files/actions";
import axios from "axios";

export interface AvatarInputProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  maxSizeMb?: number;
}

export function AvatarInput({
  value,
  onChange,
  className,
  disabled,
  label = "Avatar",
  maxSizeMb = 2,
}: AvatarInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(value ?? null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  React.useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handlePick = () => {
    if (disabled || isLoading) return;
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (disabled || isLoading) return;
    setPreview(null);
    onChange?.(null);
  };

  const processFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    try {
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > maxSizeMb) {
        toast.error(`Imagem muito grande. Máximo de ${maxSizeMb}MB.`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Arquivo inválido. Selecione uma imagem.");
        return;
      }

      // Criar preview local imediatamente
      const toDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setPreview(toDataUrl);

      // Gerar link de upload no S3
      const linkResponse = await uploadImageToS3(
        file.name,
        file.size,
        file.type || "image/jpeg"
      );

      if (!linkResponse.success || !linkResponse.data) {
        toast.error(
          "Erro ao gerar link de upload",
          linkResponse.message || "Tente novamente."
        );
        return;
      }

      const { uploadUrl, url } = linkResponse.data;

      // Upload direto para S3 usando axios
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type || "image/jpeg",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      // Atualizar com URL do S3
      setPreview(url);
      onChange?.(url);
      toast.success("Imagem enviada com sucesso.");
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error);
      toast.error(
        "Erro ao enviar imagem.",
        error.response?.data?.message || error.message || "Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled || isLoading) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled || isLoading) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled || isLoading) return;
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled || isLoading) return;
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full gap-4",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div
        className={cn(
          "relative inline-block group",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          isDragOver ? "ring-2 ring-primary ring-offset-2 rounded-full" : ""
        )}
        onClick={handlePick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={disabled || isLoading}
      >
        <Avatar
          className="h-24 w-24 group-hover:blur-xs group-hover:opacity-60"
          src={preview ?? undefined}
          alt="Avatar preview"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col gap-1 items-center justify-center rounded-full opacity-0 transition-all duration-200 ease-out",
            "bg-background/60",
            "group-hover:opacity-100",
            isDragOver ? "opacity-100" : ""
          )}
        >
          <Camera className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-bold tracking-wide">
            Upload
          </span>
        </div>
      </div>
      {preview ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          disabled={disabled || isLoading}
        >
          Remover
        </Button>
      ) : null}
    </div>
  );
}
