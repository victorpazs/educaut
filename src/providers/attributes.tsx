"use client";

import { createContext, useMemo, type ReactNode } from "react";

import type {
  Attribute,
  AttributesByType,
} from "@/app/(app)/_attributes/_models";

interface AttributesContextValue {
  attributesByType: AttributesByType;
  getByType: (typeId: number) => Attribute[];
}

export const AttributesContext = createContext<
  AttributesContextValue | undefined
>(undefined);

interface AttributesProviderProps {
  children: ReactNode;
  value: AttributesByType;
}

function AttributesProvider({ children, value }: AttributesProviderProps) {
  const contextValue = useMemo<AttributesContextValue>(
    () => ({
      attributesByType: value,
      getByType: (typeId: number) => value[typeId] ?? [],
    }),
    [value]
  );

  return (
    <AttributesContext.Provider value={contextValue}>
      {children}
    </AttributesContext.Provider>
  );
}

export { AttributesProvider };
