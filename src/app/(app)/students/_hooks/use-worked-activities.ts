"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/lib/toast";
import { getWorkedActivitiesByStudent } from "../actions";
import type { IWorkedActivity } from "../actions";

interface UseWorkedActivitiesResult {
  activities: IWorkedActivity[];
  isLoading: boolean;
  hasError: boolean;
  refetch: () => Promise<void>;
}

export function useWorkedActivities(
  studentId: number | undefined
): UseWorkedActivitiesResult {
  const [activities, setActivities] = useState<IWorkedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const requestCounter = useRef(0);
  const isMountedRef = useRef(true);

  const loadActivities = useCallback(async () => {
    if (!studentId) {
      setActivities([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await getWorkedActivitiesByStudent(studentId);

      if (!isMountedRef.current || requestCounter.current !== currentRequest) {
        return;
      }

      if (res.success && res.data) {
        setActivities(res.data);
        setHasError(false);
      } else {
        setActivities([]);
        setHasError(true);
        toast.error(
          "Erro",
          res.message || "Não foi possível carregar as atividades."
        );
      }
    } catch (error) {
      if (!isMountedRef.current || requestCounter.current !== currentRequest) {
        return;
      }

      setActivities([]);
      setHasError(true);
      toast.error("Erro", "Falha ao carregar as atividades.");
    } finally {
      if (isMountedRef.current && requestCounter.current === currentRequest) {
        setIsLoading(false);
      }
    }
  }, [studentId]);

  useEffect(() => {
    isMountedRef.current = true;
    loadActivities();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadActivities]);

  return {
    activities,
    isLoading,
    hasError,
    refetch: loadActivities,
  };
}
