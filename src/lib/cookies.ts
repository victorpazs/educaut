"use server";

import { cookies } from "next/headers";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS,
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function setSchoolCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("selected_school", String(token), {
    maxAge: SEVEN_DAYS,
    path: "/",
  });
}

export async function getSchoolId(): Promise<number | undefined> {
  const cookieStore = await cookies();
  const value = cookieStore.get("selected_school")?.value;
  return value ? Number(value) : undefined;
}

export async function clearSchoolCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("selected_school");
}

export async function clearCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("selected_school");
}
