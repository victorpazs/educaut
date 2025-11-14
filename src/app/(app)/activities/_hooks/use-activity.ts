"use client";

import { useEffect, useRef, useState } from "react";

import { toast } from "@/lib/toast";

import type { IUpdateActivity } from "../_models";
import { getActivityById } from "../actions";

interface UseActivityResult {
  activity: IUpdateActivity | null;
  isLoading: boolean;
  hasError: boolean;
}

export function useActivity(
  id: number | string | null | undefined
): UseActivityResult {
  const [activity, setActivity] = useState<IUpdateActivity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const load = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const numericId = Number(id);
        const response = await getActivityById(numericId);

        if (!isMounted || requestCounter.current !== currentRequest) return;

        if (response.success && response.data) {
          setActivity(response.data as unknown as IUpdateActivity);
          setHasError(false);
        } else {
          setActivity(null);
          setHasError(true);
          toast.error(
            "Erro",
            response.message || "Não foi possível carregar a atividade."
          );
        }
      } catch {
        if (!isMounted || requestCounter.current !== currentRequest) return;
        setActivity(null);
        setHasError(true);
        toast.error("Erro", "Não foi possível carregar a atividade.");
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    if (id !== undefined && id !== null && !Number.isNaN(Number(id))) {
      load();
    } else {
      setActivity(null);
      setIsLoading(false);
      setHasError(true);
      toast.error("Erro", "ID da atividade inválido.");
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return {
    activity,
    isLoading,
    hasError,
  };
}
