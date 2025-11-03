"use client";

import { liveSearch, type LiveSearchResult } from "@/app/_search/actions";
import { useSession } from "./useSession";
import { useEffect, useState } from "react";

type UseLiveQueryOptions = {
  debounceMs?: number;
};

const DEFAULT_DEBOUNCE_MS = 600;

export function useLiveQuery<T extends LiveSearchResult = LiveSearchResult>(
  options?: UseLiveQueryOptions
) {
  const { school } = useSession();
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<T[]>([]);

  const debounceMs = options?.debounceMs ?? DEFAULT_DEBOUNCE_MS;

  useEffect(() => {
    const normalizedSearch = searchText.trim();

    if (!normalizedSearch) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (!school?.id) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await liveSearch({
          query: normalizedSearch,
          schoolId: school.id,
        });

        if (isCancelled) {
          return;
        }

        if (response.success && response.data) {
          setResults(response.data as T[]);
        } else {
          setResults([]);
        }
      } catch (error) {
        if (!isCancelled) {
          setResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [debounceMs, school?.id, searchText]);

  return {
    isLoading,
    searchText,
    setSearchText,
    options: results,
  };
}
