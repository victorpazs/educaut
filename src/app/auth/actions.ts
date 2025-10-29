"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { clearCookies, setAuthCookie, setSchoolCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";
import { LoginValues } from "@/components/auth/LoginForm";
import {
  createErrorResponse,
  createAuthError,
  createValidationError,
} from "@/lib/server-responses";
import { ErrorDetail } from "@/lib/server-responses";

export async function loginAction({ email, password }: LoginValues) {
  try {
    const errors: ErrorDetail[] = [];

    if (!email) {
      errors.push({ field: "email", message: "Email é obrigatório." });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push({ field: "email", message: "Email inválido." });
    }

    if (!password) {
      errors.push({ field: "password", message: "Senha é obrigatória." });
    }

    if (errors.length > 0) {
      return createValidationError(errors);
    }

    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        school_users: {
          include: {
            schools: true,
          },
        },
      },
    });
    if (!user) {
      return createAuthError("Credenciais inválidas.");
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return createAuthError("Credenciais inválidas.");
    }

    const tokenResponse = await signJwt({
      id: user.id.toString(),
    });

    if (!tokenResponse.success || !tokenResponse.data) {
      return tokenResponse;
    }

    await setAuthCookie(tokenResponse.data);

    const userSchools = user.school_users.map(
      (school_user) => school_user.schools
    );

    if (userSchools && userSchools.length > 0) {
      const schoolToken = await signJwt({
        id: userSchools[0].id?.toString(),
      });

      if (schoolToken.success && schoolToken.data) {
        await setSchoolCookie(schoolToken.data);
      }
    }

    return tokenResponse;
  } catch (error) {
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
