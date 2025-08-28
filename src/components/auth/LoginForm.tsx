"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginValues;
        setError(path, { type: "zod", message: issue.message });
      });
      return;
    }
    router.push("/home");
  }

  return (
    <Card className="mx-auto w-full shadow-lg border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Acesse sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              className="h-11"
              {...register("email")}
            />
            {errors.email?.message ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Senha
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11"
              {...register("password")}
            />
            {errors.password?.message ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pt-6 border-t border-gray-100 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Não tem conta?
        </span>
        <Link
          href="/auth/register"
          className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Crie agora
        </Link>
      </CardFooter>
    </Card>
  );
}
