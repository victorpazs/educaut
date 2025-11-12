import { SchoolAgenda } from "../../agenda/_components/SchoolAgenda";
import { AgendaProvider } from "../../agenda/_hooks/use-agenda";

export function HomeAgenda() {
  return (
    <div className="col-span-12  ">
      <AgendaProvider>
        <SchoolAgenda isPreviewMode={true} />
      </AgendaProvider>
    </div>
  );
}
