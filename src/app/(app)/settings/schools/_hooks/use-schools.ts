"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/lib/toast";
import { getSchools } from "../actions";
import type { ISchool } from "@/types/db";

interface UseSchoolsResult {
  schools: ISchool[];
  isLoading: boolean;
  hasError: boolean;
  reload: () => void;
}

export function useSchools(search: string): UseSchoolsResult {
  const [schools, setSchools] = useState<ISchool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const load = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await getSchools({ search });
        if (isMounted && requestCounter.current === currentRequest) {
          if (response.success) {
            setSchools(response.data ?? []);
            setHasError(false);
          } else {
            setSchools([]);
            setHasError(true);
            toast.error(response.message);
          }
        }
      } catch {
        if (isMounted && requestCounter.current === currentRequest) {
          toast.error("Não foi possível carregar as escolas.");
          setHasError(true);
          setSchools([]);
        }
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [search, refreshKey]);

  return { schools, isLoading, hasError, reload };
}
