import {
  ChevronDown,
  Cog,
  Calendar,
  PencilIcon,
  PlusCircleIcon,
  School,
  LogOut,
} from "lucide-react";
import { useCallback, useState } from "react";
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
import { LogoutDialog } from "@/app/auth/login/_components/LogoutDialog";

export function UserMenu() {
  const { user, school } = useSession();
  const { changeSchool, isPending } = useSchoolChange();
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
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
    <>
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
                <span className="font-medium text-foreground">
                  {user?.name}
                </span>
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
                <SelectItem value="__new_school__">
                  <PlusCircleIcon className="text-black" />
                  Nova escola
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <MenuSeparator />

          <div className="py-1">
            <MenuItem>
              <Calendar className="mr-3 h-4 w-4" />
              <span>Minha agenda</span>
            </MenuItem>

            <MenuItem>
              <School className="mr-3 h-4 w-4" />
              <span>Escolas</span>
            </MenuItem>
            <MenuItem>
              <Cog className="mr-3 h-4 w-4" />
              <span>Configurações</span>
            </MenuItem>
          </div>

          <MenuSeparator />

          <div className="py-1">
            <LogoutDialog
              onClose={() => setIsLogoutDialogOpen(false)}
              open={isLogoutDialogOpen}
            >
              <MenuItem destructive onClick={() => setIsLogoutDialogOpen(true)}>
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sair</span>
              </MenuItem>
            </LogoutDialog>
          </div>
        </MenuContent>
      </Menu>
    </>
  );
}
