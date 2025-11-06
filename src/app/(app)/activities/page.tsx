"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/ui/search-input";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { useActivities } from "./_hooks/use-activities";

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");
  const { activities, isLoading, hasError } = useActivities(search);

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
                <SearchInput
                  placeholder="Buscar atividades..."
                  value={search}
                  onSearch={handleSearch}
                />
                <Link href="/activities/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova atividade
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
        <div className="col-span-12">
          {hasError ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Erro ao carregar atividades</EmptyTitle>
                <EmptyDescription>
                  Não foi possível carregar as atividades. Tente novamente em
                  instantes.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : isLoading ? (
            <PageLoader />
          ) : !activities || activities.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma atividade encontrada</EmptyTitle>
                <EmptyDescription>
                  Ajuste os filtros de busca ou crie uma nova atividade.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}
        </div>
      </div>
    </div>
  );
}
