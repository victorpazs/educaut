"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
import SchoolCreateDialog from "@/components/school-create-dialog";

type ModalsContextValue = {
  openSchoolCreateDialog: () => void;
  closeSchoolCreateDialog: () => void;
};

export const ModalsContext = createContext<ModalsContextValue>({
  openSchoolCreateDialog: () => {},
  closeSchoolCreateDialog: () => {},
});

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [isSchoolCreateOpen, setIsSchoolCreateOpen] = useState(false);

  const handleOpenSchoolCreateDialog = useCallback(() => {
    setIsSchoolCreateOpen(true);
  }, []);

  const handleCloseSchoolCreateDialog = useCallback(() => {
    setIsSchoolCreateOpen(false);
  }, []);

  const value = useMemo<ModalsContextValue>(
    () => ({
      openSchoolCreateDialog: handleOpenSchoolCreateDialog,
      closeSchoolCreateDialog: handleCloseSchoolCreateDialog,
    }),
    [handleOpenSchoolCreateDialog, handleCloseSchoolCreateDialog]
  );

  return (
    <ModalsContext.Provider value={value}>
      {children}
      {isSchoolCreateOpen ? (
        <SchoolCreateDialog onClose={handleCloseSchoolCreateDialog} />
      ) : null}
    </ModalsContext.Provider>
  );
}
