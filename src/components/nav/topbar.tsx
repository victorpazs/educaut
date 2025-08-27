"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 h-16 z-50">
      <div className="flex items-center justify-between h-full px-8">
        {/* Left side - Logo */}
        <Image src="/app-logo.png" width={52} height={52} alt="App Logo" />

        {/* Right side - User data */}
        <div className="flex items-center gap-8">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </button>

          {/* User Avatar and Dropdown */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8" fallback="VP" />
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
