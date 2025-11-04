import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { getAttributesByType } from "@/app/(app)/_attributes/actions";
import type { AttributesByType } from "@/app/(app)/_attributes/_models";
import { AttributesProvider } from "@/providers/attributes";
import { SearchProvider } from "@/providers/search";

import { getAuthContext } from "@/lib/session";
import { SessionProvider } from "@/providers/session-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, school } = await getAuthContext();
  const attributesResponse = await getAttributesByType();
  const attributesByType: AttributesByType =
    attributesResponse.success && attributesResponse.data
      ? attributesResponse.data
      : {};

  return (
    <SessionProvider value={{ user, school }}>
      <AttributesProvider value={attributesByType}>
        <SearchProvider>
          <AppShell>{children}</AppShell>
        </SearchProvider>
      </AttributesProvider>
    </SessionProvider>
  );
}
