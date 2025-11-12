"use client";

import { EmptyList } from "@/components/empty-list";
import { Tags } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { useSchoolAttributes } from "./_hooks/use-school-attributes";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { CreateAttributeDialog } from "./_components/CreateAttributeDialog";
import { useAttributes } from "@/hooks/useAttributes";
import { getAttributeLabel } from "@/lib/attributes.utils";
import { Separator } from "@/components/ui/separator";

import { AttributeCell } from "./_components/AttributeCell";

export default function AttributesSettingsPage() {
  const router = useRouter();
  const { attributeTypes } = useAttributes();

  const { data, isLoading, hasError, hasSchool, reFetch } = useSchoolAttributes();

  return (
    <ContentCard
      title="Atributos"
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
                  <div className="grid grid-cols-12 gap-3">
                    {items.map((option) => (
                      <div
                        className="col-span-12 sm:col-span-6 lg:col-span-3"
                        key={option.id}
                      >
                        <AttributeCell option={option} onChanged={reFetch} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ContentCard>
  );
}
