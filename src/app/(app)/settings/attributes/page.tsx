"use client";

import { EmptyList } from "@/components/empty-list";
import { Tags } from "lucide-react";
import { PageLoader } from "@/components/page-loader";
import { useAttributes } from "./_hooks/use-attributes";
import { AttributesTabs } from "./_components/AttributesTabs";
import { Card } from "@/components/ui/card";

export default function AttributesSettingsPage() {
  const { data, isLoading, hasError, hasSchool } = useAttributes();

  return (
    <Card className="space-y-4">
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
      ) : !data.attributeTypes.length ? (
        <EmptyList
          title="Nenhum atributo cadastrado"
          description="Quando houver atributos cadastrados, eles aparecerão aqui separados por categoria."
          icon={Tags}
        />
      ) : (
        <AttributesTabs data={data} />
      )}
    </Card>
  );
}
