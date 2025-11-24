"use client";

import SearchButton from "@/components/search/search-button";

import { useSearch } from "@/hooks/useSearch";
import { AppLogo } from "../app-logo";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const { toggle } = useSearch();

  const onSearchClick = () => {
    toggle();
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 z-50">
      <div className="flex items-center justify-between h-full px-2 md:px-9">
        <AppLogo className="md:w-12 md:h-12 w-10 h-10" />

        <SearchButton onClick={onSearchClick} />

        <UserMenu />
      </div>
    </header>
  );
}
