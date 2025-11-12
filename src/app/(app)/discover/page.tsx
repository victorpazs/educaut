"use client";

import * as React from "react";
import { Compass } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyList } from "@/components/empty-list";
import { PageLoader } from "@/components/page-loader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDiscover } from "./_hooks/use-discover";
import { DiscoverList } from "./_components/List";

export default function DiscoverPage() {
  const [search, setSearch] = React.useState("");
  const { activities, isLoading, hasError } = useDiscover(search);

  const handleSearch = (value: string) => {
    setSearch(value);
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
                value={search}
                onSearch={handleSearch}
              />
            }
          />
        </div>
        <div className="col-span-12">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Tudo</TabsTrigger>
              <TabsTrigger value="activities">Atividades</TabsTrigger>
              <TabsTrigger value="lists" disabled>
                Listas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
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
            </TabsContent>
            <TabsContent value="activities">
              {/* Reutiliza o mesmo conteúdo por enquanto */}
              {!hasError ? (
                isLoading ? (
                  <PageLoader />
                ) : activities.length === 0 ? (
                  <EmptyList
                    title="Nenhuma atividade"
                    description="Tente ajustar a busca para encontrar atividades."
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
