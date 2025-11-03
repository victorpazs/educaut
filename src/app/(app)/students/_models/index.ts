import { Prisma } from "@/generated/prisma";

export type IStudent = Prisma.studentsGetPayload<{
  select: {
    id: true;
    name: true;
    birth_year: true;
    school_year: true;
    created_at: true;
    status: true;
  };
}>;
