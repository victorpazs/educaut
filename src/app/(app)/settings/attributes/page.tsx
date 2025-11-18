"use client";

import { EmptyList } from "@/components/empty-list";
import { Tags } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { useSchoolAttributes } from "./_hooks/use-school-attributes";
import * as React from "react";
import { ContentCard } from "@/components/content-card";
import { CreateAttributeDialog } from "./_components/CreateAttributeDialog";
import { useAttributes } from "@/hooks/useAttributes";
import { getAttributeLabel } from "@/lib/attributes.utils";
import { Separator } from "@/components/ui/separator";

import { Table, TableBody } from "@/components/ui/table";
import { AttributeRow } from "./_components/AttributeRow";

export default function AttributesSettingsPage() {
  const { attributeTypes } = useAttributes();

  const { data, isLoading, hasError, hasSchool, reFetch } =
    useSchoolAttributes();

  return (
    <ContentCard
      title="Características de alunos"
      actions={
        <CreateAttributeDialog
          attributeTypes={attributeTypes ?? []}
          onSuccess={reFetch}
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
              <div key={type} className="space-y-4 pb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {getAttributeLabel(type)}
                </span>
                <Separator />
                {items.length === 0 ? (
                  <span className="text-xs text-secondary">
                    Nenhum atributo criado para {getAttributeLabel(type)}.
                  </span>
                ) : (
                  <Table>
                    <TableBody>
                      {items.map((option) => (
                        <AttributeRow
                          key={option.id}
                          option={option}
                          onChanged={reFetch}
                        />
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
