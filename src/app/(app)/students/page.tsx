import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Alunos</h1>
        <Button>Novo aluno</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listagem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: tabela com filtros e ações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
