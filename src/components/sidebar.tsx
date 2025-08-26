"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/students", label: "Alunos" },
    { href: "/classes", label: "Turmas" },
    { href: "/activities", label: "Atividades" },
  ];

  return (
    <nav className="sticky h-full top-0 left-0 pt-24">
      {nav.map((i) => (
        <a>{i.label}</a>
      ))}
    </nav>
  );
}
