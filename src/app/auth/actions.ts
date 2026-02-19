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
import {
  createErrorResponse,
  createAuthError,
  createValidationError,
  createSuccessResponse,
} from "@/lib/server-responses";
import { ErrorDetail } from "@/lib/server-responses";
import { LoginValues } from "./login/_models";
import { RegisterValues } from "./register/_models";
import {
  generateOtpCode,
  generateSecureToken,
  getTokenExpiresAt,
} from "@/lib/email";
import {
  sendOtpEmail,
  sendPasswordRecoveryEmail,
} from "@/services/email.service";
import { checkRateLimit } from "@/lib/rate-limit";

// ─── Login ──────────────────────────────────────────────────────
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

    // Se require_two_factor, enviar OTP ao invés de autenticar
    if (user.require_two_factor) {
      const otpCode = generateOtpCode();

      // Invalidar OTPs anteriores de login deste user
      await prisma.tokens.deleteMany({
        where: {
          user_id: user.id,
          type: "login_otp",
          used_at: null,
        },
      });

      await prisma.tokens.create({
        data: {
          user_id: user.id,
          email: user.email,
          type: "login_otp",
          token: otpCode,
          expires_at: getTokenExpiresAt(15),
        },
      });

      try {
        await sendOtpEmail(user.email, otpCode);
      } catch (emailError) {
        console.error("Failed to send login OTP:", emailError);
      }

      return createErrorResponse(
        "Código de verificação enviado para seu e-mail.",
        "REQUIRES_2FA",
        403,
      );
    }

    // Autenticação normal (sem 2FA)
    return await completeLogin(user);
  } catch (error) {
    return createErrorResponse(
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
      "LOGIN_ERROR",
      500,
    );
  }
}

// ─── Verificar OTP do Login (2FA) ───────────────────────────────
export async function verifyLoginOtpAction(email: string, code: string) {
  try {
    if (!email || !code) {
      return createErrorResponse(
        "E-mail e código são obrigatórios.",
        "VALIDATION_ERROR",
        400,
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const tokenRecord = await prisma.tokens.findFirst({
      where: {
        email: normalizedEmail,
        type: "login_otp",
        token: code,
        used_at: null,
      },
    });

    if (!tokenRecord) {
      return createErrorResponse("Código inválido.", "INVALID_CODE", 400);
    }

    if (new Date() > tokenRecord.expires_at) {
      return createErrorResponse(
        "Código expirado. Faça login novamente.",
        "CODE_EXPIRED",
        400,
      );
    }

    // Marcar token como usado
    await prisma.tokens.update({
      where: { id: tokenRecord.id },
      data: { used_at: new Date() },
    });

    const user = await prisma.users.findUnique({
      where: { id: tokenRecord.user_id! },
      include: {
        school_users: {
          include: { schools: true },
          where: { schools: { status: 1 } },
        },
      },
    });

    if (!user) {
      return createErrorResponse(
        "Usuário não encontrado.",
        "USER_NOT_FOUND",
        404,
      );
    }

    return await completeLogin(user);
  } catch (error) {
    console.error("Verify login OTP error:", error);
    return createErrorResponse(
      "Erro interno ao verificar código.",
      "INTERNAL_ERROR",
      500,
    );
  }
}

// ─── Helper: completar login ────────────────────────────────────
async function completeLogin(user: {
  id: number;
  school_users: {
    schools: {
      id: number;
      status: number | null;
      created_at: Date | null;
      name: string;
      created_by: number;
    };
  }[];
}) {
  const tokenResponse = await signJwt({
    id: user.id.toString(),
  });

  if (!tokenResponse.success || !tokenResponse.data) {
    return tokenResponse;
  }

  await setAuthCookie(tokenResponse.data);

  const userSchools = user.school_users.map(
    (school_user) => school_user.schools,
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
}

// ─── Selecionar escola ──────────────────────────────────────────
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
      500,
    );
  }
}

