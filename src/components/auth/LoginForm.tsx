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

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const validatedOnSubmit = withValidation(
    loginSchema,
    async (values: LoginValues) => {
      try {
        setServerError(null);
        const result = await loginAction(values);
        
        if (result?.error) {
          // Display error using toast
          toast.error("Login failed", result.error);
          // Optionally set server error to display in form
          setServerError(result.error);
        }
      } catch (error) {
        toast.error("Error", "An unexpected error occurred. Please try again.");
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  );

  async function onSubmit(values: LoginValues) {
    await validatedOnSubmit(values);
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

        {/* Server Error Display */}
        {serverError && (
          <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
            {serverError}
          </div>
        )}

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