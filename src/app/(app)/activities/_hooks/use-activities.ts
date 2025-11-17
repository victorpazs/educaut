"use client";

import { useEffect, useRef, useState } from "react";

import { toast } from "@/lib/toast";

import type { IActivity } from "../_models";
import { getActivities, GetActivitiesParams } from "../actions";
import { useSession } from "@/hooks/useSession";

interface UseActivitiesResult {
  activities: IActivity[];
  isLoading: boolean;
  hasError: boolean;
}

export function useActivities(
  params: GetActivitiesParams
): UseActivitiesResult {
  const { school } = useSession();
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    if (!school?.id) {
      setActivities([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const loadActivities = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getActivities({
          search: params.search,
          tags: params.tags ?? [],
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
          toast.error(
            "Não foi possível carregar as atividades.",
            `Falha ao carregar as atividades. ${JSON.stringify(err)}`
          );
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
  }, [params, school?.id]);

  return {
    activities,
    isLoading,
    hasError,
  };
}