// ─── Registro (salva dados + envia OTP, NÃO cria user) ─────────
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

    // Verificar se email já está cadastrado
    const existingUser = await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return createValidationError([
        { field: "email", message: "Email já cadastrado." },
      ]);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otpCode = generateOtpCode();

    // Invalidar OTPs de registro anteriores para este email
    await prisma.tokens.deleteMany({
      where: {
        email: normalizedEmail,
        type: "registration_otp",
        used_at: null,
      },
    });

    // Salvar dados do registro + OTP (user NÃO é criado ainda)
    await prisma.tokens.create({
      data: {
        email: normalizedEmail,
        type: "registration_otp",
        token: otpCode,
        expires_at: getTokenExpiresAt(15),
        metadata: {
          name: normalizedName,
          email: normalizedEmail,
          password_hash: passwordHash,
          school_name: normalizedSchoolName,
        },
      },
    });

    try {
      await sendOtpEmail(normalizedEmail, otpCode);
    } catch (emailError) {
      console.error("Failed to send registration OTP:", emailError);
    }

    return createSuccessResponse(
      { email: normalizedEmail },
      "Código de verificação enviado para seu e-mail.",
    );
  } catch (error) {
    return createErrorResponse(
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
      "REGISTER_ERROR",
      500,
    );
  }
}

