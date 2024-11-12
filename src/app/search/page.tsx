"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon, Star } from "lucide-react";
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

const SearchResultCard = ({ item }: { item: SearchResult }) => {
  const router = useRouter();
  const type = item.media_type === "movie" ? "Movie" : "TV";
  const date = (item.release_date || item.first_air_date || "").split("-")[0];

  const handleItemClick = () => {
    const path = item.media_type === "movie" ? "/movie" : "/tv";
    router.push(`${path}/${item.id}`);
  };

  return (
    <div onClick={handleItemClick} className="relative hover:text-white">
      <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
        <Image
          className="object-cover transition-transform hover:scale-110"
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/original${item.poster_path}`
              : "/placeholder.png"
          }
          alt={item.title || item.name || ""}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-sm bg-gray-900 bg-opacity-60 opacity-0 transition-opacity hover:opacity-100 hover:backdrop-blur-[2px]">
          <Image src={"/icon-play.png"} alt="play" width={25} height={25} />
          <div className="absolute bottom-2 px-1 text-center text-sm font-semibold leading-snug">
            <h3 className="mb-2 line-clamp-2 text-xs font-semibold">
              {item.title || item.name}
            </h3>
            <p className="-mt-2 text-[10px] text-gray-400">
              {type} / {date}
            </p>
          </div>
        </div>
        <div className="absolute top-2 rounded-r bg-yellow-500 px-0.5 text-xs font-semibold text-white">
          HD
        </div>
        <div className="absolute right-0 top-2 flex gap-1 rounded-l bg-black bg-opacity-50 pl-1 text-xs font-semibold text-white">
          <Star
            size={16}
            strokeWidth={0.5}
            className="border-0 fill-yellow-500"
          />
          {item.vote_average.toPrecision(2)}
        </div>
      </div>
    </div>
  );
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const searchTMDB = async (searchQuery: string) => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          searchQuery,
        )}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      );
      const data = await response.json();
      setSearchResults(
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

  const debouncedSearch = debounce(searchTMDB, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
            query,
          )}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        );
        const data = await response.json();
        setResults(
          data.results.filter(
            (item: SearchResult) =>
              (item.media_type === "movie" || item.media_type === "tv") &&
              item.poster_path,
          ),
        );
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20 lg:pt-24">
        {" "}
        {/* Adjusted padding top */}
        <div className="sticky top-[72px] z-10 block bg-black p-4 lg:hidden">
          <div className="relative">
            <Input
              className="h-10 rounded-3xl border-0 bg-slate-800/80 pl-4 pr-10 font-semibold !text-white placeholder:text-gray-500"
              placeholder="Search movies & TV shows"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />

            {/* Mobile Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute mt-2 w-full rounded-lg bg-slate-800/90 p-2">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 hover:bg-slate-700"
                    onClick={() => {
                      const path =
                        item.media_type === "movie" ? "/movie" : "/tv";
                      router.push(`${path}/${item.id}`);
                    }}
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
                      <span className="text-xs text-gray-400">
                        {item.media_type}
                      </span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSearch}
                  className="mt-2 w-full rounded-lg bg-slate-700 p-2 text-center text-sm text-white hover:bg-slate-600"
                >
                  See all results
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="container mx-auto p-4">
          {query && (
            <h1 className="mb-6 text-2xl text-white">
              Search results for: {query}
            </h1>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((item) => (
              <SearchResultCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
