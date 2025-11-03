import { ZodSchema, ZodError } from "zod";
import { toast } from "@/lib/toast";
import { ErrorDetail } from "@/lib/server-responses";

/**
 * Reusable Zod validation function that automatically shows toast errors
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data if successful, null if validation failed
 */
export async function validateForm<T>(
  schema: ZodSchema<T>,
  data: T
): Promise<T | null> {
  try {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const errorDetails: ErrorDetail[] = [];

      parsed.error.issues.forEach((issue) => {
        errorDetails.push({
          field: issue.path.join("."),
          message: issue.message,
        });
      });

      if (errorDetails.length > 0) {
        const errorMessage = errorDetails[0]?.message || "Erro de validação";
        toast.error("Dados inválidos", errorMessage);
      }

      return null;
    }

    return parsed.data;
  } catch (error) {
    toast.error("Erro", "Um erro inesperado ocorreu!");
    return null;
  }
}

/**
 * Higher-order function that wraps a form submission handler with Zod validation
 * @param schema - Zod schema to validate against
 * @param handler - Actual form submission handler function
 * @returns Wrapped function that validates first, then calls handler if valid
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (data: T) => void | Promise<void>
) {
  return async function (data: T) {
    const validatedData = await validateForm(schema, data);

    if (validatedData) {
      return handler(validatedData);
    }
  };
}
