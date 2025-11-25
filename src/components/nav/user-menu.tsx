import {
  ChevronDown,
  Calendar,
  School,
  LogOut,
  Settings,
  Tag,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { LogoutDialog } from "@/app/auth/login/_components/LogoutDialog";
import { SchoolsSelector } from "./schools-selector";

export function UserMenu() {
  const { user } = useSession();
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onOptionClick = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  const menuOptions = [
    {
      label: "Meu perfil",
      icon: UserIcon,
      href: "/settings/profile",
    },
    {
      label: "Agenda",
      icon: Calendar,
      href: "/agenda",
    },

    {
      label: "Escolas",
      icon: School,
      href: "/settings/schools",
    },
    {
      label: "Atributos de alunos",
      icon: Tag,
      href: "/settings/attributes",
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
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar src={user?.avatar} className="h-8 w-8" fallback="VP" />
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <div className="px-3 py-3 ">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center w-full gap-3">
                <Avatar
                  src={user?.avatar}
                  className="h-12 w-12"
                  fallback="VP"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-sm">
                    {user?.name}
                  </span>
                  <span className="text-xs text-foreground">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 py-3">
            <SchoolsSelector />
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
            onSelect={() => {
              setIsMenuOpen(false);
              setIsLogoutDialogOpen(true);
            }}
          >
            <LogOut className="mr-3 h-4 w-4 text-black" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
