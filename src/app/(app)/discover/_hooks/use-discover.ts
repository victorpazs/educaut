"use client";

import { useEffect, useRef, useState } from "react";

import { toast } from "@/lib/toast";

import type { IPublicActivity } from "../_models";
import { getPublicActivities } from "../actions";
import { IDiscoverActivityFilters } from "../page";

interface UseDiscoverResult {
  activities: IPublicActivity[];
  isLoading: boolean;
  hasError: boolean;
}

export function useDiscover(
  filters: IDiscoverActivityFilters
): UseDiscoverResult {
  const [activities, setActivities] = useState<IPublicActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const loadActivities = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getPublicActivities({
          search: filters.search,
          tags: filters.tags,
        });

        if (isMounted && requestCounter.current === currentRequest) {
          if (response.success) {
            setActivities(response.data ?? []);
            setHasError(false);
          } else {
            setActivities([]);
            setHasError(true);
            toast.error(response.message);
          }
        }
      } catch (err) {
        if (isMounted && requestCounter.current === currentRequest) {
          toast.error("Não foi possível carregar as atividades públicas.");
          setHasError(true);
          setActivities([]);
        }
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return {
    activities,
    isLoading,
    hasError,
  };
}
