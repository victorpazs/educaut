"use client";

import { SearchInput as SearchInputComponent } from "@/components/ui/search-input";

type SearchInputProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
};

export type Category = {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SearchInput = ({
  searchText,
  setSearchText,
  onClose,
}: SearchInputProps) => {
  return (
    <div className="flex mt-1 flex-col">
      <SearchInputComponent
        autoFocus
        showClearButton={true}
        value={searchText}
        className="grow bg-transparent text-sm placeholder:text-gray-500 border-primary! shadow-none! outline-none"
        placeholder="Busca inteligente"
        onChange={(e) => setSearchText(e.target.value)}
        onClear={onClose}
      />
    </div>
  );
};

export default SearchInput;
