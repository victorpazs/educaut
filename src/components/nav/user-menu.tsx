import { ChevronDown, LogOut, Settings, User } from "lucide-react";
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
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8" fallback="VP" />
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </MenuItem>
        <MenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem destructive>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
