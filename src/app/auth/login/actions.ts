"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";
import { clearCookies, setAuthCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";
import { LoginValues } from "@/components/auth/LoginForm";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createAuthError,
  createValidationError
} from "@/lib/error";
import { ErrorDetail } from "@/lib/error";

export async function loginAction({ email, password }: LoginValues) {
  try {
    // Validate input
    const errors: ErrorDetail[] = [];
    
    if (!email) {
      errors.push({ field: "email", message: "Email é obrigatório." });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push({ field: "email", message: "Email inválido." });
    }
    
    if (!password) {
      errors.push({ field: "password", message: "Senha é obrigatória." });
    } else if (password.length < 6) {
      errors.push({ field: "password", message: "Senha deve ter no mínimo 6 caracteres." });
    }
    
    if (errors.length > 0) {
      return createValidationError(errors);
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return createAuthError("Credenciais inválidas.");
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return createAuthError("Credenciais inválidas.");
    }

    const tokenResponse = await signJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Check if token generation was successful
    if (!tokenResponse.success || !tokenResponse.data) {
      return tokenResponse; // Return the error response
    }

    // Extract the token from the success response
    const token = tokenResponse.data;

    await setAuthCookie(token);

    // Redirect on successful login
    redirect("/home");
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponse(
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
      "LOGIN_ERROR",
      500
    );
  }
}

export async function logoutAction() {
  try {
    await clearCookies();
    redirect("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    return createErrorResponse(
      "Falha ao sair. Por favor, tente novamente.",
      "LOGOUT_ERROR",
      500
    );
  }
}