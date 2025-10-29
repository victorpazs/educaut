import { Prisma } from "@/generated/prisma";

export type User = Prisma.usersGetPayload<{
  omit: {
    password_hash: true;
  };
}>;
export type School = Prisma.schoolsGetPayload<{}>;
