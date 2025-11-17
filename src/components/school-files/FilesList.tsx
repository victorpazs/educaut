"use client";

import * as React from "react";
import { getSchoolFiles } from "@/app/(app)/_files/actions";
import type { ISchoolFile } from "@/app/(app)/_files/_models";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyList } from "@/components/empty-list";
import { FileQuestion } from "lucide-react";
import { FileCell } from "./FileCell";

export function FilesList() {
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

  if (!files.length) {
    return (
      <EmptyList
        title="Nenhum arquivo encontrado"
        description="Os arquivos da escola aparecerão aqui quando forem enviados."
        icon={FileQuestion}
      />
    );
  }

  return (
    <div className="divide-y">
      {files.map((file) => (
        <FileCell key={file.id} file={file} />
      ))}
    </div>
  );
}
