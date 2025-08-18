"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Topbar() {
  const pathname = usePathname();

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/students", label: "Alunos" },
    { href: "/classes", label: "Turmas" },
    { href: "/activities", label: "Atividades" },
  ];

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <nav className="hidden items-center gap-1 md:flex">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="relative ml-auto hidden w-full max-w-md items-center md:flex">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar..." />
      </div>
      <div className="ml-3 flex items-center gap-3">
        <Avatar fallback="VP" />
      </div>
    </header>
  );
}
