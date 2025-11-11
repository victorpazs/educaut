import { SchoolAgenda } from "../../agenda/_components/SchoolAgenda";

export function HomeAgenda() {
  return (
    <div className="col-span-12  ">
      <SchoolAgenda isPreviewMode={true} />
    </div>
  );
}
