"use client";

import type { ISchool, User } from "@/types/db";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

interface SessionContextValue {
  user: (User & { schools?: ISchool[] }) | null;
  school: ISchool | null;
  setSchool: (school: ISchool | null) => void;
  reload: () => void;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function SessionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Omit<SessionContextValue, "setSchool" | "reload">;
}) {
  const [currentSchool, setCurrentSchool] = useState<ISchool | null>(
    value.school
  );
  const router = useRouter();

  useEffect(() => {
    setCurrentSchool(value.school);
  }, [value.school]);

  const handleSetSchool = useCallback((nextSchool: ISchool | null) => {
    setCurrentSchool(nextSchool);
  }, []);

  const handleReload = useCallback(() => {
    router.refresh();
  }, [router]);

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      user: value.user,
      school: currentSchool,
      setSchool: handleSetSchool,
      reload: handleReload,
    }),
    [value.user, currentSchool, handleSetSchool, handleReload]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
