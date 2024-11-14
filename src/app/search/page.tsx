"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
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
                className="relative flex cursor-pointer select-none items-center rounded-md px-8 py-2 text-sm leading-none text-white hover:bg-slate-700"
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
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: string;
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
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  const typeOptions = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
    { label: "Anime", value: "anime" },
  ];

  const filterOptions = {
    genres: [
      { label: "Genres", value: "all" },
      { label: "Action", value: "28" },
      { label: "Comedy", value: "35" },
      { label: "Drama", value: "18" },
      { label: "Horror", value: "27" },
    ],
    countries: [
      { label: "Countries", value: "all" },
      { label: "United States", value: "US" },
      { label: "United Kingdom", value: "GB" },
      { label: "Afghanistan", value: "AF" },
      { label: "Albania", value: "AL" },
      { label: "Algeria", value: "DZ" },
      { label: "Argentina", value: "AR" },
      { label: "Australia", value: "AU" },
      { label: "Austria", value: "AT" },
      { label: "Belgium", value: "BE" },
      { label: "Brazil", value: "BR" },
      { label: "Canada", value: "CA" },
      { label: "China", value: "CN" },
      { label: "Denmark", value: "DK" },
      { label: "Egypt", value: "EG" },
      { label: "France", value: "FR" },
      { label: "Germany", value: "DE" },
      { label: "Greece", value: "GR" },
      { label: "Hong Kong", value: "HK" },
      { label: "India", value: "IN" },
      { label: "Indonesia", value: "ID" },
      { label: "Iran", value: "IR" },
      { label: "Ireland", value: "IE" },
      { label: "Israel", value: "IL" },
      { label: "Italy", value: "IT" },
      { label: "Japan", value: "JP" },
      { label: "Korea, South", value: "KR" },
      { label: "Malaysia", value: "MY" },
      { label: "Mexico", value: "MX" },
      { label: "Netherlands", value: "NL" },
      { label: "New Zealand", value: "NZ" },
      { label: "Norway", value: "NO" },
      { label: "Pakistan", value: "PK" },
      { label: "Philippines", value: "PH" },
      { label: "Poland", value: "PL" },
      { label: "Portugal", value: "PT" },
      { label: "Russia", value: "RU" },
      { label: "Saudi Arabia", value: "SA" },
      { label: "Singapore", value: "SG" },
      { label: "South Africa", value: "ZA" },
      { label: "Spain", value: "ES" },
      { label: "Sweden", value: "SE" },
      { label: "Switzerland", value: "CH" },
      { label: "Taiwan", value: "TW" },
      { label: "Thailand", value: "TH" },
      { label: "Turkey", value: "TR" },
      { label: "Ukraine", value: "UA" },
      { label: "Vietnam", value: "VN" },
    ],
    years: [
      { label: "Year", value: "all" },
      ...[...Array(50)].map((_, i) => ({
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
      { label: "Popularity", value: "popularity" },
      { label: "Release Date", value: "release_date" },
      { label: "Rating", value: "vote_average" },
      { label: "Title", value: "title" },
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
        // Note: You'll need to add genre_ids to your SearchResult interface
        const genreIds = (item as any).genre_ids || [];
        if (!genreIds.includes(Number(filters.genre))) return false;
      }

      // Country filter
      if (filters.country !== "all") {
        // Note: You'll need to add origin_country to your SearchResult interface
        const originCountry = (item as any).origin_country || [];
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
      // Sort functionality
      switch (filters.sortBy) {
        case "title":
          return (a.title || a.name || "").localeCompare(
            b.title || b.name || "",
          );
        case "release_date":
          return (
            new Date(b.release_date || b.first_air_date || "").getTime() -
            new Date(a.release_date || a.first_air_date || "").getTime()
          );
        case "vote_average":
          return b.vote_average - a.vote_average;
        case "popularity":
        default:
          return (b as any).popularity - (a as any).popularity;
      }
    });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const fetchTrendingContent = async (page: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      );
      const data = await response.json();
      return {
        results: data.results.filter(
          (item: SearchResult) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.poster_path,
        ),
        totalResults: data.total_results,
      };
    } catch (error) {
      console.error("Error fetching trending content:", error);
      return { results: [], totalResults: 0 };
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) {
        // Only fetch trending if search is empty
        setLoading(true);
        const { results: trendingResults, totalResults: trendingTotal } =
          await fetchTrendingContent(currentPage);
        const filteredTrending = trendingResults.filter(
          (item: SearchResult) => item.poster_path,
        );
        setResults(filteredTrending);
        setTotalResults(trendingTotal);
        setLoading(false);
        return;
      }

      try {
        const [movieResponse, tvResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              searchQuery,
            )}&page=${currentPage}&api_key=${
              process.env.NEXT_PUBLIC_TMDB_API_KEY
            }&append_to_response=release_dates`,
          ),
          fetch(
            `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
              searchQuery,
            )}&page=${currentPage}&api_key=${
              process.env.NEXT_PUBLIC_TMDB_API_KEY
            }&append_to_response=content_ratings`,
          ),
        ]);

        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json(),
        ]);

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
          ...tvWithPosters.map((item: any) => ({
            ...item,
            media_type: "tv",
          })),
        ];

        setResults(combinedResults);
        setTotalResults(moviesWithPosters.length + tvWithPosters.length);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchResults();
  }, [searchQuery, currentPage]);

  return (
    <>
      <div className="mx-auto min-h-screen max-w-[1440px]">
        <div className="pt-20 lg:pt-24">
          <div className="top-[72px] z-10 p-4">
            {/* Type filter - always visible */}

            {/* Search input with filter button */}
            <div className="relative mb-4 flex items-center gap-2">
              <div className="">
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
                    : "Trending This Week"}
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
                  <span className="dark:text-white">
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
