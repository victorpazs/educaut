"use client";

import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { StudentCreateSteps } from "@/app/(app)/students/create/_models";

type TabOption = {
  label: string;
  href?: string;
  onClick?: (identifier: string) => void;
  icon: LucideIcon;
  identifier?: string;
  disabled?: boolean;
};

export function TabsSidebar({
  options,
  currentTab,
}: {
  options: TabOption[];
  currentTab?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getOptionValue = (option: TabOption, index: number) =>
    option.identifier ?? option.href ?? `tab-${index}`;

  const resolveActiveValue = () => {
    if (!options.length) {
      return undefined;
    }

    if (currentTab) {
      const indexFromIdentifier = options.findIndex(
        (option) => option.identifier === currentTab
      );

      if (indexFromIdentifier >= 0) {
        return getOptionValue(
          options[indexFromIdentifier],
          indexFromIdentifier
        );
      }
    }

    const indexFromHref = options.findIndex(
      (option) => option.href && pathname?.startsWith(option.href)
    );

    if (indexFromHref >= 0) {
      return getOptionValue(options[indexFromHref], indexFromHref);
    }

    return getOptionValue(options[0], 0);
  };

  const handleTabChange = (value: string) => {
    const targetIndex = options.findIndex(
      (option, index) => getOptionValue(option, index) === value
    );

    if (targetIndex < 0) {
      return;
    }

    const targetOption = options[targetIndex];

    if (targetOption.disabled) {
      return;
    }

    if (targetOption.href) {
      router.push(targetOption.href);
      return;
    }

    if (targetOption.onClick && targetOption.identifier) {
      targetOption.onClick(targetOption.identifier);
    }
  };

  const activeValue = resolveActiveValue();

  return (
    <>
      {options.length > 0 && activeValue && (
        <Tabs
          className="md:hidden"
          value={activeValue}
          onValueChange={handleTabChange}
        >
          <TabsList className="w-full justify-evenly overflow-x-auto">
            {options.map(({ label, icon: Icon, disabled }, index) => {
              const value = getOptionValue(options[index], index);
              return (
                <TabsTrigger
                  key={value}
                  value={value}
                  disabled={disabled}
                  className="flex-1 gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      )}

      <nav className="sticky top-10 hidden flex-col gap-2 rounded-2xl bg-card p-3 shadow-xs md:flex">
        {options.map(
          (
            { href, label, icon: Icon, identifier, onClick, disabled },
            index
          ) => {
            const isActive = href
              ? pathname?.startsWith(href)
              : identifier === currentTab
              ? true
              : false;

            return (
              <Button
                disabled={disabled}
                key={getOptionValue(options[index], index)}
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
                  "flex w-full gap-2 text-start! justify-start! rounded-full! px-4 py-3 text-black! font-medium! bg-transparent hover:opacity-80!",
                  isActive ? "bg-muted-foreground! text-white!" : ""
                )}
              >
                {Icon && <Icon className="h-4 w-4 " />}

                <span className="">{label}</span>
              </Button>
            );
          }
        )}
      </nav>
    </>
  );
}
