"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";

export interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      title,
      children,
      defaultExpanded = false,
      className,
      disabled = false,
      size = "md",
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    const toggleExpanded = () => {
      if (!disabled) {
        setIsExpanded(!isExpanded);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleExpanded();
      }
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <Card className="overflow-hidden">
          <CardHeader
            className={cn(
              "flex flex-row items-center justify-between cursor-pointer transition-colors hover:bg-muted/50",
              size === "sm" ? "p-2" : "p-4",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={toggleExpanded}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={isExpanded}
            aria-disabled={disabled}
          >
            <div className="flex-1">
              {typeof title === "string" ? (
                <h3
                  className={cn(
                    "font-semibold leading-none tracking-tight",
                    size === "sm" ? "text-sm" : "text-lg"
                  )}
                >
                  {title}
                </h3>
              ) : (
                title
              )}
            </div>
            <ChevronDown
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                size === "sm" ? "h-4 w-4" : "h-5 w-5",
                isExpanded && "transform rotate-180"
              )}
            />
          </CardHeader>

          {isExpanded && (
            <CardContent
              className={cn("pt-0", size === "sm" ? "pb-3 px-3" : "pb-4 px-4")}
            >
              <div className={cn("pt-4", size === "sm" ? "pt-3" : "pt-4")}>
                {children}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }
);
Accordion.displayName = "Accordion";

// Multiple Accordion Component for managing multiple accordions
export interface AccordionGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  className?: string;
}

interface AccordionContextProps {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = React.createContext<AccordionContextProps | null>(
  null
);

export function AccordionGroup({
  children,
  allowMultiple = true,
  className,
}: AccordionGroupProps) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }

      return newSet;
    });
  };

  return (
    <AccordionContext.Provider
      value={{ expandedItems, toggleItem, allowMultiple }}
    >
      <div className={cn("space-y-4", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

// Controlled Accordion Item for use within AccordionGroup
export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  disabled?: boolean;
}

export function AccordionItem({
  id,
  title,
  children,
  defaultExpanded = false,
  className,
  disabled = false,
}: AccordionItemProps) {
  const context = React.useContext(AccordionContext);

  // Initialize default expanded state
  React.useEffect(() => {
    if (defaultExpanded && context) {
      context.toggleItem(id);
    }
  }, [defaultExpanded, id, context]);

  if (!context) {
    // Fallback to standalone accordion if not within group
    return (
      <Accordion
        title={title}
        defaultExpanded={defaultExpanded}
        className={className}
        disabled={disabled}
      >
        {children}
      </Accordion>
    );
  }

  const isExpanded = context.expandedItems.has(id);

  const toggleExpanded = () => {
    if (!disabled) {
      context.toggleItem(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between p-4 cursor-pointer transition-colors hover:bg-muted/50",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-disabled={disabled}
      >
        <div className="flex-1">
          {typeof title === "string" ? (
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h3>
          ) : (
            title
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200 text-muted-foreground",
            isExpanded && "transform rotate-180"
          )}
        />
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="border-t border-border pt-4">{children}</div>
        </CardContent>
      )}
    </Card>
  );
}
