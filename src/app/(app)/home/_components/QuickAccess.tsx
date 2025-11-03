import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, School, User, FileText, Calendar } from "lucide-react";

export const QuickAccess = () => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-3"
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-1))] flex items-center justify-center flex-shrink-0">
                <School className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
              </div>
              <span className="text-sm">Nova Escola</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-3"
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-4))] flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
              </div>
              <span className="text-sm">Novo Aluno</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-3"
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-2))] flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm">Nova Atividade</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-3"
            >
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-5))] flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm">Agendar Aula</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