// ─── Confirmar registro (validar OTP e criar user) ──────────────
export async function confirmRegistrationAction(email: string, code: string) {
  try {
    if (!email || !code) {
      return createErrorResponse(
        "E-mail e código são obrigatórios.",
        "VALIDATION_ERROR",
        400,
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const tokenRecord = await prisma.tokens.findFirst({
      where: {
        email: normalizedEmail,
        type: "registration_otp",
        token: code,
        used_at: null,
      },
    });

    if (!tokenRecord) {
      return createErrorResponse("Código inválido.", "INVALID_CODE", 400);
    }

    if (new Date() > tokenRecord.expires_at) {
      return createErrorResponse(
        "Código expirado. Solicite um novo código.",
        "CODE_EXPIRED",
        400,
      );
    }

    const metadata = tokenRecord.metadata as {
      name: string;
      email: string;
      password_hash: string;
      school_name: string;
    };

    if (
      !metadata?.name ||
      !metadata?.email ||
      !metadata?.password_hash ||
      !metadata?.school_name
    ) {
      return createErrorResponse(
        "Dados de registro inválidos. Tente se registrar novamente.",
        "INVALID_METADATA",
        400,
      );
    }

    // Verificar se email já foi cadastrado (dupla proteção)
    const existingUser = await prisma.users.findUnique({
      where: { email: metadata.email },
    });
    if (existingUser) {
      return createValidationError([
        { field: "email", message: "Email já cadastrado." },
      ]);
    }

    // Criar user + school + marcar token como usado
    await prisma.$transaction(async (tx) => {
      const createdUser = await tx.users.create({
        data: {
          name: metadata.name,
          email: metadata.email,
          password_hash: metadata.password_hash,
        },
      });

      await tx.schools.create({
        data: {
          name: metadata.school_name,
          created_by: createdUser.id,
        },
      });

      await tx.tokens.update({
        where: { id: tokenRecord.id },
        data: { used_at: new Date() },
      });
    });

    return createSuccessResponse(null, "Conta criada com sucesso!");
  } catch (error) {
    console.error("Confirm registration error:", error);
    return createErrorResponse(
      "Erro interno ao confirmar registro.",
      "INTERNAL_ERROR",
      500,
    );
  }
}

// ─── Reenviar OTP ───────────────────────────────────────────────
export async function resendOtpAction(
  email: string,
  type: "registration_otp" | "login_otp",
) {
  try {
    if (!email) {
      return createErrorResponse(
        "E-mail é obrigatório.",
        "VALIDATION_ERROR",
        400,
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!checkRateLimit(`otp:${normalizedEmail}`)) {
      return createErrorResponse(
        "Muitas tentativas. Aguarde alguns minutos.",
        "RATE_LIMIT",
        429,
      );
    }

    // Buscar o token mais recente não usado
    const existingToken = await prisma.tokens.findFirst({
      where: {
        email: normalizedEmail,
        type,
        used_at: null,
      },
      orderBy: { created_at: "desc" },
    });

    if (!existingToken) {
      // Resposta genérica por segurança
      return createSuccessResponse(
        null,
        "Se o e-mail estiver correto, um novo código será enviado.",
      );
    }

    const newCode = generateOtpCode();

    // Invalidar anteriores e criar novo
    await prisma.$transaction([
      prisma.tokens.deleteMany({
        where: {
          email: normalizedEmail,
          type,
          used_at: null,
        },
      }),
      prisma.tokens.create({
        data: {
          user_id: existingToken.user_id,
          email: normalizedEmail,
          type,
          token: newCode,
          expires_at: getTokenExpiresAt(15),
          metadata: existingToken.metadata ?? undefined,
        },
      }),
    ]);

    try {
      await sendOtpEmail(normalizedEmail, newCode);
    } catch (emailError) {
      console.error("Failed to resend OTP:", emailError);
    }

    return createSuccessResponse(null, "Novo código enviado para seu e-mail.");
  } catch (error) {
    console.error("Resend OTP error:", error);
    return createErrorResponse(
      "Erro interno ao reenviar código.",
      "INTERNAL_ERROR",
      500,
    );
  }
}

// ─── Esqueci minha senha ─────────────────────────────────────────
export async function forgotPasswordAction(email: string) {
  try {
    if (!email) {
      return createErrorResponse(
        "E-mail é obrigatório.",
        "VALIDATION_ERROR",
        400,
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!checkRateLimit(`pwd-reset:${normalizedEmail}`)) {
      return createErrorResponse(
        "Muitas tentativas. Aguarde alguns minutos.",
        "RATE_LIMIT",
        429,
      );
    }

    // Resposta genérica por segurança (não revelar se email existe)
    const genericResponse = createSuccessResponse(
      null,
      "Se o e-mail estiver cadastrado, enviaremos um link de recuperação.",
    );

    const user = await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return genericResponse;
    }

    // Invalidar tokens de reset anteriores
    await prisma.tokens.deleteMany({
      where: {
        user_id: user.id,
        type: "password_reset",
        used_at: null,
      },
    });

    const token = generateSecureToken();

    await prisma.tokens.create({
      data: {
        user_id: user.id,
        email: normalizedEmail,
        type: "password_reset",
        token,
        expires_at: getTokenExpiresAt(30),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/auth/password-recovery/${token}`;

    try {
      await sendPasswordRecoveryEmail(normalizedEmail, user.name, resetLink);
    } catch (emailError) {
      console.error("Failed to send password recovery email:", emailError);
    }

    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return createErrorResponse(
      "Erro interno. Tente novamente.",
      "INTERNAL_ERROR",
      500,
    );
  }
}

// ─── Redefinir senha ─────────────────────────────────────────────
export async function resetPasswordAction(
  token: string,
  password: string,
  confirm: string,
) {
  try {
    const errors: ErrorDetail[] = [];

    if (!token) {
      return createErrorResponse("Token inválido.", "INVALID_TOKEN", 400);
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

    const tokenRecord = await prisma.tokens.findFirst({
      where: {
        token,
        type: "password_reset",
        used_at: null,
      },
    });

    if (!tokenRecord) {
      return createErrorResponse(
        "Link inválido ou já utilizado.",
        "INVALID_TOKEN",
        400,
      );
    }

    if (new Date() > tokenRecord.expires_at) {
      return createErrorResponse(
        "Link expirado. Solicite uma nova recuperação.",
        "TOKEN_EXPIRED",
        400,
      );
    }

    if (!tokenRecord.user_id) {
      return createErrorResponse("Token inválido.", "INVALID_TOKEN", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.users.update({
        where: { id: tokenRecord.user_id },
        data: { password_hash: passwordHash },
      }),
      prisma.tokens.update({
        where: { id: tokenRecord.id },
        data: { used_at: new Date() },
      }),
    ]);

    return createSuccessResponse(null, "Senha redefinida com sucesso!");
  } catch (error) {
    console.error("Reset password error:", error);
    return createErrorResponse(
      "Erro interno ao redefinir senha.",
      "INTERNAL_ERROR",
      500,
    );
  }
}

// ─── Logout ─────────────────────────────────────────────────────
export async function logoutAction() {
  try {
    await clearCookies();
  } catch (error) {
    console.error("Logout error:", error);
    return createErrorResponse(
      "Falha ao sair. Por favor, tente novamente.",
      "LOGOUT_ERROR",
      500,
    );
  }

  return createSuccessResponse("Logout realizado com sucesso.");
}
