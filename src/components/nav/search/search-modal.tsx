"use client";

import { useSearch } from "@/hooks/useSearch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import SearchInput from "./search-input";
import { SearchOption } from "./search-option";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveSearchResult } from "@/app/_search/actions";

export function SearchModal() {
  const { toggle, isOpen } = useSearch();
  const { searchText, setSearchText, isLoading, options } = useLiveQuery();
  const onOptionClick = (_data: LiveSearchResult) => {};

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="rounded-xl py-6 px-4">
        <div className="w-full flex flex-col">
          <div className="w-full">
            <SearchInput
              searchText={searchText}
              setSearchText={setSearchText}
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
                        options.map((opt) => (
                          <SearchOption
                            key={opt.id}
                            title={opt.name}
                            type={opt.type}
                            onClick={() => onOptionClick(opt)}
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
