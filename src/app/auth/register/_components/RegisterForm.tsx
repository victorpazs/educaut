"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { User, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/ui/email-input";
import { PasswordInput } from "@/components/ui/password-input";
import { IconInput } from "../../../../components/ui/icon-input";
import { withValidation } from "@/lib/validation";
import { toast } from "@/lib/toast";
import { verifyEmailRoute } from "@/lib/contraints";
import { registerAction } from "@/app/auth/actions";
import { RegisterSchema, RegisterValues } from "../_models";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<RegisterValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      schoolName: "",
    },
  });

  const onSubmit = withValidation(
    RegisterSchema,
    async (values: RegisterValues) => {
      try {
        clearErrors();

        const response = await registerAction(values);

        if (!response.success) {
          toast.error(
            "Erro",
            response.message || "Não foi possível criar a conta.",
          );
          return;
        }

        const email =
          response.data &&
          typeof response.data === "object" &&
          "email" in response.data
            ? (response.data as { email: string }).email
            : values.email;

        toast.success("Código enviado!", "Verifique seu e-mail.");
        router.push(
          `${verifyEmailRoute}?email=${encodeURIComponent(email)}&type=registration_otp`,
        );
      } catch (error) {
        toast.error(
          "Erro",
          "Ocorreu um erro inesperado. Por favor, tente novamente.",
        );
      }
    },
  );

  return (
    <div className="w-full space-y-4">
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1">
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
            {...register("name")}
          />
          {errors.name?.message ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="schoolName"
            className="block text-sm font-medium text-foreground"
          >
            Nome da escola
          </label>
          <IconInput
            startIcon={School}
            id="schoolName"
            type="text"
            autoComplete="organization"
            placeholder="Nome da escola"
            {...register("schoolName")}
          />
          {errors.schoolName?.message ? (
            <p className="text-xs text-red-600">{errors.schoolName.message}</p>
          ) : null}
        </div>

        <EmailInput
          placeholder="seu.email@exemplo.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Senha"
          error={errors.password?.message}
          autoComplete="new-password"
          {...register("password")}
        />

        <PasswordInput
          label="Confirmar senha"
          error={errors.confirm?.message}
          autoComplete="new-password"
          {...register("confirm")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6! bg-primary hover:opacity-80 text-lg text-primary-foreground mt-4 font-medium"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

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
