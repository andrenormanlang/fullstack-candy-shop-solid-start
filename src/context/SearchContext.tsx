import { createContext, createSignal, useContext, JSX, Accessor, Setter } from "solid-js";

interface SearchContextType {
  searchQuery: Accessor<string>;
  setSearchQuery: Setter<string>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider(props: { children: JSX.Element }) {
  const [searchQuery, setSearchQuery] = createSignal("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {props.children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
