"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

export function AppLogo({ className }: { className?: string }) {
  return (
    <Image
      onClick={() => redirect("/home")}
      onDragStart={(e) => e.preventDefault()}
      className={`md:h-12 md:w-12 cursor-pointer ${className}`}
      src="/app-logo.png"
      width={52}
      height={52}
      alt="App Logo"
    />
  );
}
