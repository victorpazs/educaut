import { TabsWrapper } from "./_components/TabsWrapper";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4  lg:col-span-3">
          <TabsWrapper />
        </div>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
