"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, FileText } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { EmptyList } from "@/components/empty-list";
import { useActivities } from "./_hooks/use-activities";
import { useRouter } from "next/navigation";
import { NewActivityDialog } from "./_components/NewActivityDialog";
import { ActivitiesTags } from "@/components/activities_tags";
import { GetActivitiesParams } from "./actions";
import { ActivityCell } from "./_components/ActivityCell";

export default function ActivitiesPage() {
  const [filter, setFilter] = useState<GetActivitiesParams>({
    search: "",
    tags: [],
  });
  const { activities, isLoading, hasError } = useActivities(filter);
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSearch = (value: string) => {
    setFilter((prev) => ({ ...prev, search: value }));
  };

  const handleTagClick = (tag: string) => {
    setFilter((prev) => {
      if (prev.tags?.includes(tag)) {
        return { ...prev, tags: (prev.tags ?? []).filter((t) => t !== tag) };
      }
      return { ...prev, tags: [...(prev.tags ?? []), tag] };
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <PageHeader
            title="Atividades"
            subtitle="Cadastre e administre as atividades dos seus alunos."
            actions={
              <div className="flex items-center justify-end flex-wrap gap-3">
                <SearchInput
                  placeholder="Buscar atividades..."
                  value={filter.search}
                  onSearch={handleSearch}
                />
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova atividade
                </Button>
                <NewActivityDialog
                  open={isCreateOpen}
                  onOpenChange={setIsCreateOpen}
                  onCreated={(id) => router.push(`/activities/editor/${id}`)}
                />
              </div>
            }
          />
        </div>
        <div className="col-span-12">
          <ActivitiesTags
            selectedTags={filter.tags || []}
            onToggleTag={handleTagClick}
          />
        </div>
        <div className="col-span-12 mt-2">
          {hasError ? (
            <EmptyList
              title="Erro ao carregar atividades"
              description="Não foi possível carregar as atividades. Tente novamente em instantes."
              icon={FileText}
            />
          ) : isLoading ? (
            <PageLoader />
          ) : !activities || activities.length === 0 ? (
            <EmptyList
              title="Nenhuma atividade encontrada"
              description="Ajuste os filtros de busca ou crie uma nova atividade."
              icon={FileText}
            />
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="col-span-12 h-full md:col-span-6 lg:col-span-4"
                >
                  <ActivityCell
                    activity={activity}
                    onClick={() =>
                      router.push(`/activities/editor/${activity.id}`)
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
