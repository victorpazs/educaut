"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

export function AppLogo({ className }: { className?: string }) {
  return (
    <Image
      onClick={() => redirect("/home")}
      onDragStart={(e) => e.preventDefault()}
      className={cn("md:h-12 md:w-12 cursor-pointer", className)}
      src="/app-logo.png"
      width={52}
      height={52}
      unoptimized
      alt="App Logo"
    />
  );
}
