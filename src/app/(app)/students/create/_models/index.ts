import { z } from "zod";

export interface StudentFormData {
  name: string;
  birthday: Date;
  school_year: number;
  school_segment: string;
  tea_support_level: number | null;
  non_verbal: boolean | null;
  description: string;
  diagnosis: string;
  responsible: string[];
  student_attributes: number[];
}

export enum StudentCreateSteps {
  BASIC_INFO = "basic-info",
  DISORDER = "disorder",
  HYPERFOCUS = "hyperfocus",
  DIFFICULTY = "difficulty",
  PREFERENCE = "preference",
  POTENTIAL = "potential",
  WORKED_ACTIVITIES = "worked-activities",
}

export type CheckboxField = {
  [Key in keyof StudentFormData]: StudentFormData[Key] extends string[]
    ? Key
    : never;
}[keyof StudentFormData];

export const StudentCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  school_segment: z.string().min(1, "Segmento escolar é obrigatório"),
  school_year: z.number().int("Ano escolar inválido"),
});

export type StudentCreateValues = z.infer<typeof StudentCreateSchema>;
