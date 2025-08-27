"use client";

import {
  Home,
  User,
  Briefcase,
  FileCheck,
  MessageSquare,
  Compass,
  Calendar,
  UserPlus,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";

export function Sidebar() {
  const navigation = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/students", label: "Alunos", icon: User },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/activities", label: "Atividades", icon: FileCheck },
    { href: "/discover", label: "Descubra", icon: Compass },
  ];

  return (
    <nav className="sticky top-0 left-0 bg-white z-10 h-screen flex flex-col">
      <div className="flex flex-col h-full">
        <div className="flex-1 pt-12 px-4">
          <ul className="space-y-4">
            {navigation.map((item) => {
              return (
                <SidebarItem
                  key={item.href}
                  label={item.label}
                  path={item.href}
                  icon={item.icon}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
