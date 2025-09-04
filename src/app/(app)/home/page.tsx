import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data for dashboard cards
const dashboardData = [
  {
    title: "Alunos",
    value: "128",
    subtitle: "+12 este mês",
  },
  {
    title: "Turmas",
    value: "8",
    subtitle: "2 ativas",
  },
  {
    title: "Atividades",
    value: "56",
    subtitle: "7 pendentes",
  },
  {
    title: "Entregas",
    value: "91%",
    subtitle: "Taxa média",
  },
];

export default function DashboardPage() {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>;
}
