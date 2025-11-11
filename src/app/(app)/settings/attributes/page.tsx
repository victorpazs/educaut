"use client";

import { EmptyList } from "@/components/empty-list";
import { Tags } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { useSchoolAttributes } from "./_hooks/use-school-attributes";
import * as React from "react";
import { useRouter } from "next/navigation";
import type {
  AttributesByType,
  AttributesData,
} from "@/app/(app)/_attributes/_models";
import { ContentCard } from "@/components/content-card";
import { CreateAttributeDialog } from "./_components/CreateAttributeDialog";
import { useAttributes } from "@/hooks/useAttributes";
import { getAttributeLabel } from "@/lib/attributes.utils";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttributeCell } from "./_components/AttributeCell";

export default function AttributesSettingsPage() {
  const router = useRouter();
  const { attributeTypes } = useAttributes();

  const { data, isLoading, hasError, hasSchool } = useSchoolAttributes();

  return (
    <ContentCard
      title="Atributos"
      actions={
        <CreateAttributeDialog
          attributeTypes={attributeTypes ?? []}
          onSuccess={() => router.refresh()}
        />
      }
    >
      {!hasSchool ? (
        <EmptyList
          title="Selecione uma escola"
          description="É necessário escolher uma escola para visualizar os atributos."
          icon={Tags}
        />
      ) : isLoading ? (
        <PageLoader />
      ) : hasError || !data ? (
        <EmptyList
          title="Erro ao carregar atributos"
          description="Não foi possível carregar os atributos. Tente novamente em instantes."
          icon={Tags}
        />
      ) : (
        <div className="space-y-4">
          {attributeTypes.map((type, index) => {
            const items = data.attributesByType[type] ?? [];
            return (
              <div key={type} className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {getAttributeLabel(type)}
                </span>
                <Separator />
                {items.length === 0 ? (
                  <EmptyList
                    title="Nenhum atributo"
                    description="Crie um novo atributo para este tipo."
                    icon={Tags}
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((option) => (
                        <AttributeCell key={option.id} option={option} />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ContentCard>
  );
}
