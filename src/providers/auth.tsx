import { ReactNode } from "react";
import { SessionProvider } from "@/providers/session-provider";
import { getAuthContext } from "@/lib/session";
import { redirect } from "next/navigation";

export async function AuthProvider({ children }: { children: ReactNode }) {
  const { user, school } = await getAuthContext();

  if (!user) {
    redirect("/auth/logout");
  }

  return <SessionProvider value={{ user, school }}>{children}</SessionProvider>;
}
