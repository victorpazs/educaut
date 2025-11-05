"use client";

import { useContext } from "react";

import { AttributesContext } from "@/providers/attributes";

export function useAttributes() {
  const context = useContext(AttributesContext);

  if (!context) {
    throw new Error(
      "useAttributes deve ser utilizado dentro de um AttributesProvider"
    );
  }

  return context;
}
