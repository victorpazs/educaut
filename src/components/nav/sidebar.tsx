"use client";

import { Home, User, FileCheck, Compass, Calendar } from "lucide-react";
import { NavItem } from "./nav-item";

export function Sidebar() {
  const navigation = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/students", label: "Alunos", icon: User },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/activities", label: "Atividades", icon: FileCheck },
    { href: "/discover", label: "Descubra", icon: Compass },
  ];

  return (
    <nav className="sticky top-0 left-0 bg-white z-10 h-screen flex-col hidden md:flex">
      <div className="flex flex-col h-full">
        <div className="flex-1 pt-8 px-4">
          <ul className="space-y-4">
            {navigation.map((item) => {
              return (
                <NavItem
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
