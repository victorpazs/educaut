"use client";

import type { School, User } from "@/types/db";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SessionContextValue {
  user: (User & { schools?: School[] }) | null;
  school: School | null;
  setSchool: (school: School | null) => void;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function SessionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Omit<SessionContextValue, "setSchool">;
}) {
  const [currentSchool, setCurrentSchool] = useState<School | null>(
    value.school
  );

  useEffect(() => {
    setCurrentSchool(value.school);
  }, [value.school]);

  const handleSetSchool = useCallback((nextSchool: School | null) => {
    setCurrentSchool(nextSchool);
  }, []);

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      user: value.user,
      school: currentSchool,
      setSchool: handleSetSchool,
    }),
    [value.user, currentSchool, handleSetSchool]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
