"use client";

import { Avatar } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background px-8 py-1.5 ">
      <nav className="flex justify-between items-center gap-3 max-w-[1800px] mx-auto ">
        <Image
          alt="Educaut logo"
          width={50}
          height={50}
          src={"/app-logo.png"}
        />
        <div className="flex items-center gap-3">
          <Avatar fallback="VP" />
        </div>
      </nav>
    </header>
  );
}
