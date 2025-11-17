"use client";
import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
import { StudentFormData } from "../../create/_models";
import { AttributeOption } from "@/app/(app)/_attributes/_models";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAttributeLabel } from "@/lib/attributes.utils";
import { Chip } from "@/components/ui/chip";
import { createAttribute } from "@/app/(app)/settings/attributes/actions";
import { toast } from "@/lib/toast";

interface AttributesStepProps {
  formData: StudentFormData;
  attributeType: string;
  attributeFields: AttributeOption[];
  onAttributeChange: (attribute_id: number, value: boolean) => void;
}

export function AttributesStep({
  formData,
  attributeFields,
  onAttributeChange,
  attributeType,
}: AttributesStepProps) {
  const [isCreating, startCreate] = React.useTransition();
  const options = attributeFields.map((attribute) => ({
    value: attribute.id,
    label: attribute.label,
  }));

  const handleAdd = (option: { value: number; label: string }) => {
    const alreadySelected =
      formData.student_attributes?.includes(option.value) ?? false;
    if (!alreadySelected) {
      onAttributeChange(option.value, true);
    }
  };
  const handleRemove = (option: { value: number; label: string }) => {
    const alreadySelected =
      formData.student_attributes?.includes(option.value) ?? false;
    if (alreadySelected) {
      onAttributeChange(option.value, false);
    }
  };

  return (
    <div className="space-y-4">
      <Combobox
        options={options}
        mode="additive"
        onAdd={handleAdd}
        onRemove={handleRemove}
        selectedValues={formData.student_attributes ?? []}
        disabled={isCreating}
        placeholder={`Selecionar ${getAttributeLabel(
          attributeType
        )?.toLowerCase()}...`}
        buttonClassName="w-full font-normal! justify-between!"
        className="w-full! min-w-[320px]"
        renderEmpty={(query, onClose?: () => void) => (
          <Button
            size="sm"
            className="w-full font-normal! justify-start! "
            variant="ghost"
            disabled={isCreating || !query?.trim()}
            onClick={() => {
              const name = query?.trim();
              if (!name) return;
              startCreate(async () => {
                const result = await createAttribute({
                  name,
                  typeName: attributeType,
                });
                if (result?.success && result.data?.id) {
                  onAttributeChange(result.data.id, true);
                  onClose?.();
                  toast.success("Atributo criado com sucesso.");
                } else {
                  toast.error(result?.message || "Erro ao criar atributo.");
                }
              });
            }}
          >
            Criar &quot;{query}&quot;
          </Button>
        )}
      />
      <div className="flex flex-wrap items-start flex-col gap-2">
        {(formData.student_attributes ?? []).map((id) => {
          const attribute = attributeFields.find((a) => a.id === id);
          if (!attribute) return null;
          return (
            <Chip
              key={id}
              label={attribute.label}
              variant={"outlined"}
              size="sm"
              className="text-sm min-w-64 justify-start! text-muted-foreground"
              endIcon={
                <X
                  className="text-secondary cursor-pointer size-3 ml-auto"
                  onClick={() =>
                    handleRemove({ value: id, label: attribute.label })
                  }
                />
              }
            />
          );
        })}
      </div>
    </div>
  );
}
