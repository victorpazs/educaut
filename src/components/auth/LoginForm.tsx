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
import { ApiResponse } from "@/lib/error";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = withValidation(loginSchema, async (values: LoginValues) => {
    try {
      clearErrors();

      const result: ApiResponse<any> = await loginAction(values);

      if (!result.success) {
        // Handle error response - show only the main message in toast
        toast.error("Login falhou", result.message);

        // Set field-specific errors if available
        if (result.error?.details) {
          result.error.details.forEach((detail: any) => {
            if (detail.field) {
              setError(detail.field as keyof LoginValues, {
                message: detail.message,
              });
            }
          });
        }

        return;
      }

      // Handle success - redirect happens in server action
      toast.success("Sucesso", result.message);
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
        {/* Email Field */}
        <EmailInput
          placeholder="john.doe@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Field */}
        <PasswordInput
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Sign Up Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      {/* Already have account */}
      <div className="text-center">
        <span className="text-sm text-secondary">
          Already have an account?{" "}
        </span>
        <Link
          href="/auth/register"
          className="text-sm font-bold text-primary hover:underline"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}