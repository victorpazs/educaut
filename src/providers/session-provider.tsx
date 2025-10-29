"use client";

import type { School, User } from "@/types/db";
import { createContext, useContext, ReactNode } from "react";

interface SessionContextValue {
  user: (User & { schools?: School[] }) | null;
  school: School | null;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function SessionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SessionContextValue;
}) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// Create a custom hook to easily access the context
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
