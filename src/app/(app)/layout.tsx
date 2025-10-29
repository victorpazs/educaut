import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { SearchProvider } from "@/providers/search";

import { getAuthContext } from "@/lib/session";
import { SessionProvider } from "@/providers/session-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, school } = await getAuthContext();
  console.log(user, school);
  return (
    <SessionProvider value={{ user, school }}>
      <SearchProvider>
        <AppShell>{children}</AppShell>
      </SearchProvider>
    </SessionProvider>
  );
}
