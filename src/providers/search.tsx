"use client";

import React, { createContext, useState } from "react";

type SearchStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

export const SearchContext = createContext<SearchStore>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  toggle: () => {},
});

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <SearchContext.Provider value={{ isOpen, onOpen, onClose, toggle }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchProvider };
