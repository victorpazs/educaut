"use client";

import { FileCheck, User, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { SearchInput as SearchInputComponent } from "@/components/ui/search-input";

type SearchInputProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onClose: () => void;
};

export type Category = {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: Category[] = [
  { type: "student", label: "Alunos", icon: User },
  { type: "activity", label: "Atividades", icon: FileCheck },
  { type: "calendar", label: "Agenda", icon: Calendar },
];

const SearchInput = ({
  searchText,
  setSearchText,
  selectedCategories,
  setSelectedCategories,
  onClose,
}: SearchInputProps) => {
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
        showClearButton={true}
        value={searchText}
        className="grow bg-transparent text-sm placeholder:text-gray-500 border-primary! shadow-none! outline-none"
        placeholder="Busca inteligente"
        onChange={(e) => setSearchText(e.target.value)}
        onClear={onClose}
      />

      <div className="py-2">
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
