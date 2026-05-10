import { useEffect, useState } from "react";
import useAsyncCall from "../../hooks/useAsyncCall";

export type SearchState<T> = {
  results: T[] | undefined;
  isSearching: boolean;
  isActive: boolean;
  error: Error | undefined;
};

type Props<T> = {
  searchFn: (query: string) => Promise<T[]>;
  onChange: (state: SearchState<T>) => void;
  placeholder?: string;
};

const SearchBar = <T,>({ searchFn, onChange, placeholder }: Props<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data, execute, isLoading, error } = useAsyncCall<T[]>();

  const isActive = submittedQuery.length > 0;
  const showClear = inputValue.length > 0 || isActive;

  useEffect(() => {
    onChange({ results: data, isSearching: isLoading, isActive, error });
  }, [data, isLoading, isActive, error]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    setSubmittedQuery(q);
    execute(() => searchFn(q));
  };

  const handleClear = () => {
    setInputValue("");
    setSubmittedQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-1 w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder ?? "Try search for ..."}
          className="w-full py-1.5 pl-12 pr-10 bg-black/80 border border-white/10 rounded-full text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300"
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-black/60 py-1 px-2.5 rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out border border-white/10"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

export default SearchBar;
