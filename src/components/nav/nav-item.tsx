import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";

interface ISidebarItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function NavItem({ path, label, icon: Icon }: ISidebarItem) {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <li key={path}>
      <Link
        href={path}
        prefetch={true}
        className={cn(
          "flex flex-col items-center gap-2 px-3 py-3 rounded-lg text-xs font-medium transition-colors relative",
          isActive
            ? "bg-blue-50 text-muted-foreground hover:bg-blue-50"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-center">{label}</span>
      </Link>
    </li>
  );
}
