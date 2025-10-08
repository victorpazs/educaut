import { ZodSchema, ZodError } from "zod";
import { toast } from "@/lib/toast";

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
      // Handle Zod validation errors
      const errorMessages: string[] = [];

      parsed.error.issues.forEach((issue) => {
        const errorMessage = issue.message;

        // Add to error messages array for toast
        errorMessages.push(`${errorMessage}`);
      });

      // Show error toast with all validation messages
      if (errorMessages.length > 0) {
        toast.error("Ocorreu um erro", errorMessages.join(", "));
      }

      return null;
    }

    // Return validated data
    return parsed.data;
  } catch (error) {
    toast.error("Error", "Um erro inesperado ocorreu!");
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
