"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { getSchoolFiles, GetSchoolFilesParams } from "../actions";
import type { ISchoolFile } from "../_models";
import { useSession } from "@/hooks/useSession";
import { deleteSchoolFile } from "../actions";
import { toast } from "@/lib/toast";

interface Filter {
  page: number;
  limit: number;
  search: string;
  fileTypes?: string[];
}

interface UseSchoolFilesResult {
  files: ISchoolFile[];
  isLoading: boolean;
  hasError: boolean;
  filter: Filter;
  totalPages: number;
  total: number;
  setFilter: (filter: Partial<Filter> | ((prev: Filter) => Filter)) => void;
  onDelete: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_LIMIT = 12;

export function useSchoolFiles({
  fileTypes = [],
}: {
  fileTypes?: string[];
}): UseSchoolFilesResult {
  const { school } = useSession();
  const [filter, setFilter] = useState<Filter>({
    page: 1,
    limit: DEFAULT_LIMIT,
    search: "",
    fileTypes,
  });
  const [files, setFiles] = useState<ISchoolFile[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const memoizedParams = useMemo<GetSchoolFilesParams>(
    () => ({
      page: filter.page,
      limit: filter.limit,
      search: filter.search || undefined,
      fileTypes:
        filter.fileTypes && filter.fileTypes.length > 0
          ? filter.fileTypes
          : undefined,
    }),
    [filter.page, filter.limit, filter.search, filter.fileTypes]
  );

  const fetch = useCallback(async () => {
    if (!school?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await getSchoolFiles({ ...memoizedParams });

      if (response.success && response.data) {
        setFiles(response.data.files);
        setTotal(response.data.total);
      } else {
        setFiles([]);
        setTotal(0);
        setErrorMsg(
          response.message || "Não foi possível carregar os arquivos."
        );
        toast.error(
          response.message || "Não foi possível carregar os arquivos."
        );
      }
    } catch (error) {
      setFiles([]);
      setTotal(0);
      setErrorMsg("Não foi possível carregar os arquivos.");
      toast.error("Não foi possível carregar os arquivos.");
    } finally {
      setIsLoading(false);
    }
  }, [school?.id, memoizedParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const totalPages = Math.ceil(total / filter.limit) || 1;

  const handleSetFilter = useCallback(
    (newFilter: Partial<Filter> | ((prev: Filter) => Filter)) => {
      setFilter((prev) => {
        if (typeof newFilter === "function") {
          return newFilter(prev);
        }
        return { ...prev, ...newFilter };
      });
    },
    []
  );

  const onDelete = useCallback(
    async (id: number) => {
      setFiles((prev) => prev.filter((file) => file.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));

      try {
        const response = await deleteSchoolFile(id);

        if (response.success) {
          toast.success("Arquivo excluído com sucesso.");
          // Se a página atual ficou vazia e não é a primeira, voltar uma página
          if (files.length === 1 && filter.page > 1) {
            handleSetFilter((prev) => ({ ...prev, page: prev.page - 1 }));
          } else {
            fetch();
          }
        } else {
          toast.error(
            response.message || "Não foi possível excluir o arquivo."
          );
          fetch();
        }
      } catch {
        toast.error("Não foi possível excluir o arquivo.");
        fetch();
      }
    },
    [files.length, filter.page, fetch, handleSetFilter]
  );

  const refetch = useCallback(async () => {
    await fetch();
  }, [fetch]);

  return {
    files,
    isLoading,
    hasError: errorMsg !== null,
    filter,
    totalPages,
    total,
    setFilter: handleSetFilter,
    onDelete,
    refetch,
  };
}
