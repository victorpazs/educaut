import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { getAttributesByType } from "@/app/(app)/_attributes/actions";
import type { AttributesData } from "@/app/(app)/_attributes/_models";
import { AttributesProvider } from "@/providers/attributes";
import { SearchProvider } from "@/providers/search";

import { getAuthContext } from "@/lib/session";
import { SessionProvider } from "@/providers/session-provider";
import { ModalsProvider } from "@/providers/modals";
import { StudentsProvider } from "@/providers/students";
import { getSchoolStudentsOptions } from "@/app/(app)/_school_students/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, school } = await getAuthContext();
  const attributesResponse = await getAttributesByType();
  const attributesData: AttributesData =
    attributesResponse.success && attributesResponse.data
      ? attributesResponse.data
      : { attributesByType: {}, attributeTypes: [] };
  const studentsResponse = await getSchoolStudentsOptions();
  const studentsOptions =
    studentsResponse.success && studentsResponse.data
      ? studentsResponse.data
      : [];

  return (
    <SessionProvider value={{ user, school }}>
      <AttributesProvider value={attributesData}>
        <StudentsProvider value={studentsOptions}>
          <ModalsProvider>
            <SearchProvider>
              <AppShell>{children}</AppShell>
            </SearchProvider>
          </ModalsProvider>
        </StudentsProvider>
      </AttributesProvider>
    </SessionProvider>
  );
}
