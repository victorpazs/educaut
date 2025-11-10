import { z } from "zod";

export const SchoolFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .min(4, "Nome deve ter ao menos 4 caracteres."),
});

export type SchoolFormData = z.infer<typeof SchoolFormSchema>;
