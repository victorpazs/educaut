"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { toast } from "@/lib/toast";

import type { IUpdateActivity } from "../_models";
import { getActivityById } from "../actions";

interface UseActivityResult {
  activity: IUpdateActivity | null;
  isLoading: boolean;
  hasError: boolean;
  reFetch: () => void;
}

export function useActivity(
  id: number | string | null | undefined
): UseActivityResult {
  const [activity, setActivity] = useState<IUpdateActivity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);
  const isMountedRef = useRef(false);

  const load = useCallback(async () => {
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    setIsLoading(true);
    setHasError(false);

    try {
      if (id === undefined || id === null || Number.isNaN(Number(id))) {
        setActivity(null);
        setIsLoading(false);
        setHasError(true);
        toast.error("Erro", "ID da atividade inválido.");
        return;
      }

      const numericId = Number(id);
      const response = await getActivityById(numericId);

      if (!isMountedRef.current || requestCounter.current !== currentRequest)
        return;

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
      if (!isMountedRef.current || requestCounter.current !== currentRequest)
        return;
      setActivity(null);
      setHasError(true);
      toast.error("Erro", "Não foi possível carregar a atividade.");
    } finally {
      if (isMountedRef.current && requestCounter.current === currentRequest) {
        setIsLoading(false);
      }
    }
  }, [id]);

  // Controla o ciclo de vida (mounted/unmounted)
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Chama no mount e sempre que o id mudar
  useEffect(() => {
    void load();
  }, [load]);

  return {
    activity,
    isLoading,
    hasError,
    reFetch: () => {
      void load();
    },
  };
}
