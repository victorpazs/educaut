"use client";

import { usePathname, useRouter } from "next/navigation";
import { School, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settingsRoutes = [
  {
    label: "Meu perfil",
    href: "/settings/profile",
    icon: User,
  },
  {
    label: "Escolas",
    href: "/settings/schools",
    icon: School,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="sticky top-20 flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-xs">
      {settingsRoutes.map(({ href, label, icon: Icon }) => {
        const isActive = pathname?.startsWith(href);

        return (
          <Button
            key={href}
            type="button"
            onClick={() => router.push(href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-full px-5 py-3",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/15 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-semibold">{label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
