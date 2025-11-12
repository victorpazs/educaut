import { ReactNode } from "react";
import { AgendaProvider } from "./_hooks/use-agenda";

export default function AgendaLayout({ children }: { children: ReactNode }) {
  return <AgendaProvider>{children}</AgendaProvider>;
}
