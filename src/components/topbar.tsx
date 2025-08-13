"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <div className="relative hidden w-full max-w-md items-center md:flex">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar..." />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Avatar fallback="VP" />
      </div>
    </header>
  );
}
