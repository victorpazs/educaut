"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { toast } from "@/lib/toast";

import { getSchoolAttributesByType } from "../actions";
import type { AttributesData } from "@/app/(app)/_attributes/_models";
import type { UseAttributesResult } from "../_models";

export function useSchoolAttributes(): UseAttributesResult {
  const { school } = useSession();

  const [data, setData] = useState<AttributesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  const reFetch = useCallback(async () => {
    if (!school?.id) {
      setData(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }
    const isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    setIsLoading(true);
    setHasError(false);

    try {
      const response = await getSchoolAttributesByType();
      if (isMounted && requestCounter.current === currentRequest) {
        if (response.success) {
          setData(
            response.data ?? { attributesByType: {}, attributeTypes: [] }
          );
          setHasError(false);
        } else {
          setData(null);
          setHasError(true);
          toast.error(response.message);
        }
      }
    } catch {
      if (isMounted && requestCounter.current === currentRequest) {
        toast.error("Não foi possível carregar os atributos.");
        setHasError(true);
        setData(null);
      }
    } finally {
      if (isMounted && requestCounter.current === currentRequest) {
        setIsLoading(false);
      }
    }
  }, [school?.id]);

  useEffect(() => {
    reFetch();
  }, [reFetch]);

  return {
    data,
    isLoading,
    hasError,
    hasSchool: Boolean(school?.id),
    reFetch,
  };
}
