"use client";

import * as React from "react";
import { getSchoolFiles } from "@/app/(app)/_files/actions";
import type { ISchoolFile } from "@/app/(app)/_files/_models";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyList } from "@/components/empty-list";
import { FileQuestion } from "lucide-react";
import { FileCell } from "./FileCell";
import UploadDropzone from "./Upload/Dropzone";
import { PageLoader } from "../page-loader";

type FilesListProps = {
  fileTypes?: string[];
  onSelectFile?: (url: string) => void;
};

export function FilesList({ fileTypes, onSelectFile }: FilesListProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [files, setFiles] = React.useState<ISchoolFile[]>([]);

  const loadFiles = React.useCallback(async () => {
    try {
      const response = await getSchoolFiles();
      if (response.success && response.data) {
        setFiles(response.data);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    loadFiles().then(() => {
      if (isCancelled) return;
    });
    return () => {
      isCancelled = true;
    };
  }, [loadFiles]);

  return (
    <div className="divide-y">
      <div className="space-y-4 px-6">
        <UploadDropzone fileTypes={fileTypes} onUploadSuccess={loadFiles} />
        {isLoading ? <PageLoader /> : null}
        <div className="grid grid-cols-12 gap-4">
          {files.map((file) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4"
              key={file.id}
            >
              <FileCell
                file={file}
                onClick={() => onSelectFile?.(file.url)}
                onDeleted={loadFiles}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
