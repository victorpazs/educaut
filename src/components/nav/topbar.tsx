"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import SearchButton from "@/components/nav/search/search-button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSearch } from "@/hooks/useSearch";
import { AppLogo } from "../app-logo";

export function Topbar() {
  const pathname = usePathname();

  const { toggle } = useSearch();

  const onSearchClick = () => {
    toggle();
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 z-50">
      <div className="flex items-center justify-between h-full px-2 md:px-9">
        <AppLogo />

        <SearchButton onClick={onSearchClick} />

        {/* Right side - User data */}
        <div className="flex items-center gap-8">
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
