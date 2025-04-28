'use client'
import { FileData } from "@/app/page";
import { createContext, useState, ReactNode, useContext } from "react";

type SearchContextType = {
  searchResult: FileData[];
  setSearchResult: (result: FileData[]) => void;
  searchLoading: boolean;
  setSearchLoading: (value: boolean) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchResult, setSearchResult] = useState<FileData[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  return (
    <SearchContext.Provider
      value={{ searchResult, setSearchResult, searchLoading, setSearchLoading }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
