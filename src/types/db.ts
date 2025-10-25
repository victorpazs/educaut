import { Prisma } from "@/generated/prisma";

export type User = Prisma.usersGetPayload<{}>;
export type School = Prisma.schoolsGetPayload<{}>;
