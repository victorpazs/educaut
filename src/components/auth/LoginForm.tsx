"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/ui/email-input";
import { PasswordInput } from "@/components/ui/password-input";
import { withValidation } from "@/lib/validation";
import { loginAction } from "@/app/auth/login/actions";
import { toast } from "@/lib/toast";
import { homeRoute } from "@/lib/contraints";

const LoginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },

    clearErrors,
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = withValidation(LoginSchema, async (values: LoginValues) => {
    try {
      clearErrors();

      const loginResult = await loginAction(values);

      if (!loginResult.success) {
        toast.error(
          "Erro",
          loginResult.message || "Não foi possível fazer login."
        );
      } else if (loginResult.success) {
        router.push(homeRoute);
        router.refresh();
      }
    } catch (error) {
      toast.error(
        "Erro",
        "Ocorreu um erro inesperado. Por favor, tente novamente."
      );
    }
  });

  return (
    <div className="w-full space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <EmailInput error={errors.email?.message} {...register("email")} />

        <PasswordInput
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-sm text-secondary">
          Ainda não criou a sua conta?{" "}
        </span>
        <Link
          href="/auth/register"
          className="text-sm font-bold text-primary hover:underline"
        >
          Registre-se
        </Link>
      </div>
    </div>
  );
}
