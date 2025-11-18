"use client";

import * as React from "react";
import { getSchoolFiles } from "@/app/(app)/_files/actions";
import type { ISchoolFile } from "@/app/(app)/_files/_models";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyList } from "@/components/empty-list";
import { FileQuestion } from "lucide-react";
import { FileCell } from "./FileCell";
import UploadDropzone from "./Upload/Dropzone";

type FilesListProps = {
  fileTypes?: string[];
};

export function FilesList({ fileTypes }: FilesListProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [files, setFiles] = React.useState<ISchoolFile[]>([]);

  React.useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const response = await getSchoolFiles();
        if (isCancelled) return;
        if (response.success && response.data) {
          setFiles(response.data);
        } else {
          setFiles([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="divide-y">
      <div className="space-y-4 px-6">
        <UploadDropzone fileTypes={fileTypes} />
      </div>
      {files.map((file) => (
        <FileCell key={file.id} file={file} />
      ))}
    </div>
  );
}
