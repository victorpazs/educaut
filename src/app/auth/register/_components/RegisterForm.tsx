"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Facebook, Twitter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/email-input";
import { PasswordInput } from "@/components/ui/password-input";
import { IconInput } from "../../../../components/ui/icon-input";

const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirm: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  async function onSubmit(values: RegisterValues) {
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof RegisterValues;
        setError(path, { type: "zod", message: issue.message });
      });
      return;
    }
    router.push("/home");
  }

  return (
    <div className="w-full space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            Nome
          </label>
          <IconInput
            startIcon={User}
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            className="h-12 bg-background border-border focus:border-primary focus:ring-primary"
            {...register("name")}
          />
          {errors.name?.message ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        {/* Email Field */}
        <EmailInput
          placeholder="seu.email@exemplo.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Field */}
        <PasswordInput
          label="Senha"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Register Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      {/* Already have account */}
      <div className="text-center">
        <span className="text-sm text-secondary">Já tem uma conta? </span>
        <Link
          href="/auth/login"
          className="text-sm font-bold text-primary hover:underline"
        >
          Faça login
        </Link>
      </div>
    </div>
  );
}
