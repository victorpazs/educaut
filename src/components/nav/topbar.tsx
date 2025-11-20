"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import SearchButton from "@/components/search/search-button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSearch } from "@/hooks/useSearch";
import { AppLogo } from "../app-logo";
import { UserMenu } from "./user-menu";

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

        <UserMenu />
      </div>
    </header>
  );
}
