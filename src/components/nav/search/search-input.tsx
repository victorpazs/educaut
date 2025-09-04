"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";

type SearchInputProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

type Category = "Alunos" | "Atividades" | "Agenda";

const categories: Category[] = ["Alunos", "Atividades", "Agenda"];

const SearchInput = ({ searchText, setSearchText }: SearchInputProps) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex flex-col">
      {/* Search Input */}
      <div className="flex grow items-center h-[24px] gap-x-2 py-2 pl-[16px] pr-[12px] sm:h-[48px] sm:gap-x-[12px] sm:px-[20px] sm:py-[12px] text-foreground">
        <input
          autoFocus
          value={searchText}
          className="grow bg-transparent text-sm placeholder:text-gray-500 border-none outline-none"
          placeholder="Busca inteligente"
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="border-b border-border mx-4" />

      {/* Category Filter Chips */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Chip
                key={category}
                label={category}
                onClick={() => toggleCategory(category)}
                variant={isSelected ? "standard" : "outlined"}
                color={isSelected ? "primary" : "default"}
                size="sm"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
