"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  SearchIcon,
  Star,
  Filter,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <ChevronDown className="h-4 w-4" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-slate-800 text-white">
          <div className="no-scrollbar max-h-40 overflow-auto p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 text-xs leading-none text-white hover:bg-slate-700"
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="absolute left-2 h-4 w-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface SearchResult {
  id: string; // Changed from number to string to accommodate prefixed IDs
  title?: string;
  name?: string;
  poster_path: string;
  media_type: "movie" | "tv" | "anime";
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  origin_country?: string[];
  popularity?: number;
}

interface FilterState {
  type: "all" | "movie" | "tv" | "anime";
  genre: string;
  country: string;
  year: string;
  rating: string;
  sortBy: string;
}

const SearchResultCard = ({ item }: { item: SearchResult }) => {
  const router = useRouter();
  const type = item.media_type === "movie" ? "Movie" : "TV";
  const date = (item.release_date || item.first_air_date || "").split("-")[0];

  const handleItemClick = () => {
    const baseId = item.id.split("-")[1]; // Extract the original ID
    const path = item.media_type === "movie" ? "/movie" : "/tv";
    router.push(`${path}/${baseId}`);
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

const fetchSearchResults = async (
  query: string,
  page: number,
  apiKey: string,
) => {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query,
        )}&page=${page}&api_key=${apiKey}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
          query,
        )}&page=${page}&api_key=${apiKey}`,
      ),
    ]);

    const [movieData, tvData] = await Promise.all([
      movieResponse.json(),
      tvResponse.json(),
    ]);

    const moviesWithType = movieData.results
      .filter((item: any) => item.poster_path)
      .map((item: any) => ({
        ...item,
        media_type: "movie",
        id: `m-${item.id}`,
      }));

    const tvResults = tvData.results.filter((item: any) => item.poster_path);

    // Split TV shows into regular and anime based on genre_ids
    const animeWithType = tvResults
      .filter((item: any) => item.genre_ids?.includes(16))
      .map((item: any) => ({
        ...item,
        media_type: "anime",
        id: `a-${item.id}`,
      }));

    const regularTvShows = tvResults
      .filter((item: any) => !item.genre_ids?.includes(16))
      .map((item: any) => ({ ...item, media_type: "tv", id: `t-${item.id}` }));

    const combinedResults = [
      ...moviesWithType,
      ...regularTvShows,
      ...animeWithType,
    ];

    return {
      results: combinedResults,
      totalPages: Math.max(movieData.total_pages, tvData.total_pages),
      totalResults: movieData.total_results + tvData.total_results,
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { results: [], totalPages: 0, totalResults: 0 };
  }
};

const fetchDiscoverContent = async (page: number, apiKey: string) => {
  try {
    const [movieResponse, tvResponse, animeResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=popularity.desc&api_key=${apiKey}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/discover/tv?page=${page}&sort_by=popularity.desc&api_key=${apiKey}`,
      ),
      // Assuming anime is handled via a specific genre or category
      fetch(
        `https://api.themoviedb.org/3/discover/tv?page=${page}&with_genres=16&sort_by=popularity.desc&api_key=${apiKey}`,
      ),
    ]);

    const [movieData, tvData, animeData] = await Promise.all([
      movieResponse.json(),
      tvResponse.json(),
      animeResponse.json(),
    ]);

    const moviesWithType = movieData.results
      .filter((item: any) => item.poster_path)
      .map((item: any) => ({
        ...item,
        media_type: "movie",
        id: `m-${item.id}`,
      }));

    const tvWithType = tvData.results
      .filter((item: any) => item.poster_path)
      .map((item: any) => ({ ...item, media_type: "tv", id: `t-${item.id}` }));

    const animeWithType = animeData.results
      .filter((item: any) => item.poster_path)
      .map((item: any) => ({
        ...item,
        media_type: "anime",
        id: `a-${item.id}`,
      }));

    const combinedResults = [
      ...moviesWithType,
      ...tvWithType,
      ...animeWithType,
    ];

    return {
      results: combinedResults,
      totalPages: Math.max(
        movieData.total_pages,
        tvData.total_pages,
        animeData.total_pages,
      ),
      totalResults:
        (movieData.total_results || 0) +
        (tvData.total_results || 0) +
        (animeData.total_results || 0),
    };
  } catch (error) {
    console.error("Error fetching discover content:", error);
    return { results: [], totalPages: 0, totalResults: 0 };
  }
};

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    genre: "all",
    country: "all",
    year: "all",
    rating: "all",
    sortBy: "popularity",
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const resultsPerPage = 20;
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);

  const typeOptions = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
    { label: "Animes", value: "anime" },
  ];

  const filterOptions = {
    genres: [
      { label: "Genres", value: "all" },
      { label: "Action", value: "28" },
      { label: "Comedy", value: "35" },
      { label: "Drama", value: "18" },
      { label: "Horror", value: "27" },
      // Add more genres as needed
    ],
    countries: [
      { label: "Country", value: "all" },
      { label: "United States", value: "US" },
      { label: "United Kingdom", value: "GB" },
      // Add more countries as needed
    ],
    years: [
      { label: "Year", value: "all" },
      ...[...Array(75)].map((_, i) => ({
        label: `${2024 - i}`,
        value: `${2024 - i}`,
      })),
    ],
    ratings: [
      { label: "Ratings", value: "all" },
      { label: "9+ Rating", value: "9" },
      { label: "8+ Rating", value: "8" },
      { label: "7+ Rating", value: "7" },
      { label: "6+ Rating", value: "6" },
    ],
    sortBy: [
      { label: "Most Popular", value: "popularity_desc" },
      { label: "Latest Release", value: "release_date_desc" },
      { label: "Oldest Release", value: "release_date_asc" },
      { label: "Title A-Z", value: "title_asc" },
      { label: "Title Z-A", value: "title_desc" },
      { label: "Lowest Rated", value: "vote_average_asc" },
      { label: "Highest Rated", value: "vote_average_desc" },
    ],
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      genre: "all",
      country: "all",
      year: "all",
      rating: "all",
      sortBy: "popularity",
    });
  };

  const filteredResults = results
    .filter((item) => {
      // Type filter
      if (filters.type !== "all" && item.media_type !== filters.type)
        return false;

      // Genre filter
      if (filters.genre !== "all") {
        const genreIds = item.genre_ids || [];
        if (!genreIds.includes(Number(filters.genre))) return false;
      }

      // Country filter
      if (filters.country !== "all") {
        const originCountry = item.origin_country || [];
        if (!originCountry.includes(filters.country)) return false;
      }

      // Year filter
      if (filters.year !== "all") {
        const itemYear = new Date(
          item.release_date || item.first_air_date || "",
        )
          .getFullYear()
          .toString();
        if (itemYear !== filters.year) return false;
      }

      // Rating filter
      if (filters.rating !== "all") {
        if (item.vote_average < Number(filters.rating)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "title_asc":
          return (a.title || a.name || "").localeCompare(
            b.title || b.name || "",
          );
        case "title_desc":
          return (b.title || b.name || "").localeCompare(
            a.title || a.name || "",
          );
        case "release_date_asc":
          return (
            new Date(a.release_date || a.first_air_date || "0").getTime() -
            new Date(b.release_date || b.first_air_date || "0").getTime()
          );
        case "release_date_desc":
          return (
            new Date(b.release_date || b.first_air_date || "0").getTime() -
            new Date(a.release_date || a.first_air_date || "0").getTime()
          );
        case "vote_average_asc":
          return a.vote_average - b.vote_average;
        case "vote_average_desc":
          return b.vote_average - a.vote_average;
        case "popularity_desc":
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }, 500),
    [router],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const processAndDeduplicateResults = (
    newResults: SearchResult[],
    existingResults: SearchResult[] = [],
  ) => {
    const existingIds = new Set(
      existingResults.map((item) => `${item.media_type}-${item.id}`),
    );
    return newResults.filter(
      (item) => !existingIds.has(`${item.media_type}-${item.id}`),
    );
  };

  const loadMoreResults = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const nextPage = Math.floor(results.length / resultsPerPage) + 1;

    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
      let fetchedData;

      if (!searchQuery) {
        fetchedData = await fetchDiscoverContent(nextPage, apiKey);
      } else {
        fetchedData = await fetchSearchResults(searchQuery, nextPage, apiKey);
      }

      if (fetchedData.results.length === 0) {
        setHasMore(false);
        return;
      }

      const uniqueNewResults = processAndDeduplicateResults(
        fetchedData.results,
        results,
      );

      setResults((prev) => [...prev, ...uniqueNewResults]);
      setHasMore(nextPage < fetchedData.totalPages);
    } catch (error) {
      console.error("Error loading more results:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, searchQuery, results, resultsPerPage]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreResults();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreResults, hasMore]);

  // Fetch results when searchQuery or filters change
  useEffect(() => {
    const fetchInitialResults = async () => {
      setLoading(true);
      setResults([]);
      setHasMore(true);

      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
        const fetchedData = !searchQuery
          ? await fetchDiscoverContent(1, apiKey)
          : await fetchSearchResults(searchQuery, 1, apiKey);

        setResults(fetchedData.results);
        setTotalResults(fetchedData.totalResults);
        setTotalPages(fetchedData.totalPages);
        setHasMore(fetchedData.totalPages > 1);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialResults();
  }, [searchQuery]);

  return (
    <>
      <div className="mx-auto min-h-screen max-w-[1440px]">
        <div className="pt-20 lg:pt-24">
          <div className="top-[72px] z-10 p-4">
            {/* Type filter - always visible */}

            {/* Search input with filter button */}
            <div className="relative mb-4 flex items-center gap-2">
              <div>
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="flex items-center gap-x-2 rounded-xl bg-[#333333] px-3 py-2"
                >
                  <ChevronDown className="size-4 text-white" />
                  <span className="text-sm text-white">
                    {
                      typeOptions.find((opt) => opt.value === filters.type)
                        ?.label
                    }
                  </span>
                </button>
                {showTypeDropdown && (
                  <div className="absolute z-50 mt-2 w-48 rounded-lg bg-slate-800 p-2">
                    {typeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "cursor-pointer rounded-lg p-2 text-white hover:bg-slate-700",
                          option.value === filters.type && "bg-slate-700",
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
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-full bg-[#333333] p-2"
                title="Show filters"
              >
                <Filter className="h-5 w-5 text-white" />
              </button>

              <div className="relative flex-1">
                <Input
                  className="h-10 rounded-3xl border-0 bg-slate-800/80 pl-4 pr-10 font-semibold capitalize !text-white placeholder:text-gray-500"
                  placeholder="Search movies & TV shows"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Filter options row */}
            {showFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  <div className="w-40">
                    <CustomDropdown
                      options={filterOptions.genres}
                      value={filters.genre}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, genre: value }))
                      }
                      placeholder="Genres"
                    />
                  </div>
                  <div className="w-40">
                    <CustomDropdown
                      options={filterOptions.countries}
                      value={filters.country}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, country: value }))
                      }
                      placeholder="Countries"
                    />
                  </div>
                  <div className="w-40">
                    <CustomDropdown
                      options={filterOptions.years}
                      value={filters.year}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, year: value }))
                      }
                      placeholder="Year"
                    />
                  </div>
                  <div className="w-40">
                    <CustomDropdown
                      options={filterOptions.ratings}
                      value={filters.rating}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, rating: value }))
                      }
                      placeholder="Ratings"
                    />
                  </div>
                  <div className="w-40">
                    <CustomDropdown
                      options={filterOptions.sortBy}
                      value={filters.sortBy}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, sortBy: value }))
                      }
                      placeholder="Sort By"
                    />
                  </div>
                  <button
                    onClick={resetFilters}
                    className="h-10 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rest of the content */}
          <div className="container mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl capitalize text-black dark:text-white">
                  {query
                    ? `Search results for: ${query}`
                    : "Discover Movies & TV Shows"}
                </h1>
                {query && (
                  <span className="text-gray-400">
                    ({totalResults.toLocaleString()} results)
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredResults.map((item) => (
                <SearchResultCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                />
              ))}
            </div>

            {/* Infinite scroll observer and loading indicator */}
            <div ref={observerTarget} className="mt-8 flex justify-center">
              {isFetchingMore && (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
