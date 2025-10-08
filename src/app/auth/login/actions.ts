"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";
import { clearCookies, setAuthCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";
import { LoginValues } from "@/components/auth/LoginForm";

export async function loginAction({ email, password }: LoginValues) {
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return { error: "User not found" };

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return { error: "Invalid credentials" };

    const token = await signJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    redirect("/home");
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutAction() {
  try {
    await clearCookies();
    redirect("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "Failed to logout. Please try again." };
  }
}