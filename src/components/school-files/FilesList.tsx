"use client";

import * as React from "react";
import type { ISchoolFile } from "@/app/(app)/_files/_models";
import { FileCell } from "./FileCell";
import UploadDropzone from "./Upload/Dropzone";
import { PageLoader } from "../page-loader";
import { useSchoolFiles } from "@/app/(app)/_files/_hooks/use-school-files";
import { PaginationControls } from "./pagination-utils";

type FilesListProps = {
  fileTypes?: string[];
  onSelectFile?: (file: ISchoolFile) => void;
};

export function FilesList({ fileTypes, onSelectFile }: FilesListProps) {
  const { files, isLoading, filter, totalPages, setFilter, onDelete, refetch } =
    useSchoolFiles({ fileTypes });

  const handleDelete = React.useCallback(
    async (id: number) => {
      await onDelete(id);
    },
    [onDelete]
  );

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setFilter({ page: newPage });
    },
    [setFilter]
  );

  return (
    <div className="divide-y">
      <div className="space-y-4 px-6">
        <UploadDropzone fileTypes={fileTypes} onUploadSuccess={refetch} />
        {isLoading ? <PageLoader /> : null}
        <div className="grid grid-cols-12 gap-4">
          {files.map((file) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4"
              key={file.id}
            >
              <FileCell
                file={file}
                onClick={() => onSelectFile?.(file)}
                onDeleted={() => handleDelete(file.id)}
              />
            </div>
          ))}
        </div>
        <PaginationControls
          page={filter.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
