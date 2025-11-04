import {
  ChevronDown,
  Cog,
  Calendar,
  PencilIcon,
  PlusCircleIcon,
  School,
  LogOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const preventCloseRef = useRef(false);
  const preventCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const schools = user?.schools ?? [];
  const selectedSchool = school ?? null;
  const isSelectDisabled = isPending;

  const allowMenuCloseSoon = useCallback(() => {
    preventCloseRef.current = true;

    if (preventCloseTimeoutRef.current) {
      clearTimeout(preventCloseTimeoutRef.current);
    }

    preventCloseTimeoutRef.current = setTimeout(() => {
      preventCloseRef.current = false;
      preventCloseTimeoutRef.current = null;
    }, 160);
  }, []);

  const handleMenuOpenChange = useCallback((open: boolean) => {
    if (!open && preventCloseRef.current) {
      return;
    }

    setIsMenuOpen(open);
  }, []);

  const handleSelectOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        allowMenuCloseSoon();
      }
    },
    [allowMenuCloseSoon]
  );

  const handleSelectSchool = useCallback(
    (schoolId: string) => {
      if (schoolId === "__new_school__") {
        setIsMenuOpen(false);
        router.push("/settings/schools");
        return;
      }

      const nextSchool = schools.find((item) => item.id === Number(schoolId));

      if (!nextSchool) {
        return;
      }

      allowMenuCloseSoon();
      changeSchool(nextSchool);
    },
    [allowMenuCloseSoon, changeSchool, router, schools]
  );

  useEffect(() => {
    return () => {
      if (preventCloseTimeoutRef.current) {
        clearTimeout(preventCloseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <LogoutDialog
        onClose={() => setIsLogoutDialogOpen(false)}
        open={isLogoutDialogOpen}
      />
      <DropdownMenu open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar className="h-8 w-8" fallback="VP" />

            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <div className="px-3 py-3 ">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12" fallback="VP" />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {user?.name}
                </span>
                <span className="text-xs text-foreground">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="px-3 py-3">
            <Select
              value={selectedSchool ? String(selectedSchool.id) : undefined}
              onValueChange={handleSelectSchool}
              disabled={isSelectDisabled}
              onOpenChange={handleSelectOpenChange}
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

          <DropdownMenuSeparator />

          <div className="py-1">
            <DropdownMenuItem>
              <Calendar className="mr-3 h-4 w-4 text-black" />
              <span>Minha agenda</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <School className="mr-3 h-4 w-4 text-black" />
              <span>Escolas</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cog className="mr-3 h-4 w-4 text-black" />
              <span>Configurações</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-1">
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setIsLogoutDialogOpen(true)}
            >
              <LogOut className="mr-3 h-4 w-4 text-black" />
              <span>Sair</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
