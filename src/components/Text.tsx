import * as React from "react";
import { cn } from "@/lib/utils";

export type TextProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  variant?: "title" | "subtitle" | "body" | "muted" | "small";
} & Omit<React.HTMLAttributes<HTMLElement>, "className">;

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : ""
  );
}

const variantClasses: Record<NonNullable<TextProps["variant"]>, string> = {
  title: "text-2xl font-semibold text-foreground",
  subtitle: "text-base text-foreground/80",
  body: "text-sm text-foreground",
  muted: "text-sm text-muted-foreground",
  small: "text-xs text-foreground/70",
};

const TextBase: React.FC<TextProps> = ({
  children,
  className,
  as = "span",
  variant = "body",
  ...rest
}) => {
  const Comp: any = as;
  return (
    <Comp className={cn(variantClasses[variant], className)} {...rest}>
      {children}
    </Comp>
  );
};

function getString(namespace?: string) {
  return (text: string, vars?: Record<string, string | number>) =>
    interpolate(text, vars);
}

export interface TextComponent extends React.FC<TextProps> {
  getString: (
    namespace?: string
  ) => (text: string, vars?: Record<string, string | number>) => string;
}

const Text = TextBase as TextComponent;
Text.getString = getString;

export default Text;
