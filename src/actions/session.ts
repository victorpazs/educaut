"use server";

import { clearSchoolCookie, setSchoolCookie } from "@/lib/cookies";

export async function persistSelectedSchool(schoolId: number | null) {
  if (schoolId == null) {
    await clearSchoolCookie();
    return;
  }

  await setSchoolCookie(String(schoolId));
}

