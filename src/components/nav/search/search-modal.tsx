"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import SearchInput from "./search-input";
import { SearchOption } from "./search-option";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "./search-input";

export function SearchModal() {
  const { toggle, isOpen } = useSearch();
  const { searchText, setSearchText, isLoading, options } = useLiveQuery();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="rounded-xl py-6 px-4">
        <div className="w-full flex flex-col">
          <div className="w-full">
            <SearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="w-full mt-2">
            {searchText ? (
              <>
                <div className="flex flex-col gap-2">
                  {isLoading ? (
                    <Skeleton className="py-5 rounded-lg" />
                  ) : (
                    <>
                      {options &&
                        options.length > 0 &&
                        options
                          .filter(
                            (opt) =>
                              selectedCategories.some(
                                (cat) => cat.type === opt.type
                              ) || selectedCategories?.length === 0
                          )
                          .map((opt) => (
                            <SearchOption
                              key={opt.id}
                              id={opt.id}
                              title={opt.name}
                              type={opt.type}
                              onClose={() => {
                                setSearchText("");
                                setSelectedCategories([]);
                                toggle();
                              }}
                            />
                          ))}
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
