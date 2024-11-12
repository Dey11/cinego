"use client";

import { Filter, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const searchTMDB = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          searchQuery,
        )}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      );
      const data = await response.json();

      setResults(
        data.results
          .filter(
            (item: SearchResult) =>
              (item.media_type === "movie" || item.media_type === "tv") &&
              item.poster_path,
          )
          .slice(0, 5),
      );
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const debouncedSearch = useCallback(debounce(searchTMDB, 300), []);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults]);

  const handleInputFocus = useCallback(() => {
    setShowResults(true);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleItemClick = (item: SearchResult) => {
    const path = item.media_type === "movie" ? "/movie" : "/tv";
    router.push(`${path}/${item.id}`);
    setShowResults(false);
    setQuery("");
  };

  const handleSeeMore = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowResults(false);
    setQuery("");
  };

  const getYear = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.getFullYear().toString();
  };

  return (
    <div className="relative hidden lg:block" ref={searchRef}>
      <Input
        className="h-8 w-48 rounded-3xl border-0 bg-slate-800/80 pl-[85px] font-semibold capitalize !text-white placeholder:text-center placeholder:text-gray-500 focus:placeholder:opacity-0 sm:h-10 sm:w-64 md:w-72 lg:w-96"
        placeholder="Search"
        value={query}
        onChange={handleQueryChange}
        onFocus={handleInputFocus}
        onClick={handleInputFocus} // Add onClick handler
      />

      <button className="absolute left-2 top-[6px] flex items-center gap-x-2 rounded-xl bg-black px-2 py-1">
        <Filter className="h-3 w-3 text-gray-500" />
        <span className="text-sm text-gray-500">Filter</span>
      </button>

      <SearchIcon className="absolute right-2 top-2 h-6 w-6 text-gray-500" />

      {showResults && results.length > 0 && (
        <div className="absolute mt-2 w-full rounded-lg bg-slate-800/90 p-2">
          {results.map((item) => (
            <div
              key={item.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 hover:bg-slate-700"
              onClick={() => handleItemClick(item)}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                alt={item.title || item.name || ""}
                width={40}
                height={40}
                className="rounded object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm text-white">
                  {item.title || item.name}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="capitalize">{item.media_type}</span>
                  <span>•</span>
                  <span>
                    {getYear(item.release_date || item.first_air_date)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    ⭐ {item.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={handleSeeMore}
            className="mt-2 w-full rounded-lg bg-slate-700 p-2 text-center text-sm text-white hover:bg-slate-600"
          >
            See more results
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
