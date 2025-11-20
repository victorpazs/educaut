import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { AppProviders } from "@/providers/app-providers";
import { AuthProvider } from "@/providers/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppProviders>
        <AppShell>{children}</AppShell>
      </AppProviders>
    </AuthProvider>
  );
}
