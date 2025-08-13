import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClassesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Turmas</h1>
        <Button>Nova turma</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listagem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: tabela de turmas com detalhes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
