"use client";

import { useSearch } from "@/hooks/useSearch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import SearchInput from "./search-input";
import { SearchOption } from "./search-option";
import { Skeleton } from "@/components/ui/skeleton";

interface iSearchOptions {
  name: string;
  type: string;
}

export function SearchModal() {
  const { toggle, isOpen } = useSearch();
  const { searchText, setSearchText, isLoading, options } =
    useLiveQuery<iSearchOptions>("/query");
  const onOptionClick = (data: any) => {};

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="rounded-xl">
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
                            title={opt.name}
                            type={opt.type}
                            // icon={utils.getIconByType(opt.type)}
                            onClick={() =>
                              onOptionClick({
                                title: opt.name,
                                type: opt.type,
                              })
                            }
                          />
                        ))}
                      <SearchOption
                        title={`"${searchText}"`}
                        type={`Search on jobs`}
                        onClick={() =>
                          onOptionClick({ type: "search", title: searchText })
                        }
                      />
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
