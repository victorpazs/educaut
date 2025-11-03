import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirm: z.string().min(6, "Confirme sua senha"),
    schoolName: z.string().min(2, "Informe o nome da escola"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

export type RegisterValues = z.infer<typeof RegisterSchema>;
