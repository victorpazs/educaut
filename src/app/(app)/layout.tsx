import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { getAuthContext } from "@/lib/session";
import { SessionProvider } from "@/providers/session-provider";
import { AppProviders } from "@/providers/app-providers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, school } = await getAuthContext();

  return (
    <SessionProvider value={{ user, school }}>
      <AppProviders>
        <AppShell>{children}</AppShell>
      </AppProviders>
    </SessionProvider>
  );
}
