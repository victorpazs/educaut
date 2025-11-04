"use client";

import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabOption = {
  label: string;
  href?: string;
  onClick?: (identifier: string) => void;
  icon: LucideIcon;
  identifier?: string;
};

export function TabsSidebar({ options }: { options: TabOption[] }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="sticky top-20 flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-xs">
      {options.map(({ href, label, icon: Icon, identifier, onClick }) => {
        const isActive = href ? pathname?.startsWith(href) : false;

        return (
          <Button
            key={href}
            type="button"
            onClick={() => {
              if (href) {
                return router.push(href);
              }
              if (onClick && identifier) {
                return onClick(identifier);
              }
            }}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-4 py-2 text-black",
              isActive
                ? "bg-primary/25 text-primary"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <Icon className="h-4 w-4 text-black" />

            <span className="text-black">{label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
