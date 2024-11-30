"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import Image from "next/image";
import { useSearch } from "@/components/header/search";
import Link from "next/link";

export default function HomeSearchBar() {
  const searchHook = useSearch();
  const {
    query,
    results,
    showResults,
    handleQueryChange,
    handleItemClick,
    handleSeeMore,
    getYear,
  } = searchHook;

  return (
    <div className="relative mx-auto mt-8 w-full max-w-3xl">
      <div className="relative text-black dark:text-gray-200">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg border-gray-700 bg-gray-800/50 py-3 pl-20 pr-4 capitalize placeholder:text-gray-600 dark:placeholder:text-gray-600"
          value={query}
          onChange={handleQueryChange}
        />
        {!query && (
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        )}
        <Link href="/search">
          <div className="absolute left-1 top-1/2 flex size-10 w-16 -translate-y-1/2 items-center justify-center gap-x-1 rounded-lg">
            <Filter className="size-3" />
            <span className="text-xs">Filters</span>
          </div>
        </Link>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results && results.length > 0 && (
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
                  {parseInt(item.vote_average.toFixed(1)) > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        ⭐ {item.vote_average.toFixed(1)}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>
                    {getYear(item.release_date || item.first_air_date)}
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
}
