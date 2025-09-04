import * as React from "react";
import { Topbar } from "@/components/nav/topbar";
import { Sidebar } from "./nav/sidebar";
import { BottomNav } from "./nav/bottom-nav";
import { Suspense } from "react";
import { PageLoader } from "@/components/page-loader";
import { SearchModal } from "./nav/search/search-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background text-foreground">
      <Topbar />
      <SearchModal />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-4">
          <div className="mx-auto w-full max-w-7xl">
            <Suspense fallback={<PageLoader />}>{children}</Suspense>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
