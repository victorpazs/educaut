"use client";

import { SearchContext } from "@/providers/search";
import { useContext } from "react";

export const useSearch = () => {
  return useContext(SearchContext);
};
