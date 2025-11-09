import {
  ChevronDown,
  Cog,
  Calendar,
  PlusCircleIcon,
  School,
  LogOut,
  Settings,
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
import { Button } from "../ui/button";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";

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
        router.push("/settings/schools?new=1");
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

  const onOptionClick = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const menuOptions = [
    {
      label: "Minha agenda",
      icon: Calendar,
      href: "/agenda",
    },

    {
      label: "Escolas",
      icon: School,
      href: "/settings/schools",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
    },
  ];

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
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12" fallback="VP" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {user?.name}
                  </span>
                  <span className="text-xs text-foreground">{user?.email}</span>
                </div>
              </div>
              <Button
                onClick={() => onOptionClick("/settings/profile")}
                variant="ghost"
                size="icon"
              >
                <Settings className="h-4 w-4 text-black" />
              </Button>
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
              <SelectContent align="start">
                <SelectGroup>
                  <SelectLabel className="text-xs text-secondary px-1.5 py-1.5">
                    Escolas
                  </SelectLabel>

                  {schools.map((userSchool) => (
                    <SelectItem
                      key={userSchool.id}
                      value={String(userSchool.id)}
                      disabled={
                        isPending && userSchool.id !== selectedSchool?.id
                      }
                    >
                      {userSchool.name}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value="__new_school__">
                    <PlusCircleIcon className="text-black" />
                    Nova escola
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuSeparator />

          <div className="py-1">
            {menuOptions.map((option) => (
              <DropdownMenuItem
                key={option.href}
                onClick={() => onOptionClick(option.href)}
              >
                <option.icon className="mr-3 h-4 w-4 text-black" />
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="mr-3 h-4 w-4 text-black" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
