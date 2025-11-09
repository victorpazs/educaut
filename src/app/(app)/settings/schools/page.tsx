"use client";

import * as React from "react";
import { School as SchoolIcon } from "lucide-react";

import { ContentCard } from "../../../../components/content-card";
import { SearchInput } from "@/components/ui/search-input";
import { PageLoader } from "@/components/page-loader";

import type { ISchool } from "./_models";
import { getSchools } from "./actions";
import { SchoolCreateDialog } from "./_components/SchoolCreateDialog";
import { SchoolEditDialog } from "./_components/SchoolEditDialog";
import { toast } from "@/lib/toast";
import { EmptyList } from "@/components/empty-list";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SettingsSchoolsPage() {
  const [schools, setSchools] = React.useState<ISchool[]>([]);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCreateOpen = searchParams.get("new") === "1";

  const reload = React.useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await getSchools({ search });
      if (response.success) {
        setSchools(response.data ?? []);
        setHasError(false);
      } else {
        setSchools([]);
        setHasError(true);
        toast.error(response.message);
      }
    } catch {
      setHasError(true);
      setSchools([]);
      toast.error("Não foi possível carregar as escolas.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCreateOpenChange = (open: boolean) => {
    if (open) {
      router.replace("/settings/schools?new=1");
    } else {
      router.replace("/settings/schools");
    }
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
          <SchoolCreateDialog
            open={isCreateOpen}
            onOpenChange={handleCreateOpenChange}
            onCreated={reload}
          />
        </div>
      }
      title="Escolas"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {hasError ? (
            <EmptyList
              title="Erro ao carregar escolas"
              description="Não foi possível carregar as escolas. Tente novamente em instantes."
              icon={SchoolIcon}
            />
          ) : isLoading ? (
            <PageLoader />
          ) : schools.length === 0 ? (
            <EmptyList
              title="Nenhuma escola encontrada"
              description="Ajuste os filtros de busca ou cadastre uma nova escola."
              icon={SchoolIcon}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => {
                  const createdDate = school.created_at
                    ? new Date(school.created_at).toLocaleDateString("pt-BR")
                    : null;
                  return (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">
                        {school.name}
                      </TableCell>
                      <TableCell>{createdDate ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <SchoolEditDialog school={school} onUpdated={reload} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </ContentCard>
  );
}
