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
    <SearchInputComponent
      autoFocus
      showClearButton={true}
      size="lg"
      value={searchText}
      className="grow bg-transparent text-lg! placeholder:text-gray-500 border-primary! shadow-none! outline-none! ring-0! border-none! rounded-3xl"
      placeholder="Busca inteligente"
      onChange={(e) => setSearchText(e.target.value)}
      onClear={onClose}
    />
  );
};

export default SearchInput;
