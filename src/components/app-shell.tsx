import * as React from "react";
import { Topbar } from "@/components/nav/topbar";
import { Sidebar } from "./nav/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background text-foreground">
      <Topbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
