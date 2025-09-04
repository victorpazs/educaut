"use client";

import { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetcher";

export function useLiveQuery<T>(apiRoute: string) {
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<T[]>([]);
  useEffect(() => {
    setIsLoading(true);
    let timer = setTimeout(() => {
      const getData = async (): Promise<void> => {
        if (!searchText) return setIsLoading(false);
        try {
          const data = await fetchData(apiRoute, {
            search: searchText,
          });
          setOptions(data);
        } catch (err) {
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      };
      getData();
    }, 1000);

    return () => {
      if (timer !== null) clearTimeout(timer);
    };
  }, [searchText]);

  return {
    isLoading,
    searchText,
    setSearchText,
    options,
  };
}
