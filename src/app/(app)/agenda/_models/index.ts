import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type IAgendaSchedule = Prisma.schedulesGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    start_time: true;
    end_time: true;
    status: true;
    student_id: true;
    students: {
      select: {
        id: true;
        name: true;
        status: true;
      };
    };
  };
}>;

export interface IAgendaCalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string | null;
  studentId: number;
  studentName: string | null;
}

export const ScheduleCreateSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    start: z.date(),
    end: z.date(),
    studentId: z.number().int().positive("Selecione um aluno"),
  })
  .refine((data) => data.start.getTime() < data.end.getTime(), {
    message: "A data de início deve ser antes da data de fim",
    path: ["start"],
  });

export type ScheduleCreateValues = z.infer<typeof ScheduleCreateSchema>;
