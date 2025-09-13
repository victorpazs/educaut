export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="text-secondary">{subtitle}</p>
    </div>
  );
}
