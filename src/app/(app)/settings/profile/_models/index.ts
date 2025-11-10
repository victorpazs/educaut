import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  avatar: z.string().nullable().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter no mínimo 6 caracteres"),
    confirm: z.string().min(1, "Confirmação é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "Senhas não conferem",
    path: ["confirm"],
  });

export type PasswordChangeData = z.infer<typeof passwordSchema>;
