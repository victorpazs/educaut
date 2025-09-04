type SearchOptionProps = {
  icon?: string;
  title: string;
  type: string;
  onClick?: () => void;
};

export function SearchOption({
  icon = "manage_search",
  title,
  type,
  onClick,
}: SearchOptionProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      className="cursor-pointer dark:hover:bg-tertiary hover:bg-gray-300/30 w-full flex gap-x-4 items-center px-2 py-2 rounded-lg"
    >
      <div className="outline outline-1 dark:outline-tertiary outline-gray-300/80 p-1 px-2 rounded-md flex items-center justify-center"></div>

      <div className="flex flex-col text-start">
        <span className="text-sm text-textLight dark:text-textDark font-medium">
          {title}
        </span>
        <span className="text-xs text-neutral-800 dark:text-slate-300">
          {type}
        </span>
      </div>
    </div>
  );
}
