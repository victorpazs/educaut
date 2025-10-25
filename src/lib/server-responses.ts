/**
 * Standardized API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T | null;
  error?: {
    code: string;
    details?: any;
  };
}

/**
 * Error detail interface for field-specific errors
 */
export interface ErrorDetail {
  field?: string;
  message: string;
}

/**
 * Creates a standardized success response
 * @param data - The data to return
 * @param message - Success message
 * @param status - HTTP status code (default: 200)
 * @returns Standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = "Operação realizada com sucesso.",
  status: number = 200
): ApiResponse<T> {
  return {
    success: true,
    status,
    message,
    data,
  };
}

/**
 * Creates a standardized error response
 * @param message - Error message
 * @param errorCode - Error code
 * @param status - HTTP status code (default: 400)
 * @param details - Error details (optional)
 * @returns Standardized error response
 */
export function createErrorResponse(
  message: string = "Ocorreu um erro.",
  errorCode: string = "UNKNOWN_ERROR",
  status: number = 400,
  details?: ErrorDetail[]
): ApiResponse<null> {
  return {
    success: false,
    status,
    message,
    error: {
      code: errorCode,
      ...(details && { details }),
    },
  };
}

/**
 * Creates a validation error response
 * @param details - Validation error details
 * @param message - Error message
 * @returns Standardized validation error response
 */
export function createValidationError(
  details: ErrorDetail[],
  message: string = "Erro de validação dos dados."
): ApiResponse<null> {
  return createErrorResponse(message, "VALIDATION_ERROR", 400, details);
}

/**
 * Creates an authentication error response
 * @param message - Error message
 * @returns Standardized authentication error response
 */
export function createAuthError(
  message: string = "Erro de autenticação."
): ApiResponse<null> {
  return createErrorResponse(message, "AUTH_ERROR", 401);
}

/**
 * Creates a not found error response
 * @param message - Error message
 * @returns Standardized not found error response
 */
export function createNotFoundError(
  message: string = "Recurso não encontrado."
): ApiResponse<null> {
  return createErrorResponse(message, "NOT_FOUND", 404);
}

/**
 * Creates an internal server error response
 * @param message - Error message
 * @returns Standardized internal server error response
 */
export function createServerError(
  message: string = "Erro interno do servidor."
): ApiResponse<null> {
  return createErrorResponse(message, "INTERNAL_ERROR", 500);
}

/**
 * Handles errors and converts them to standardized responses
 * @param error - The error to handle
 * @returns Standardized error response
 */
export function handleServerError(error: any): ApiResponse<null> {
  if (error && typeof error === "object" && "success" in error) {
    return error;
  }

  console.error("Server Error:", error);

  if (error instanceof Error) {
    return createServerError(error.message);
  }

  // Default fallback
  return createServerError();
}
