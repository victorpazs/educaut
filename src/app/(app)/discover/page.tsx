"use client";

import * as React from "react";
import { Compass } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyList } from "@/components/empty-list";
import { PageLoader } from "@/components/page-loader";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { toast } from "@/lib/toast";

import { useDiscover } from "./_hooks/use-discover";
import { DiscoverList } from "./_components/List";
import { useActivityTags } from "@/hooks/useActivityTags";
import { ActivitiesTags } from "@/components/activities_tags";

export interface IDiscoverActivityFilters {
  search: string;
  tags: string[];
}

export default function DiscoverPage() {
  const [filters, setFilters] = React.useState<IDiscoverActivityFilters>({
    search: "",
    tags: [],
  });

  const { activities, isLoading, hasError } = useDiscover(filters);
  const { tags, getIconByTag } = useActivityTags();
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleTagClick = (tag: string) => {
    setFilters((prev) => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      }
      return { ...prev, tags: [...prev.tags, tag] };
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Discover"
            subtitle="Explore atividades públicas compartilhadas pela comunidade."
            actions={
              <SearchInput
                placeholder="Buscar atividades..."
                value={filters.search}
                onSearch={handleSearch}
              />
            }
          />
        </div>
        <div className="col-span-12">
          <div className="w-full mb-2  ">
            <ActivitiesTags
              selectedTags={filters.tags}
              onToggleTag={handleTagClick}
            />
          </div>
          {!hasError ? (
            isLoading ? (
              <PageLoader />
            ) : activities.length === 0 ? (
              <EmptyList
                title="Nada por aqui ainda"
                description="Nenhuma atividade pública encontrada."
                icon={Compass}
              />
            ) : (
              <Card className="rounded-sm p-4">
                <DiscoverList activities={activities} />
              </Card>
            )
          ) : (
            <EmptyList
              title="Erro ao carregar"
              description="Não foi possível carregar as atividades públicas."
              icon={Compass}
            />
          )}
        </div>
      </div>
    </div>
  );
}
