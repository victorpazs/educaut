"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, GraduationCap, Users, ListChecks, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/students", label: "Alunos", icon: Users },
  { href: "/classes", label: "Turmas", icon: GraduationCap },
  { href: "/activities", label: "Atividades", icon: ListChecks },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="h-7 w-7 rounded-md bg-primary" />
        <span className="text-base font-semibold">EducAut</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
