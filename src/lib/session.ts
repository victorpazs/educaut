"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { getSchoolId } from "./cookies";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("token")?.value;

  if (!sessionCookie) {
    return null;
  }

  const session = await verifyJwt(sessionCookie);

  if (
    !session.success ||
    !session.data ||
    !session.data.id ||
    isNaN(parseInt(session.data.id))
  ) {
    return null;
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(session.data.id) },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        avatar: true,
        school_users: {
          include: {
            schools: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }
    const user_schools = user.school_users.map(
      (school_user) => school_user.schools
    );

    const { school_users, ...userWithoutSchoolUsers } = user;
    return { ...userWithoutSchoolUsers, schools: user_schools };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

export const getSelectedSchoolById = cache(
  async (schoolId: number, userId: number) => {
    try {
      const foundSchool = await prisma.schools.findFirst({
        where: {
          id: schoolId,
          school_users: {
            some: {
              user_id: userId,
            },
          },
        },
      });

      return foundSchool;
    } catch (error) {
      console.error("Failed to fetch school from cookie:", error);
      return null;
    }
  }
);

export const getAuthContext = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, school: null };
  }

  const schoolIdCookie = await getSchoolId();

  if (!schoolIdCookie) {
    return { user: user, school: null };
  }

  const selectedSchool = await verifyJwt(schoolIdCookie);

  let school = null;

  if (
    selectedSchool &&
    selectedSchool.data &&
    selectedSchool.data.id &&
    !isNaN(Number(selectedSchool.data.id))
  ) {
    const foundSchool = await getSelectedSchoolById(
      Number(selectedSchool.data.id),
      user.id
    );

    if (foundSchool) {
      school = foundSchool;
    }
  }

  return { user: user, school: school };
});
