"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "@/hooks/useSession";
import { toast } from "@/lib/toast";

import type { ICurrentClass } from "../_models";
import { getCurrentClass } from "../actions";

interface UseCurrentClassResult {
  currentClass: ICurrentClass | null;
  isLoading: boolean;
  hasError: boolean;
  hasSchool: boolean;
}

export function useCurrentClass(): UseCurrentClassResult {
  const { school } = useSession();

  const [currentClass, setCurrentClass] = useState<ICurrentClass | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    if (!school?.id) {
      setCurrentClass(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const loadCurrentClass = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getCurrentClass();

        if (isMounted && requestCounter.current === currentRequest) {
          if (response.success) {
            setCurrentClass(response.data ?? null);
            setHasError(false);
          } else {
            setCurrentClass(null);
            setHasError(false); // Not an error if no class is found
          }
        }
      } catch (err) {
        if (isMounted && requestCounter.current === currentRequest) {
          toast.error("Failed to load current class.");
          setHasError(true);
          setCurrentClass(null);
        }
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadCurrentClass();

    return () => {
      isMounted = false;
    };
  }, [school?.id]);

  return {
    currentClass,
    isLoading,
    hasError,
    hasSchool: Boolean(school?.id),
  };
}
