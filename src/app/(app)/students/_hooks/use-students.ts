"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "@/hooks/useSession";
import { toast } from "@/lib/toast";

import type { IStudent } from "../_models";
import { getStudents } from "../actions";

interface UseStudentsResult {
  students: IStudent[];
  isLoading: boolean;
  hasError: boolean;
  hasSchool: boolean;
}

export function useStudents(search: string): UseStudentsResult {
  const { school } = useSession();

  const [students, setStudents] = useState<IStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    if (!school?.id) {
      setStudents([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const loadStudents = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getStudents({
          search,
        });

        if (isMounted && requestCounter.current === currentRequest) {
          if (response.success) {
            setStudents(response.data ?? []);
            setHasError(false);
          } else {
            setStudents([]);
            setHasError(true);
            toast.error(response.message);
          }
        }
      } catch (err) {
        if (isMounted && requestCounter.current === currentRequest) {
          toast.error("Não foi possível carregar os alunos.");
          setHasError(true);
          setStudents([]);
        }
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, [school?.id, search]);

  return {
    students,
    isLoading,
    hasError,
    hasSchool: Boolean(school?.id),
  };
}
