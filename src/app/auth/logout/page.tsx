import type { Metadata } from "next";
import { LogoutContent } from "./_components/logout-content";

export const metadata: Metadata = {
  title: "Encerrando sessão | EducAut",
};

export default function LogoutPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <LogoutContent />
    </div>
  );
}
