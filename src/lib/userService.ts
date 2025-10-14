/**
 * Example service demonstrating how to use the error handling library
 */
import { prisma } from "@/lib/prisma";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createNotFoundError,
  createValidationError
} from "@/lib/error";
import { ErrorDetail } from "@/lib/error";

// Example user type
interface User {
  id: bigint;
  name: string;
  email: string;
  created_at?: Date;
}

/**
 * Get user by ID
 * @param id - User ID
 * @returns ApiResponse with user data or error
 */
export async function getUserById(id: bigint) {
  try {
    const user = await prisma.users.findUnique({ 
      where: { id } 
    });
    
    if (!user) {
      return createNotFoundError("Usuário não encontrado.");
    }
    
    return createSuccessResponse(
      { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        created_at: user.created_at
      },
      "Usuário encontrado com sucesso."
    );
  } catch (error) {
    console.error("Get user error:", error);
    return createErrorResponse(
      "Erro ao buscar usuário.",
      "GET_USER_ERROR",
      500
    );
  }
}

/**
 * Create a new user
 * @param userData - User data
 * @returns ApiResponse with created user or error
 */
export async function createUser(userData: { name: string; email: string; password: string }) {
  try {
    // Validate input
    const errors: ErrorDetail[] = [];
    
    if (!userData.name || userData.name.trim().length === 0) {
      errors.push({ field: "name", message: "Nome é obrigatório." });
    }
    
    if (!userData.email || userData.email.trim().length === 0) {
      errors.push({ field: "email", message: "Email é obrigatório." });
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push({ field: "email", message: "Email inválido." });
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push({ field: "password", message: "Senha deve ter no mínimo 6 caracteres." });
    }
    
    if (errors.length > 0) {
      return createValidationError(errors);
    }
    
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ 
      where: { email: userData.email } 
    });
    
    if (existingUser) {
      return createErrorResponse(
        "Usuário com este email já existe.",
        "USER_EXISTS",
        409
      );
    }
    
    // Create user (in a real app, you'd hash the password)
    const user = await prisma.users.create({
      data: {
        name: userData.name,
        email: userData.email,
        password_hash: userData.password, // In real app, hash this!
      }
    });
    
    return createSuccessResponse(
      { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        created_at: user.created_at
      },
      "Usuário criado com sucesso."
    );
  } catch (error) {
    console.error("Create user error:", error);
    return createErrorResponse(
      "Erro ao criar usuário.",
      "CREATE_USER_ERROR",
      500
    );
  }
}