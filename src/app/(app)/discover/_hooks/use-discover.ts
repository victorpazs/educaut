"use client";

import { useMemo } from "react";

import type { IPublicActivity } from "../_models";
import { getPublicActivities } from "../actions";
import { IDiscoverActivityFilters } from "../page";
import { useServerList } from "@/hooks/useServerList";

interface UseDiscoverResult {
  activities: IPublicActivity[];
  isLoading: boolean;
  hasError: boolean;
}

export function useDiscover(
  filters: IDiscoverActivityFilters
): UseDiscoverResult {
  const { data, isLoading, errorMsg } = useServerList<
    IPublicActivity,
    { search?: string; tags: string[] }
  >({
    fetcher: getPublicActivities,
    params: useMemo(
      () => ({ search: filters.search, tags: filters.tags }),
      [filters]
    ),
    deps: [filters],
    enabled: true,
    errorMessage: "Não foi possível carregar as atividades públicas.",
  });

  return {
    activities: data,
    isLoading,
    hasError: errorMsg !== null,
  };
}
