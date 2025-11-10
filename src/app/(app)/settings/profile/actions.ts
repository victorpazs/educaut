"use server";

import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
  createValidationError,
  handleServerError,
  type ApiResponse,
  type ErrorDetail,
} from "@/lib/server-responses";
import { getCurrentUser } from "@/lib/session";
import bcrypt from "bcrypt";

export interface UpdateProfileParams {
  name: string;
  // email is intentionally ignored for updates; kept for backward-compat callers
  email?: string;
  avatar?: string | null;
}

export async function updateProfile(
  values: UpdateProfileParams
): Promise<ApiResponse<{ id: number } | null>> {
  try {
    const current = await getCurrentUser();
    if (!current?.id) {
      return createErrorResponse(
        "Usuário não autenticado.",
        "AUTH_REQUIRED",
        401
      );
    }

    const errors: ErrorDetail[] = [];
    const name = values.name?.trim();
    const avatar = values.avatar ?? null;

    if (!name || name.length < 2) {
      errors.push({ field: "name", message: "Nome é obrigatório." });
    }

    if (errors.length > 0) {
      return createValidationError(errors);
    }

    await prisma.users.update({
      where: { id: current.id },
      data: {
        name,
        avatar,
      },
    });

    return createSuccessResponse(
      { id: current.id },
      "Perfil atualizado com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirm: string;
}

export async function changePassword(
  values: ChangePasswordParams
): Promise<ApiResponse<null>> {
  try {
    const current = await getCurrentUser();
    if (!current?.id) {
      return createErrorResponse(
        "Usuário não autenticado.",
        "AUTH_REQUIRED",
        401
      );
    }

    const errors: ErrorDetail[] = [];
    const currentPassword = values.currentPassword ?? "";
    const newPassword = values.newPassword ?? "";
    const confirm = values.confirm ?? "";

    if (!currentPassword) {
      errors.push({
        field: "currentPassword",
        message: "Senha atual é obrigatória.",
      });
    }
    if (!newPassword) {
      errors.push({
        field: "newPassword",
        message: "Nova senha é obrigatória.",
      });
    } else if (newPassword.length < 6) {
      errors.push({
        field: "newPassword",
        message: "A senha deve ter ao menos 6 caracteres.",
      });
    }
    if (!confirm) {
      errors.push({
        field: "confirm",
        message: "Confirmação da nova senha é obrigatória.",
      });
    } else if (newPassword !== confirm) {
      errors.push({ field: "confirm", message: "As senhas não coincidem." });
    }

    if (errors.length > 0) {
      return createValidationError(errors);
    }

    const dbUser = await prisma.users.findUnique({
      where: { id: current.id },
      select: { password_hash: true },
    });

    if (!dbUser) {
      return createErrorResponse("Usuário não encontrado.", "NOT_FOUND", 404);
    }

    const valid = await bcrypt.compare(currentPassword, dbUser.password_hash);
    if (!valid) {
      return createValidationError([
        { field: "currentPassword", message: "Senha atual incorreta." },
      ]);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: current.id },
      data: { password_hash: newHash },
    });

    return createSuccessResponse(null, "Senha atualizada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
