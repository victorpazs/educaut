import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { School as SchoolIcon, Calendar } from "lucide-react";
import type { ISchool } from "../_models";
import { SchoolEditDialog } from "./SchoolEditDialog";

type SchoolCardProps = ISchool & {
  onUpdated?: () => void;
};

export function SchoolCard({
  id,
  name,
  created_at,
  status,
  onUpdated,
}: SchoolCardProps) {
  const createdDate =
    created_at != null
      ? new Date(created_at).toLocaleDateString("pt-BR")
      : null;

  const statusLabel = mapStatus(status);

  return (
    <div className="transition duration-200 hover:-translate-y-1 col-span-12 md:col-span-6">
      <div className="pb-4">
        <div className="flex flex-wrap h-full justify-between items-center gap-4">
          <div className="flex-1">
            <div className="text-md font-medium text-foreground">{name}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {createdDate && (
                <span className="text-sm text-secondary">
                  Criada em {createdDate}
                </span>
              )}
            </div>
          </div>
          <SchoolEditDialog
            school={{ id, name, created_at, status }}
            onUpdated={onUpdated}
          />
        </div>
      </div>
    </div>
  );
}

function mapStatus(status: number | null | undefined) {
  if (status === 1) {
    return "Ativa";
  }

  if (status === 2) {
    return "Inativa";
  }

  return status != null ? `Status ${status}` : null;
}
