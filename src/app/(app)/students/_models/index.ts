import { Prisma } from "@/generated/prisma";

export type IStudent = Prisma.studentsGetPayload<{
  select: {
    id: true;
    name: true;
    birth_year: true;
    school_year: true;
    created_at: true;
    status: true;
    school_segment: true;
  };
}>;

export type IStudentDetail = Prisma.studentsGetPayload<{
  select: {
    id: true;
    name: true;
    birth_year: true;
    school_year: true;
    school_segment: true;
    tea_support_level: true;
    communication: true;
    description: true;
    created_at: true;
    status: true;
    school_id: true;
    student_attributes: {
      select: {
        attribute_id: true;
        attributes: {
          select: {
            id: true;
            name: true;
            type_id: true;
            attribute_types: {
              select: {
                id: true;
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;
