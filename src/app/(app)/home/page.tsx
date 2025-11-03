import { PageHeader } from "@/components/page-header";
import { Calendar, School, Users } from "lucide-react";
import { TotalizerCard } from "./_components/TotalizerCard";
import { QuickAccess } from "./_components/QuickAccess";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Bem vindo, educador!"
            subtitle="Gerencie suas aulas, atividades e agenda de forma simples e prática."
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <TotalizerCard
            title="Total de alunos"
            value={24}
            icon={<Users className="h-6 w-6" />}
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <TotalizerCard
            title="Aulas da semana"
            value={18}
            icon={<Calendar className="h-6 w-6" />}
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <QuickAccess />
        </div>
      </div>
    </div>
  );
}
