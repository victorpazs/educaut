"use client";

import { useCallback, useMemo } from "react";

import type { IActivity } from "../_models";
import { getActivities, GetActivitiesParams, deleteActivity } from "../actions";
import { useSession } from "@/hooks/useSession";
import { useServerList } from "@/hooks/useServerList";
import { toast } from "@/lib/toast";

const EMPTY_TAGS: string[] = [];

interface UseActivitiesResult {
  activities: IActivity[];
  isLoading: boolean;
  hasError: boolean;
  onDelete: (id: number) => Promise<void>;
}

export function useActivities(
  params: GetActivitiesParams
): UseActivitiesResult {
  const { school } = useSession();

  const searchValue = params.search ?? "";
  // Use constant for empty array to avoid reference changes
  const tagsValue =
    params.tags && params.tags.length > 0 ? params.tags : EMPTY_TAGS;

  // Create a stable string representation of tags for dependency comparison
  const tagsKey = useMemo(() => {
    if (tagsValue.length === 0) return "";
    return [...tagsValue].sort().join(",");
  }, [tagsValue]);

  const memoizedParams = useMemo(
    () => ({ search: searchValue, tags: tagsValue }),
    [searchValue, tagsValue]
  );

  const { data, isLoading, errorMsg, onRemove } = useServerList<
    IActivity,
    GetActivitiesParams
  >({
    fetcher: getActivities,
    params: memoizedParams,
    deps: [school?.id, searchValue, tagsKey],
    enabled: Boolean(school?.id),
    errorMessage: "Não foi possível carregar as atividades.",
  });

  const onDelete = useCallback(
    async (id: number) => {
      onRemove(id);

      try {
        const response = await deleteActivity(id);

        if (response.success) {
          toast.success("Atividade excluída com sucesso.");
        } else {
          toast.error(
            response.message || "Não foi possível excluir a atividade."
          );
        }
      } catch {
        toast.error("Não foi possível excluir a atividade.");
      }
    },
    [onRemove]
  );

  return {
    activities: data,
    isLoading,
    hasError: errorMsg !== null,
    onDelete,
  };
}
