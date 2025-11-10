"use client";

import * as React from "react";
import { School as SchoolIcon } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { EmptyList } from "@/components/empty-list";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ISchool } from "../_models";
import { SchoolCell } from "./Cell";

interface SchoolListProps {
  schools: ISchool[];
  isLoading: boolean;
  hasError: boolean;
  onReload: () => void;
}

export function SchoolList({
  schools,
  isLoading,
  hasError,
  onReload,
}: SchoolListProps) {
  if (hasError) {
    return (
      <EmptyList
        title="Erro ao carregar escolas"
        description="Não foi possível carregar as escolas. Tente novamente em instantes."
        icon={SchoolIcon}
      />
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (schools.length === 0) {
    return (
      <EmptyList
        title="Nenhuma escola encontrada"
        description="Ajuste os filtros de busca ou cadastre uma nova escola."
        icon={SchoolIcon}
      />
    );
  }

  return (
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
          return (
            <SchoolCell onReload={onReload} key={school.id} school={school} />
          );
        })}
      </TableBody>
    </Table>
  );
}
