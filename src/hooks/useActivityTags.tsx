"use client";

import { useContext } from "react";
import { ActivityTagsContext } from "@/providers/activity-tags";

export function useActivityTags() {
  const ctx = useContext(ActivityTagsContext);
  if (!ctx) {
    throw new Error(
      "useActivityTags deve ser utilizado dentro de um ActivityTagsProvider"
    );
  }
  return ctx;
}
