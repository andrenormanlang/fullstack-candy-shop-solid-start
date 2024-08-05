import { useSearch } from "../context/SearchContext";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <input
      type="text"
      class="w-full sm:w-auto mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      placeholder="Search for candies..."
      value={searchQuery()}
      onInput={(e) => setSearchQuery(e.currentTarget.value)}
    />
  );
}

export default SearchBar;
