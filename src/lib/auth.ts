import { SignJWT, jwtVerify } from "jose";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/server-responses";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JwtPayload = {
  id: string; // Changed from bigint to string for JSON serialization
};

/**
 * Signs a JWT for the user
 * @param payload - JWT payload (with string ID)
 * @returns Signed JWT token or error response
 */
export async function signJwt(payload: JwtPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    return createSuccessResponse(token, "Token gerado com sucesso.");
  } catch (error) {
    console.error(error);
    return createErrorResponse(
      "Erro ao gerar token de autenticação.",
      "JWT_SIGN_ERROR",
      500
    );
  }
}

/**
 * Verifies a JWT and returns its payload, or null if invalid/expired
 * @param token - JWT token to verify
 * @returns JWT payload or error response
 */
export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return createSuccessResponse(
      payload as JwtPayload,
      "Token verificado com sucesso."
    );
  } catch (error) {
    return createErrorResponse(
      "Token inválido ou expirado.",
      "JWT_VERIFY_ERROR",
      401
    );
  }
}
