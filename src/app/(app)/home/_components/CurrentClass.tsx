"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentClass } from "../_hooks/use-current-class";
import { Skeleton } from "@/components/ui/skeleton";

export const CurrentClass = () => {
  const router = useRouter();
  const { currentClass, isLoading } = useCurrentClass();

  const handleCreateClick = () => {
    router.push("/agenda/create");
  };

  if (isLoading) {
    return (
      <CardShell>
        <div className="flex flex-col gap-3">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-48 mt-2" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
      </CardShell>
    );
  }

  if (!currentClass) {
    return (
      <CardShell>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold opacity-90">Sua agenda</p>
            <p className="text-lg font-bold mt-2">Nenhuma aula no momento</p>
          </div>
          <Button
            onClick={handleCreateClick}
            variant="secondary"
            size="sm"
            className="ml-auto text-muted-foreground"
          >
            Criar agora
          </Button>
        </div>
      </CardShell>
    );
  }

  const handleClick = () => {
    router.push(`/agenda/edit/${currentClass.id}`);
  };

  return (
    <CardShell onClick={handleClick}>
      <div>
        <p className="text-sm font-semibold opacity-90">Aula em andamento</p>
        <p className="text-lg font-bold mt-2">{currentClass.title}</p>
        {currentClass.students && currentClass.students.length > 0 && (
          <p className="text-sm opacity-80 mt-1">
            {currentClass.students.length === 1
              ? `Aluno: ${currentClass.students[0].name}`
              : `${currentClass.students.length} alunos`}
          </p>
        )}
      </div>
    </CardShell>
  );
};

export const CardShell = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Card
      onClick={onClick}
      className="bg-muted-foreground/80 text-white cursor-pointer hover:bg-muted-foreground/90 transition-colors"
    >
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
};
