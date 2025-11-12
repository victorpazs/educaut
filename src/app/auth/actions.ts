"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import {
  clearCookies,
  clearSchoolCookie,
  setAuthCookie,
  setSchoolCookie,
} from "@/lib/cookies";
import { redirect } from "next/navigation";
import {
  createErrorResponse,
  createAuthError,
  createValidationError,
  createSuccessResponse,
} from "@/lib/server-responses";
import { ErrorDetail } from "@/lib/server-responses";
import { LoginValues } from "./login/_models";
import { RegisterValues } from "./register/_models";

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
          where: {
            schools: {
              status: 1,
            },
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

export async function updateSelectedSchool(schoolId: number | null) {
  try {
    if (!schoolId || schoolId == null) {
      throw new Error("Escola não encontrada.");
    }

    const schoolToken = await signJwt({ id: schoolId.toString() });

    if (!schoolToken.success || !schoolToken.data) {
      return schoolToken;
    }

    await setSchoolCookie(schoolToken.data);

    return createSuccessResponse(null, "Escola atualizada com sucesso.");
  } catch (error) {
    console.error("Update selected school error:", error);
    return createErrorResponse(
      "Não foi possível atualizar a escola selecionada.",
      "UPDATE_SCHOOL_ERROR",
      500
    );
  }
}

export async function registerAction({
  name,
  email,
  password,
  confirm,
  schoolName,
}: RegisterValues) {
  try {
    const errors: ErrorDetail[] = [];
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    const normalizedSchoolName = schoolName.trim();

    if (!normalizedName || normalizedName.length < 2) {
      errors.push({ field: "name", message: "Nome é obrigatório." });
    }

    if (!normalizedEmail) {
      errors.push({ field: "email", message: "Email é obrigatório." });
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      errors.push({ field: "email", message: "Email inválido." });
    }

    if (!normalizedSchoolName || normalizedSchoolName.length < 2) {
      errors.push({
        field: "schoolName",
        message: "Nome da escola é obrigatório.",
      });
    }

    if (!password) {
      errors.push({ field: "password", message: "Senha é obrigatória." });
    } else if (password.length < 6) {
      errors.push({
        field: "password",
        message: "A senha deve ter ao menos 6 caracteres.",
      });
    }

    if (!confirm) {
      errors.push({ field: "confirm", message: "Confirmação é obrigatória." });
    } else if (password !== confirm) {
      errors.push({ field: "confirm", message: "As senhas não coincidem." });
    }

    if (errors.length > 0) {
      return createValidationError(errors);
    }

    const existingUser = await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return createValidationError([
        { field: "email", message: "Email já cadastrado." },
      ]);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { user, school } = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.users.create({
        data: {
          name: normalizedName,
          email: normalizedEmail,
          password_hash: passwordHash,
        },
      });

      const createdSchool = await tx.schools.create({
        data: {
          name: normalizedSchoolName,
          created_by: createdUser.id,
        },
      });

      return { user: createdUser, school: createdSchool };
    });

    const tokenResponse = await signJwt({ id: user.id.toString() });

    if (!tokenResponse.success || !tokenResponse.data) {
      return tokenResponse;
    }

    await setAuthCookie(tokenResponse.data);

    const schoolToken = await signJwt({ id: school.id.toString() });

    if (schoolToken.success && schoolToken.data) {
      await setSchoolCookie(schoolToken.data);
    }

    return tokenResponse;
  } catch (error) {
    return createErrorResponse(
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
      "REGISTER_ERROR",
      500
    );
  }
}

export async function logoutAction() {
  try {
    await clearCookies();
  } catch (error) {
    console.error("Logout error:", error);
    return createErrorResponse(
      "Falha ao sair. Por favor, tente novamente.",
      "LOGOUT_ERROR",
      500
    );
  }

  redirect("/auth/login");
}
