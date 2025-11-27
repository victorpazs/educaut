"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { createActivityAction, CreateActivityInput } from "../actions";
import { ActivityForm } from "./ActivityForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolFilesDialog } from "@/components/school-files";
import { Eye, Hammer, Pencil, Trash2, Upload } from "lucide-react";
import { FilePreview } from "@/components/school-files/FilePreview";
import { ISchoolFile } from "../../_files/_models";
import { getFileExtension } from "@/lib/utils";

interface NewActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: number, type: "canvas" | "upload") => void;
}

export function NewActivityDialog({
  open,
  onOpenChange,
  onCreated,
}: NewActivityDialogProps) {
  const [creating, setCreating] = React.useState(false);
  const [filesDialogOpen, setFilesDialogOpen] = React.useState(false);
  const [activity, setActivity] = React.useState<
    CreateActivityInput & {
      content?: {
        type: "canvas" | "upload";
        data: {
          version?: string;
          objects?: unknown[];
          background?: string;
          file_type?: string;
          url?: string;
        };
      };
    }
  >({
    name: "",
    description: "",
    tags: [],
    content: {
      type: "canvas",
      data: {
        version: "6.9.0",
        objects: [],
        background: "#ffffff",
      },
    },
  });

  const mode = activity.content?.type === "upload" ? "upload" : "canvas";

  const resetForm = () => {
    setActivity({
      name: "",
      description: "",
      tags: [],
      content: {
        type: "canvas",
        data: {
          version: "6.9.0",
          objects: [],
          background: "#ffffff",
        },
      },
    });
    setFilesDialogOpen(false);
  };

  const toggleTag = (tag: string) => {
    setActivity((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const handleCreate = async () => {
    if (!activity.name.trim()) {
      toast.error("Validação", "O nome da atividade é obrigatório.");
      return;
    }
    try {
      setCreating(true);
      const fileUrl =
        activity.content?.type === "upload" && activity.content.data.url
          ? activity.content.data.url
          : undefined;
      const res = await createActivityAction({
        name: activity.name.trim(),
        description: activity.description?.trim() || undefined,
        tags: activity.tags,
        fileUrl: fileUrl,
      });
      if (!res.success || !res.data) {
        toast.error(
          "Erro",
          res.message || "Não foi possível criar a atividade."
        );
        return;
      }
      onCreated?.(res.data.id, mode);

      setCreating(false);
      resetForm();
      handleClose();
    } catch {
      toast.error("Erro", "Não foi possível criar a atividade.");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectFile = (file: ISchoolFile) => {
    setFilesDialogOpen(false);
    const url = file.url;
    const fileName = file.url.split("/").pop() || "Atividade";
    const nameWithoutExtension = fileName.split(".")[0];
    const fileExtension = getFileExtension(url);

    setActivity((prev) => ({
      ...prev,
      name: prev.name || nameWithoutExtension,
      content: {
        type: "upload",
        data: {
          file_type: fileExtension,
          url: url,
        },
      },
    }));
  };

  const handleTabChange = (newMode: "canvas" | "upload") => {
    if (newMode === "upload") return;

    setActivity((prev) => ({
      ...prev,
      content: {
        type: "canvas",
        data: {
          version: "6.9.0",
          objects: [],
          background: "#ffffff",
        },
      },
    }));
  };

  const handlePreview = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          onClose={resetForm}
          className="max-h-[90vh] flex flex-col"
        >
          <DialogHeader className="shrink-0">
            <DialogTitle>Nova atividade</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-4 overflow-y-auto flex-1 min-h-0">
            <Tabs
              value={mode}
              onValueChange={(v) => handleTabChange(v as "canvas" | "upload")}
            >
              <ActivityForm
                name={activity.name}
                description={activity.description || ""}
                selectedTags={activity.tags}
                onNameChange={(value) =>
                  setActivity((prev) => ({ ...prev, name: value }))
                }
                onDescriptionChange={(value) =>
                  setActivity((prev) => ({ ...prev, description: value }))
                }
                onToggleTag={toggleTag}
              />

              <TabsList className="w-full mt-6 flex flex-col gap-3 p-2! h-auto bg-muted outline! outline-border!">
                <TabsTrigger
                  value="canvas"
                  className=" outline! outline-border! flex flex-row items-center justify-start gap-4 p-4! h-auto w-full border border-transparent rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:shadow-md hover:bg-background/50"
                >
                  <Hammer className="h-6 w-6 text-foreground shrink-0" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-bold text-sm">Criar do zero</span>
                    <span className="text-xs text-secondary text-left leading-relaxed">
                      Utilize um editor canvas para criar a atividade como
                      desejar
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setFilesDialogOpen(true)}
                  value="upload"
                  className=" outline! outline-border! flex flex-row items-center justify-start gap-4 p-4! h-auto w-full border border-transparent rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:shadow-md hover:bg-background/50"
                >
                  <Upload className="h-6 w-6 text-foreground shrink-0" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-bold text-sm">Fazer upload</span>
                    <span className="text-xs text-secondary text-left leading-relaxed">
                      Faça a importação de um arquivo de atividade (PDF, png,
                      jpeg, jpg)
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {mode === "upload" &&
              activity.content?.type === "upload" &&
              activity.content.data.url && (
                <div className="mt-4 w-full rounded-lg overflow-hidden bg-muted outline outline-border flex flex-col">
                  <FilePreview
                    url={activity.content.data.url}
                    type={activity.content.data.file_type || ""}
                    className="w-full h-full max-w-[360px] max-h-[360px] p-4 mx-auto"
                  />
                  <div className="flex items-center justify-end p-2 mt-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setFilesDialogOpen(true);
                        setActivity((prev) => ({
                          ...prev,
                          content: {
                            type: "upload",
                            data: {
                              file_type: "",
                              url: "",
                            },
                          },
                        }));
                      }}
                    >
                      <Pencil className="h-3 w-3 mr-2" />{" "}
                      <span className="text-xs">Alterar</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePreview(activity.content?.data.url)}
                    >
                      <Eye className="h-3 w-3 mr-2" />{" "}
                      <span className="text-xs">Preview</span>
                    </Button>
                  </div>
                </div>
              )}
          </div>
          <DialogFooter className="shrink-0">
            <Button variant="ghost" onClick={handleClose} disabled={creating}>
              Cancelar
            </Button>

            <Button
              disabled={
                creating || (mode === "upload" && !activity.content?.data.url)
              }
              onClick={handleCreate}
            >
              {creating
                ? "Criando..."
                : mode === "upload" && !activity.content?.data.url
                ? "Selecione um arquivo"
                : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SchoolFilesDialog
        open={filesDialogOpen}
        onOpenChange={setFilesDialogOpen}
        title="Selecione um arquivo"
        fileTypes={["pdf", "jpg", "jpeg", "png", "webp"]}
        onSelectFile={handleSelectFile}
      />
    </>
  );
}
