"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";

// Menu Context
interface MenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenuContext = React.createContext<MenuContextProps | null>(null);

function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("Menu components must be used within a Menu");
  }
  return context;
}

// Menu Root Component
export interface MenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Menu({ children, open, onOpenChange }: MenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const menuOpen = isControlled ? open : internalOpen;
  const setMenuOpen = isControlled
    ? onOpenChange || (() => {})
    : setInternalOpen;

  return (
    <MenuContext.Provider value={{ open: menuOpen, setOpen: setMenuOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </MenuContext.Provider>
  );
}

// Menu Trigger Component
export interface MenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  MenuTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  const { open, setOpen } = useMenuContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onClick: (e: React.MouseEvent) => {
        (children.props as any)?.onClick?.(e);
        setOpen(!open);
      },
    });
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
});
MenuTrigger.displayName = "MenuTrigger";

// Menu Content Component
export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  (
    { className, align = "start", side = "bottom", sideOffset = 4, ...props },
    ref
  ) => {
    const { open, setOpen } = useMenuContext();
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [open, setOpen]);

    React.useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [open, setOpen]);

    // Position menu to prevent overflow
    React.useEffect(() => {
      if (open && contentRef.current) {
        const content = contentRef.current;
        const rect = content.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset any previous adjustments
        content.style.transform = "";
        content.style.left = "";
        content.style.right = "";
        content.style.top = "";
        content.style.bottom = "";

        // Check horizontal overflow
        if (rect.right > viewportWidth) {
          if (align === "start") {
            content.style.right = "0";
            content.style.left = "auto";
          } else if (align === "end") {
            content.style.right = "0";
            content.style.left = "auto";
          }
        }

        // Check vertical overflow
        if (rect.bottom > viewportHeight && side === "bottom") {
          content.style.top = "auto";
          content.style.bottom = "100%";
          content.style.marginBottom = `${sideOffset}px`;
          content.style.marginTop = "0";
        }
      }
    }, [open, align, side, sideOffset]);

    if (!open) return null;

    const alignmentClasses = {
      start: "-left-2", // More to the left
      center: "left-1/2 transform -translate-x-1/2",
      end: "right-0",
    };

    const sideClasses = {
      top: `bottom-full mb-${sideOffset}`,
      right: `left-full top-0 ml-${sideOffset}`,
      bottom: `top-full mt-${sideOffset}`,
      left: `right-full top-0 mr-${sideOffset}`,
    };

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 min-w-[8rem] max-w-[20rem] overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-md",
          "animate-in fade-in-0 zoom-in-95",
          sideClasses[side],
          alignmentClasses[align],
          className
        )}
        style={{
          maxHeight: "calc(100vh - 100px)", // Prevent vertical overflow
          overflowY: "auto",
        }}
        {...props}
      />
    );
  }
);
MenuContent.displayName = "MenuContent";

// Menu Item Component
export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  destructive?: boolean;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, inset, destructive, ...props }, ref) => {
    const { setOpen } = useMenuContext();

    return (
      <button
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
          "focus:bg-muted focus:text-muted-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "hover:bg-muted hover:text-muted-foreground",
          inset && "pl-8",
          destructive && "text-red-600 focus:text-red-600 hover:text-red-600",
          className
        )}
        onClick={(e) => {
          props.onClick?.(e);
          setOpen(false);
        }}
        {...props}
      />
    );
  }
);
MenuItem.displayName = "MenuItem";

// Menu Checkbox Item Component
export interface MenuCheckboxItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const MenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  MenuCheckboxItemProps
>(({ className, children, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={checked}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "focus:bg-muted focus:text-muted-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "hover:bg-muted hover:text-muted-foreground",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
});
MenuCheckboxItem.displayName = "MenuCheckboxItem";

// Menu Radio Group Component
interface MenuRadioGroupContextProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const MenuRadioGroupContext =
  React.createContext<MenuRadioGroupContextProps | null>(null);

export interface MenuRadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function MenuRadioGroup({
  children,
  value,
  onValueChange,
}: MenuRadioGroupProps) {
  return (
    <MenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="radiogroup">{children}</div>
    </MenuRadioGroupContext.Provider>
  );
}

// Menu Radio Item Component
export interface MenuRadioItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const MenuRadioItem = React.forwardRef<
  HTMLButtonElement,
  MenuRadioItemProps
>(({ className, children, value, ...props }, ref) => {
  const radioGroupContext = React.useContext(MenuRadioGroupContext);
  const checked = radioGroupContext?.value === value;

  return (
    <button
      ref={ref}
      role="menuitemradio"
      aria-checked={checked}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "focus:bg-muted focus:text-muted-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "hover:bg-muted hover:text-muted-foreground",
        className
      )}
      onClick={() => radioGroupContext?.onValueChange?.(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
});
MenuRadioItem.displayName = "MenuRadioItem";

// Menu Label Component
export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
MenuLabel.displayName = "MenuLabel";

// Menu Separator Component
export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

// Menu Sub Components
export interface MenuSubProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MenuSubContext = React.createContext<MenuContextProps | null>(null);

export function MenuSub({ children, open, onOpenChange }: MenuSubProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const subOpen = isControlled ? open : internalOpen;
  const setSubOpen = isControlled
    ? onOpenChange || (() => {})
    : setInternalOpen;

  return (
    <MenuSubContext.Provider value={{ open: subOpen, setOpen: setSubOpen }}>
      <div className="relative">{children}</div>
    </MenuSubContext.Provider>
  );
}

export interface MenuSubTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export const MenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  MenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  const subContext = React.useContext(MenuSubContext);

  return (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-muted data-[state=open]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "hover:bg-muted",
        inset && "pl-8",
        className
      )}
      onMouseEnter={() => subContext?.setOpen(true)}
      onMouseLeave={() => subContext?.setOpen(false)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </button>
  );
});
MenuSubTrigger.displayName = "MenuSubTrigger";

export interface MenuSubContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuSubContent = React.forwardRef<
  HTMLDivElement,
  MenuSubContentProps
>(({ className, ...props }, ref) => {
  const subContext = React.useContext(MenuSubContext);

  if (!subContext?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-full top-0 z-50 ml-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    />
  );
});
MenuSubContent.displayName = "MenuSubContent";

// Shortcut component for displaying keyboard shortcuts
export interface MenuShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const MenuShortcut = React.forwardRef<
  HTMLSpanElement,
  MenuShortcutProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});
MenuShortcut.displayName = "MenuShortcut";
