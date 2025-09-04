"use client";

import { Home, User, Calendar, FileCheck, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationTabs } from "@/lib/nav";
import { NavItem } from "./nav-item";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <ul className="flex items-center justify-around py-1">
        {navigationTabs.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            path={item.href}
            icon={item.icon}
          />
        ))}
      </ul>
    </nav>
  );
}
