import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { SearchProvider } from "@/providers/search";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <AppShell>{children}</AppShell>;
    </SearchProvider>
  );
}
