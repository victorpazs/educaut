import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/lib/toast";

type FetchListResponse<TItem> = {
  success: boolean;
  data?: TItem[] | null;
  message?: string;
};

type UseServerListParams<TItem, TParams> = {
  fetcher: (params: TParams) => Promise<FetchListResponse<TItem>>;
  params: TParams;
  deps: unknown[];
  enabled?: boolean;
  errorMessage?: string;
};

type UseServerListResult<TItem> = {
  data: TItem[];
  isLoading: boolean;
  errorMsg: string | null;
  fetch: () => Promise<void>;
  onRemove: (id: string | number) => void;
  onAdd: (item: TItem) => void;
  onUpdate: (id: string | number, updater: (item: TItem) => TItem) => void;
};

export function useServerList<TItem extends { id: string | number }, TParams>({
  fetcher,
  params,
  deps,
  enabled = true,
  errorMessage,
}: UseServerListParams<TItem, TParams>): UseServerListResult<TItem> {
  const [data, setData] = useState<TItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const requestCounter = useRef(0);
  const isMountedRef = useRef(true);

  const fetch = useCallback(async () => {
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetcher(params);

      if (!isMountedRef.current || requestCounter.current !== currentRequest) {
        return;
      }

      if (response.success) {
        setData((response.data ?? []) as TItem[]);
        setErrorMsg(null);
      } else {
        const msg =
          errorMessage ?? response.message ?? "Falha ao carregar dados.";
        setData([]);
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err) {
      if (!isMountedRef.current || requestCounter.current !== currentRequest) {
        return;
      }

      const msg = errorMessage ?? "Falha ao carregar dados.";
      setErrorMsg(msg);
      setData([]);
      toast.error(msg);
    } finally {
      if (isMountedRef.current && requestCounter.current === currentRequest) {
        setIsLoading(false);
      }
    }
  }, [fetcher, params, errorMessage]);

  const onRemove = useCallback((id: string | number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const onAdd = useCallback((item: TItem) => {
    setData((prev) => [item, ...prev]);
  }, []);

  const onUpdate = useCallback(
    (id: string | number, updater: (item: TItem) => TItem) => {
      setData((prev) =>
        prev.map((item) => (item.id === id ? updater(item) : item))
      );
    },
    []
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      setData([]);
      setIsLoading(false);
      setErrorMsg(null);
      return;
    }

    fetch();

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    isLoading,
    errorMsg,
    fetch,
    onRemove,
    onAdd,
    onUpdate,
  };
}
