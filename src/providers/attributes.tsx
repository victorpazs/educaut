"use client";

import { createContext, useMemo, type ReactNode } from "react";

import type {
  AttributesByType,
  AttributesData,
  AttributeOption,
} from "@/app/(app)/_attributes/_models";

interface AttributesContextValue {
  attributesByType: AttributesByType;
  attributeTypes: string[];
  getByType: (typeName: string) => AttributeOption[];
}

export const AttributesContext = createContext<
  AttributesContextValue | undefined
>(undefined);

interface AttributesProviderProps {
  children: ReactNode;
  value: AttributesData;
}

function AttributesProvider({ children, value }: AttributesProviderProps) {
  const contextValue = useMemo<AttributesContextValue>(
    () => ({
      attributesByType: value.attributesByType,
      attributeTypes: value.attributeTypes,
      getByType: (typeName: string) => value.attributesByType[typeName] ?? [],
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
