import * as React from "react";
import { Topbar } from "@/components/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Topbar />
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
