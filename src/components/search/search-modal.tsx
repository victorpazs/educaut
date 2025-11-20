"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import SearchInput from "./search-input";
import { SearchOption } from "./search-option";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SearchModal() {
  const { toggle, isOpen } = useSearch();
  const { searchText, setSearchText, isLoading, options } = useLiveQuery();

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent
        className={cn(
          "rounded-3xl! p-0 transition-all ",
          searchText || isLoading || (options && options.length > 0)
            ? "p-4"
            : ""
        )}
        hideCloseButton={true}
      >
        <div className="w-full flex flex-col">
          <div className="w-full">
            <SearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              onClose={toggle}
            />
          </div>
          {searchText ? (
            <div className="w-full mt-2">
              <>
                <div className="flex flex-col gap-2">
                  {isLoading ? (
                    <Skeleton className="py-5 rounded-lg" />
                  ) : options && options.length > 0 ? (
                    <>
                      {options &&
                        options.length > 0 &&
                        options.map((opt) => (
                          <SearchOption
                            key={opt.id}
                            id={opt.id}
                            title={opt.name}
                            type={opt.type}
                            onClose={() => {
                              setSearchText("");
                              toggle();
                            }}
                          />
                        ))}
                    </>
                  ) : (
                    <div className="flex flex-col justify-center items-center p-3 gap-2">
                      <span className="text-sm text-gray-500">
                        Nenhum resultado encontrado para &quot;{searchText}
                        &quot;
                      </span>
                    </div>
                  )}
                </div>
              </>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
