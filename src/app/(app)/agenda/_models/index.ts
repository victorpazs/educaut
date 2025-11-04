import { Prisma } from "@/generated/prisma";

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

