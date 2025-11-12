"use client";

import { createContext, useMemo, type ReactNode, useContext } from "react";

export type StudentOption = {
  value: number;
  label: string;
};

interface StudentsContextValue {
  options: StudentOption[];
}

export const StudentsContext = createContext<StudentsContextValue | undefined>(
  undefined
);

interface StudentsProviderProps {
  children: ReactNode;
  value: StudentOption[];
}

function StudentsProvider({ children, value }: StudentsProviderProps) {
  const contextValue = useMemo<StudentsContextValue>(
    () => ({
      options: value,
    }),
    [value]
  );

  return (
    <StudentsContext.Provider value={contextValue}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudentsContext(): StudentsContextValue {
  const ctx = useContext(StudentsContext);
  if (!ctx) {
    throw new Error("useStudentsContext must be used within StudentsProvider");
  }
  return ctx;
}

export { StudentsProvider };


