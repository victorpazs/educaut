"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "@/hooks/useSession";
import { toast } from "@/lib/toast";

import type { IInsights } from "../_models";
import { getInsights } from "../actions";

interface UseInsightsResult {
  insights: IInsights | null;
  isLoading: boolean;
  hasError: boolean;
  hasSchool: boolean;
}

export function useInsights(): UseInsightsResult {
  const { school } = useSession();

  const [insights, setInsights] = useState<IInsights | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    if (!school?.id) {
      setInsights(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const loadInsights = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getInsights({
          schoolId: school.id,
        });

        if (isMounted && requestCounter.current === currentRequest) {
          if (response.success) {
            setInsights(response.data ?? null);
            setHasError(false);
          } else {
            setInsights(null);
            setHasError(true);
            toast.error(response.message);
          }
        }
      } catch (err) {
        if (isMounted && requestCounter.current === currentRequest) {
          toast.error("Não foi possível carregar os insights.");
          setHasError(true);
          setInsights(null);
        }
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadInsights();

    return () => {
      isMounted = false;
    };
  }, [school?.id]);

  return {
    insights,
    isLoading,
    hasError,
    hasSchool: Boolean(school?.id),
  };
}
