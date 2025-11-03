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
import { homeRoute } from "@/lib/contraints";
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
            response.message || "Não foi possível criar a conta."
          );
          return;
        }

        router.push(homeRoute);
        router.refresh();
      } catch (error) {
        toast.error(
          "Erro",
          "Ocorreu um erro inesperado. Por favor, tente novamente."
        );
      }
    }
  );

  return (
    <div className="w-full space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <div className="space-y-2">
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
            className="h-12 bg-background border-border focus:border-primary focus:ring-primary"
            {...register("schoolName")}
          />
          {errors.schoolName?.message ? (
            <p className="text-xs text-red-600">{errors.schoolName.message}</p>
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
          autoComplete="new-password"
          {...register("password")}
        />

        <PasswordInput
          label="Confirmar senha"
          error={errors.confirm?.message}
          autoComplete="new-password"
          {...register("confirm")}
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
