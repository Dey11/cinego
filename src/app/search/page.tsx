"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  SearchIcon,
  Star,
  Filter,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";

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

interface FilterState {
  type: "all" | "movie" | "tv" | "anime";
  genre: string;
  year: string;
  rating: string;
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

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    genre: "all",
    year: "all",
    rating: "all",
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 20;

  const typeOptions = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
    { label: "Anime", value: "anime" },
  ];

  const filterOptions = {
    genres: [
      { label: "All Genres", value: "all" },
      { label: "Action", value: "28" },
      { label: "Comedy", value: "35" },
      { label: "Drama", value: "18" },
      { label: "Horror", value: "27" },
    ],
    years: [
      { label: "All Years", value: "all" },
      { label: "2024", value: "2024" },
      { label: "2023", value: "2023" },
      { label: "2022", value: "2022" },
      { label: "2021", value: "2021" },
    ],
    ratings: [
      { label: "All Ratings", value: "all" },
      { label: "9+ Rating", value: "9" },
      { label: "8+ Rating", value: "8" },
      { label: "7+ Rating", value: "7" },
      { label: "6+ Rating", value: "6" },
    ],
  };

  const filteredResults = results.filter((item) => {
    if (filters.type !== "all" && item.media_type !== filters.type)
      return false;
    if (filters.year !== "all") {
      const itemYear = new Date(item.release_date || item.first_air_date || "")
        .getFullYear()
        .toString();
      if (itemYear !== filters.year) return false;
    }
    if (filters.rating !== "all") {
      if (item.vote_average < Number(filters.rating)) return false;
    }
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowDropdown(false); // Add this line to hide the dropdown
  };

  const searchTMDB = async (searchQuery: string) => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchQuery,
          )}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        ),
        fetch(
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            searchQuery,
          )}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        ),
      ]);

      const movieData = await movieResponse.json();
      const tvData = await tvResponse.json();

      // Filter results with posters first, then combine
      const moviesWithPosters = movieData.results.filter(
        (item: any) => item.poster_path,
      );
      const tvWithPosters = tvData.results.filter(
        (item: any) => item.poster_path,
      );

      const combinedResults = [
        ...moviesWithPosters.map((item: any) => ({
          ...item,
          media_type: "movie",
        })),
        ...tvWithPosters.map((item: any) => ({ ...item, media_type: "tv" })),
      ].slice(0, 5);

      setSearchResults(combinedResults);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const debouncedSearch = debounce(searchTMDB, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const fetchTrendingContent = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      );
      const data = await response.json();
      return data.results.filter(
        (item: SearchResult) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path,
      );
    } catch (error) {
      console.error("Error fetching trending content:", error);
      return [];
    }
  };

  const fetchResults = async () => {
    try {
      if (query) {
        const [movieResponse, tvResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              query,
            )}&page=${currentPage}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
              query,
            )}&page=${currentPage}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          ),
        ]);

        const movieData = await movieResponse.json();
        const tvData = await tvResponse.json();

        // Filter results with posters first
        const moviesWithPosters = movieData.results.filter(
          (item: any) => item.poster_path,
        );
        const tvWithPosters = tvData.results.filter(
          (item: any) => item.poster_path,
        );

        // Calculate total results only for items with posters
        const totalMoviesWithPosters = movieData.results.filter(
          (item: any) => item.poster_path,
        ).length;
        const totalTVWithPosters = tvData.results.filter(
          (item: any) => item.poster_path,
        ).length;

        // Combine filtered results
        const combinedResults = [
          ...moviesWithPosters.map((item: any) => ({
            ...item,
            media_type: "movie",
          })),
          ...tvWithPosters.map((item: any) => ({ ...item, media_type: "tv" })),
        ];

        setResults(combinedResults);
        setTotalResults(totalMoviesWithPosters + totalTVWithPosters);
      } else {
        const trendingResults = await fetchTrendingContent();
        const filteredTrending = trendingResults.filter(
          (item: SearchResult) => item.poster_path,
        );
        setResults(filteredTrending);
        setTotalResults(filteredTrending.length);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, currentPage]); // Add currentPage dependency

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto min-h-screen max-w-[1440px] bg-black">
      <div className="pt-20 lg:pt-24">
        {" "}
        {/* Adjusted padding top */}
        <div className="top-[72px] z-10 bg-black p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {/* Type Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-x-2 rounded-xl bg-[#333333] px-3 py-2"
              >
                <ChevronDown className="size-4 text-white" />
                <span className="text-sm text-white">
                  {typeOptions.find((opt) => opt.value === filters.type)?.label}
                </span>
              </button>

              {showTypeDropdown && (
                <div className="absolute z-50 mt-2 w-48 rounded-lg bg-slate-800 p-2">
                  {typeOptions.map((option) => (
                    <>
                      <div
                        key={option.value}
                        className={cn(
                          "cursor-pointer rounded-lg p-2 text-white hover:bg-slate-700",
                          // option.value === filters.type && "bg-slate-700",
                        )}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            type: option.value as FilterState["type"],
                          }));
                          setShowTypeDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          {option.label}
                          {option.value === filters.type && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Options */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-x-2 rounded-xl bg-[#333333] bg-slate-800 px-3 py-2"
              >
                <Filter className="h-4 w-4 text-white" />
                <span className="text-sm text-white">Filters</span>
              </button>

              {showFilters && (
                <div className="absolute z-50 mt-2 w-64 rounded-lg bg-slate-800 p-3">
                  {/* Genre Filter */}
                  <div className="mb-3">
                    <label className="mb-1 block text-sm text-gray-400">
                      Genre
                    </label>
                    <select
                      className="w-full rounded-lg bg-slate-700 p-2 text-sm text-white"
                      value={filters.genre}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          genre: e.target.value,
                        }))
                      }
                    >
                      {filterOptions.genres.map((genre) => (
                        <option key={genre.value} value={genre.value}>
                          {genre.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="mb-3">
                    <label className="mb-1 block text-sm text-gray-400">
                      Year
                    </label>
                    <select
                      className="w-full rounded-lg bg-slate-700 p-2 text-sm text-white"
                      value={filters.year}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          year: e.target.value,
                        }))
                      }
                    >
                      {filterOptions.years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-3">
                    <label className="mb-1 block text-sm text-gray-400">
                      Rating
                    </label>
                    <select
                      className="w-full rounded-lg bg-slate-700 p-2 text-sm text-white"
                      value={filters.rating}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          rating: e.target.value,
                        }))
                      }
                    >
                      {filterOptions.ratings.map((rating) => (
                        <option key={rating.value} value={rating.value}>
                          {rating.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="relative block lg:hidden">
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
              <div className="absolute z-50 mt-2 w-full rounded-lg bg-slate-800/90 p-2">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 hover:bg-slate-700"
                    onClick={() => {
                      const path =
                        item.media_type === "movie" ? "/movie" : "/tv";
                      router.push(`${path}/${item.id}`);
                      setShowDropdown(false);
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl text-white">
                {query ? `Search results for: ${query}` : "Trending This Week"}
              </h1>
              {query && (
                <span className="text-gray-400">
                  ({totalResults.toLocaleString()} results)
                </span>
              )}
            </div>
            {totalResults > resultsPerPage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg bg-slate-800 p-2 text-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-white">
                  Page {currentPage} of{" "}
                  {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={
                    currentPage >= Math.ceil(totalResults / resultsPerPage)
                  }
                  className="rounded-lg bg-slate-800 p-2 text-white disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredResults.map((item) => (
              <SearchResultCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
