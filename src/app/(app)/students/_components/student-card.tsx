import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  CakeIcon,
  Edit,
  GraduationCap,
  Backpack,
} from "lucide-react";

import type { IStudent } from "../_models";
import { Avatar } from "@/components/ui/avatar";

type StudentCardProps = IStudent;

export function StudentCard({
  id,
  name,
  birth_year,
  school_year,
  school_segment,
}: StudentCardProps) {
  const currentYear = new Date().getFullYear();
  const age = birth_year ? currentYear - birth_year : null;

  return (
    <Card className="transition duration-200 hover:-translate-y-1 rounded-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 rounded-sm border-none">
            {name.charAt(0)}
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-md font-medium text-foreground">
              {name}
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {school_year && (
                <Chip
                  label={school_year}
                  color="default"
                  size="sm"
                  startIcon={GraduationCap}
                />
              )}
              {school_segment && (
                <Chip
                  label={school_segment}
                  color="default"
                  size="sm"
                  startIcon={Backpack}
                />
              )}

              {age !== null && (
                <Chip
                  label={`${age} anos`}
                  color="default"
                  size="sm"
                  startIcon={CakeIcon}
                />
              )}
            </div>
          </div>
          <Link href={`/students/edit/${id}`}>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
}

function mapStatus(status: number | null | undefined) {
  if (status === 1) {
    return "Ativo";
  }

  if (status === 2) {
    return "Inativo";
  }

  return status != null ? `Status ${status}` : null;
}
