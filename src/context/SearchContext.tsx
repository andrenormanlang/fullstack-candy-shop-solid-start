import { createContext, createSignal, useContext, JSX } from "solid-js";

const SearchContext = createContext();

export function SearchProvider(props: { children: JSX.Element }) {
  const [searchQuery, setSearchQuery] = createSignal("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {props.children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
