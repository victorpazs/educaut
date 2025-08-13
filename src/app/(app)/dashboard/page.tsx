import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">128</div>
          <p className="text-sm text-muted-foreground">+12 este mês</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Turmas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">8</div>
          <p className="text-sm text-muted-foreground">2 ativas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">56</div>
          <p className="text-sm text-muted-foreground">7 pendentes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">91%</div>
          <p className="text-sm text-muted-foreground">Taxa média</p>
        </CardContent>
      </Card>
    </div>
  );
}
