"use client";

import { createContext, useMemo, type ReactNode, useContext } from "react";
import type { IActivityTag } from "@/app/(app)/_activity_tags/_models";
import { getTagIcon } from "@/lib/activity_tags.utils";

interface ActivityTagsContextValue {
  tags: (IActivityTag & {
    Icon: React.ComponentType<{ className?: string }>;
  })[];
  getLabelByTag: (tag: string) => string | undefined;
  getIconByTag: (tag: string) => React.ComponentType<{ className?: string }>;
}

export const ActivityTagsContext = createContext<
  ActivityTagsContextValue | undefined
>(undefined);

interface ActivityTagsProviderProps {
  children: ReactNode;
  value: IActivityTag[];
}

function ActivityTagsProvider({ children, value }: ActivityTagsProviderProps) {
  const contextValue = useMemo<ActivityTagsContextValue>(() => {
    const tagToLabel = new Map(value.map((t) => [t.tag, t.label]));
    return {
      tags: value.map((t) => ({ ...t, Icon: getTagIcon(t.tag) })),
      getLabelByTag: (tag: string) => tagToLabel.get(tag),
      getIconByTag: (tag: string) => getTagIcon(tag),
    };
  }, [value]);

  return (
    <ActivityTagsContext.Provider value={contextValue}>
      {children}
    </ActivityTagsContext.Provider>
  );
}

export function useActivityTagsContext(): ActivityTagsContextValue {
  const ctx = useContext(ActivityTagsContext);
  if (!ctx) {
    throw new Error(
      "useActivityTagsContext must be used within ActivityTagsProvider"
    );
  }
  return ctx;
}

export { ActivityTagsProvider };
