"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/ui/search-input";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Atividades"
            subtitle="Cadastre e administre as atividades dos seus alunos."
            actions={
              <div className="flex items-center gap-3">
                <SearchInput value={search} onSearch={handleSearch} />
                <Link href="/students/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova atividade
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
        <div className="col-span-12"></div>
      </div>
    </div>
  );
}
