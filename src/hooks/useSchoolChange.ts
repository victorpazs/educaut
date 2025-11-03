"use client";

import { useCallback, useTransition } from "react";

import { persistSelectedSchool } from "@/actions/session";
import type { School } from "@/types/db";
import { useSession } from "./useSession";

interface UseSchoolChangeResult {
  changeSchool: (nextSchool: School | null) => void;
  isPending: boolean;
}

export function useSchoolChange(): UseSchoolChangeResult {
  const { school: currentSchool, setSchool } = useSession();
  const [isPending, startTransition] = useTransition();

  const changeSchool = useCallback(
    (nextSchool: School | null) => {
      if (nextSchool?.id === currentSchool?.id) {
        return;
      }

      setSchool(nextSchool);

      startTransition(async () => {
        await persistSelectedSchool(nextSchool ? nextSchool.id : null);
      });
    },
    [currentSchool?.id, setSchool]
  );

  return { changeSchool, isPending };
}

