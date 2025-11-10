"use client";

import * as React from "react";

import { ContentCard } from "../../../../components/content-card";
import { SearchInput } from "@/components/ui/search-input";
import { useSchools } from "./_hooks/use-schools";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SchoolList } from "./_components/List";
import { Plus } from "lucide-react";

export default function SettingsSchoolsPage() {
  const [search, setSearch] = React.useState("");

  const { schools, isLoading, hasError, reload } = useSchools(search);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <ContentCard
      actions={
        <div className="flex items-center justify-end gap-3">
          <SearchInput
            size="sm"
            placeholder="Buscar escolas..."
            value={search}
            onSearch={handleSearch}
          />
          <Link href="/create-school">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova escola
            </Button>
          </Link>
        </div>
      }
      title="Escolas"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <SchoolList
            schools={schools}
            isLoading={isLoading}
            hasError={hasError}
            onReload={reload}
          />
        </div>
      </div>
    </ContentCard>
  );
}
