import { School, User } from "lucide-react";
import { TabsSidebar } from "../../../components/tabs-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const options = [
    {
      label: "Meu perfil",
      href: "/settings/profile",
      icon: User,
    },
    {
      label: "Escolas",
      href: "/settings/schools",
      icon: School,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4  lg:col-span-3">
          <TabsSidebar options={options} />
        </div>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
