"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { withValidation } from "@/lib/validation";
import {
  SchoolFormSchema,
  type SchoolFormData,
} from "../app/(app)/settings/schools/_models";

export type SchoolFormValues = SchoolFormData;

interface SchoolFormProps {
  defaultName?: string;
  submitting?: boolean;
  onSubmit: (values: SchoolFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export function SchoolForm({
  defaultName = "",
  submitting = false,
  onSubmit,
  onCancel,
}: SchoolFormProps) {
  const { register, handleSubmit, reset } = useForm<SchoolFormValues>({
    defaultValues: { name: defaultName },
  });

  React.useEffect(() => {
    reset({ name: defaultName });
  }, [defaultName, reset]);

  const onSubmitInternal = handleSubmit(async (values) => {
    await withValidation(SchoolFormSchema, onSubmit)(values);
    reset({ name: "" });
  });

  return (
    <form onSubmit={onSubmitInternal}>
      <div className="px-6">
        <Label>Nome da escola</Label>
        <Input
          {...register("name", {
            required: "Nome é obrigatório.",
            minLength: {
              value: 4,
              message: "Nome deve ter ao menos 4 caracteres.",
            },
          })}
          placeholder="Ex.: Escola Municipal ABC"
          required
          autoFocus={true}
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
