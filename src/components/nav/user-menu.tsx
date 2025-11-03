import {
  Check,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Globe,
  EyeOff,
  Moon,
  Cog,
  MessageCircle,
  Clock,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useCallback } from "react";
import { Avatar } from "../ui/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import { useSession } from "@/hooks/useSession";
import { useSchoolChange } from "@/hooks/useSchoolChange";

export function UserMenu() {
  const { user, school } = useSession();
  const { changeSchool, isPending } = useSchoolChange();

  const schools = user?.schools ?? [];
  const selectedSchool = school ?? null;
  const schoolInitials = selectedSchool?.name
    ? selectedSchool.name.slice(0, 2).toUpperCase()
    : schools[0]?.name
    ? schools[0].name.slice(0, 2).toUpperCase()
    : "??";

  const handleSelectSchool = useCallback(
    (schoolId: number) => {
      const nextSchool = schools.find((item) => item.id === schoolId);

      if (!nextSchool) {
        return;
      }

      changeSchool(nextSchool);
    },
    [changeSchool, schools]
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
            </div>
          </div>
        </div>
        {schools.length > 0 && (
          <>
            <MenuSeparator />

            <div className="px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-semibold uppercase">
                  {schoolInitials}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {selectedSchool?.name ?? "Selecione uma escola"}
                  </span>
                </div>
              </div>
            </div>

            <MenuLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase">
              Escolas
            </MenuLabel>

            <div className="py-1">
              {schools.map((userSchool) => (
                <MenuItem
                  key={userSchool.id}
                  onClick={() => handleSelectSchool(userSchool.id)}
                  disabled={isPending && userSchool.id !== selectedSchool?.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-left text-sm text-foreground">
                    {userSchool.name}
                  </span>
                  {selectedSchool?.id === userSchool.id && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </MenuItem>
              ))}
            </div>

            <MenuSeparator />
          </>
        )}

        {schools.length === 0 && <MenuSeparator />}

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
