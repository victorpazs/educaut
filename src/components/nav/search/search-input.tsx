"use client";

import { FileCheck, User, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { SearchInput as SearchInputComponent } from "@/components/ui/search-input";

type SearchInputProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

type Category = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: Category[] = [
  { label: "Alunos", icon: User },
  { label: "Atividades", icon: FileCheck },
  { label: "Agenda", icon: Calendar },
];

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
      <SearchInputComponent
        autoFocus
        showClearButton={false}
        value={searchText}
        className="grow bg-transparent text-sm placeholder:text-gray-500 border-none outline-none"
        placeholder="Busca inteligente"
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="border-b border-border mx-4" />

      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Chip
                startIcon={category.icon}
                key={category.label}
                label={category.label}
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
