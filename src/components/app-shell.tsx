import * as React from "react";
import { Topbar } from "@/components/topbar";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Sidebar />
      <Topbar />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
