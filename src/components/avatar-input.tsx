"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxSizeMb) {
      toast.error(`Imagem muito grande. Máximo de ${maxSizeMb}MB.`);
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo inválido. Selecione uma imagem.");
      e.target.value = "";
      return;
    }

    setIsLoading(true);
    try {
      const toDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setPreview(toDataUrl);
      onChange?.(toDataUrl);
    } catch {
      toast.error("Falha ao carregar a imagem.");
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <Avatar
        className="h-16 w-16"
        src={preview ?? undefined}
        alt="Avatar preview"
      />
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={handlePick} disabled={disabled || isLoading}>
            {isLoading ? "Carregando..." : preview ? "Trocar" : "Escolher"}
          </Button>
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
      </div>
    </div>
  );
}



