"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Facebook, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/ui/email-input";
import { PasswordInput } from "@/components/ui/password-input";

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
