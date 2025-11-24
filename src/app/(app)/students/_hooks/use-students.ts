"use client";

import { useCallback, useMemo } from "react";

import { useSession } from "@/hooks/useSession";
import { useServerList } from "@/hooks/useServerList";
import { toast } from "@/lib/toast";

import type { IStudent } from "../_models";
import { getStudents, deleteStudentAction } from "../actions";

interface UseStudentsResult {
  students: IStudent[];
  isLoading: boolean;
  hasError: boolean;
  hasSchool: boolean;
  removeLocal: (id: number) => void;
  refetch: () => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function useStudents(search: string): UseStudentsResult {
  const { school } = useSession();

  const { data, isLoading, errorMsg, fetch, onRemove } = useServerList<
    IStudent,
    { search: string }
  >({
    fetcher: getStudents,
    params: useMemo(() => ({ search }), [search]),
    deps: [school?.id, search],
    enabled: Boolean(school?.id),
    errorMessage: "Não foi possível carregar os alunos.",
  });

  const onDelete = useCallback(
    async (id: number) => {
      onRemove(id);

      try {
        const response = await deleteStudentAction(id);

        if (response.success) {
          toast.success("Aluno excluído com sucesso.");
        } else {
          toast.error(response.message || "Não foi possível excluir o aluno.");
        }
      } catch (err) {
        toast.error("Não foi possível excluir o aluno.");
      }
    },
    [onRemove]
  );

  return {
    students: data,
    isLoading,
    hasError: errorMsg !== null,
    hasSchool: Boolean(school?.id),
    removeLocal: (id: number) => onRemove(id),
    refetch: fetch,
    onDelete,
  };
}
