import {
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
import { Avatar } from "../ui/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";

export function UserMenu() {
  return (
    <Menu>
      <MenuTrigger>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar className="h-8 w-8" fallback="VP" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-foreground">
              Victor paz da silva
            </span>
            <span className="text-xs text-muted-foreground">
              Escola: <b>Educarse</b>
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </MenuTrigger>
      <MenuContent align="start" className="w-64">
        {/* User Info Header */}
        <div className="px-3 py-3 ">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12" fallback="VP" />
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                Victor paz da silva
              </span>
              <span className="text-sm text-muted-foreground">
                Escola: <b>Educarse</b>
              </span>
            </div>
          </div>
        </div>

        {/* Project Section */}
        <div className="py-1">
          <MenuItem>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  PT
                </div>
                <span>projeto teste 23</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </MenuItem>
        </div>

        <MenuSeparator />

        {/* System Options */}
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

        {/* Logout */}
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
