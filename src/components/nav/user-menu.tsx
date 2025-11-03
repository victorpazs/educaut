import {
  ChevronDown,
  LogOut,
  Moon,
  Cog,
  Clock,
  BarChart3,
  Calendar,
  PencilIcon,
} from "lucide-react";
import { useCallback } from "react";
import { Avatar } from "../ui/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSession } from "@/hooks/useSession";
import { useSchoolChange } from "@/hooks/useSchoolChange";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { user, school } = useSession();
  const { changeSchool, isPending } = useSchoolChange();
  const router = useRouter();

  const schools = user?.schools ?? [];
  const selectedSchool = school ?? null;
  const isSelectDisabled = isPending;

  const handleSelectSchool = useCallback(
    (schoolId: string) => {
      if (schoolId === "__new_school__") {
        router.push("/settings/schools");
        return;
      }

      const nextSchool = schools.find((item) => item.id === Number(schoolId));

      if (!nextSchool) {
        return;
      }

      changeSchool(nextSchool);
    },
    [changeSchool, router, schools]
  );

  return (
    <Menu>
      <MenuTrigger>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar className="h-8 w-8" fallback="VP" />

          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </MenuTrigger>
      <MenuContent align="start" className="w-64">
        <div className="px-3 py-3 ">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12" fallback="VP" />
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{user?.name}</span>
              <Link
                className="text-xs text-muted-foreground flex items-center gap-1"
                href="/profile"
              >
                Editar perfil
                <PencilIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>
        <MenuSeparator />

        <div className="px-3 py-3">
          <Select
            value={selectedSchool ? String(selectedSchool.id) : undefined}
            onValueChange={handleSelectSchool}
            disabled={isSelectDisabled}
          >
            <SelectTrigger
              className="w-full justify-between"
              disabled={isSelectDisabled}
            >
              <div className="flex items-center gap-3">
                <SelectValue placeholder="Selecione uma escola" />
              </div>
            </SelectTrigger>
            <SelectContent align="start" className="min-w-[12rem]">
              {schools.map((userSchool) => (
                <SelectItem
                  key={userSchool.id}
                  value={String(userSchool.id)}
                  disabled={isPending && userSchool.id !== selectedSchool?.id}
                >
                  {userSchool.name}
                </SelectItem>
              ))}
              <SelectSeparator />
              <SelectItem value="__new_school__">Nova escola</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <MenuSeparator />

        <div className="py-1">
          <MenuItem>
            <Cog className="mr-3 h-4 w-4" />
            <span>Configurações</span>
          </MenuItem>

          <MenuItem>
            <Calendar className="mr-3 h-4 w-4" />
            <span>Calendário</span>
          </MenuItem>

          <MenuItem>
            <Clock className="mr-3 h-4 w-4" />
            <span>Fila</span>
          </MenuItem>

          <MenuItem>
            <BarChart3 className="mr-3 h-4 w-4" />
            <span>Estatísticas</span>
          </MenuItem>
        </div>

        <MenuSeparator />

        <div className="py-1">
          <MenuItem destructive>
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sair</span>
          </MenuItem>
        </div>
      </MenuContent>
    </Menu>
  );
}
