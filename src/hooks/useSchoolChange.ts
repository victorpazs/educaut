"use client";

import { useCallback, useTransition } from "react";

import { updateSelectedSchool } from "@/app/auth/actions";
import type { ISchool } from "@/types/db";
import { useSession } from "./useSession";

interface UseSchoolChangeResult {
  changeSchool: (nextSchool: ISchool | null) => void;
  isPending: boolean;
}

export function useSchoolChange(): UseSchoolChangeResult {
  const { school: currentSchool, setSchool } = useSession();
  const [isPending, startTransition] = useTransition();

  const changeSchool = useCallback(
    (nextSchool: ISchool | null) => {
      if (nextSchool?.id === currentSchool?.id) {
        return;
      }

      setSchool(nextSchool);

      startTransition(async () => {
        await updateSelectedSchool(nextSchool ? nextSchool.id : null);
      });
    },
    [currentSchool?.id, setSchool]
  );

  return { changeSchool, isPending };
}
