import { cache } from "react";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      include: {
        schools: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

export const getAuthContext = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, school: null };
  }

  const cookieStore = await cookies();
  const schoolIdCookie = cookieStore.get("selected-school")?.value;
  let schoolId = schoolIdCookie ? parseInt(schoolIdCookie) : NaN;

  let school = null;

  // 1. If a valid schoolId is in the cookie, try to use it.
  if (!isNaN(schoolId)) {
    try {
      const foundSchool = await prisma.schools.findFirst({
        where: {
          id: schoolId,
          school_users: {
            some: {
              user_id: user.id, // Verify user still belongs to this school
            },
          },
        },
      });

      if (foundSchool) {
        school = foundSchool; // Success! Cookie was valid.
      } else {
        // Cookie was stale/invalid (user no longer in school or school deleted)
        cookieStore.delete("selected-school");
      }
    } catch (error) {
      console.error("Failed to fetch school from cookie:", error);
      // Proceed as if there was no cookie
    }
  }

  // 2. If we don't have a school yet (no cookie, or bad cookie)...
  if (!school) {
    // Check the user's school list (fetched by getCurrentUser)
    if (user.schools && user.schools.length > 0) {
      // REQ 1 & 2: Get the first school from the list
      school = user.schools[0];

      // Set the cookie for the next request
      cookieStore.set("selected-school", school.id.toString(), {
        path: "/",
        // Add other options as needed:
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    } else {
      // REQ 3: User is logged in but has NO schools.
      // This is an invalid state, so log them out.
      cookieStore.delete("token"); // Delete the session cookie
      cookieStore.delete("selected-school"); // Clean up just in case

      // Throw an error to stop further execution
      throw new Error("User is not associated with any school.");
    }
  }

  // 3. Return the final context
  return { user: user, school: school };
});
