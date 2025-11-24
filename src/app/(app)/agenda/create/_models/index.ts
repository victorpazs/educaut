import { z } from "zod";

export interface ScheduleFormData {
  title: string;
  description: string;
  start: Date;
  end: Date;
  studentId: number | null;
  activityIds: number[];
}

export enum ScheduleCreateSteps {
  BASIC_INFO = "basic-info",
  TIME_INFO = "time-info",
  ACTIVITIES = "activities",
}

export const ScheduleCreateSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    start: z.date(),
    end: z.date(),
    studentId: z.number().int().positive("Selecione um aluno").nullable(),
    activityIds: z.array(z.number()).optional(),
  })
  .refine((data) => data.start.getTime() < data.end.getTime(), {
    message: "A data de início deve ser antes da data de fim",
    path: ["start"],
  })
  .refine((data) => data.studentId !== null && data.studentId > 0, {
    message: "Selecione um aluno",
    path: ["studentId"],
  });

export type ScheduleCreateValues = z.infer<typeof ScheduleCreateSchema>;
