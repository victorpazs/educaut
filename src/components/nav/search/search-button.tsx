import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
type SearchProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const Search = ({ disabled, onClick }: SearchProps) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "fixed bottom-22 right-2 z-40 md:hidden flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200",
          disabled && "pointer-events-none opacity-70"
        )}
      >
        <SearchIcon className="w-4 h-4 text-gray-500" />
      </button>

      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "hidden md:flex group absolute left-[50%] translate-x-[-50%] h-[36px] max-w-xs w-full items-center gap-x-2 px-2 py-2 justify-start cursor-pointer text-muted-foreground bg-muted hover:bg-muted/80 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors ease-out",
          disabled && "pointer-events-none opacity-70"
        )}
      >
        <SearchIcon className="text-gray-500 w-4 h-4" />
        <span className="truncate text-gray-500 text-sm">Pesquisa...</span>
      </button>
    </>
  );
};

export default Search;
