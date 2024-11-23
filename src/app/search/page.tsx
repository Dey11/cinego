"use client";

import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { country } from "@/lib/constants"; // Add this import
import { ResetIcon } from "@radix-ui/react-icons";

type MediaType = "all" | "movie" | "tv"; // updated type
type SortOption = "popularity" | "latest" | "oldest" | "a-z" | "z-a" | "rating";
type RatingOption = "all" | "4" | "5" | "6" | "7" | "8" | "9"; // Add this type

interface Result {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: "movie" | "tv";
}

interface Network {
  id: number;
  name: string;
  logo_path: string;
}

export default function SearchPage() {
  const [resultsMap, setResultsMap] = useState<Map<number, Result>>(new Map());
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Add new state for input
  const [networks, setNetworks] = useState<Network[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { ref, inView } = useInView();

  const currentType = (searchParams.get("type") as MediaType) || "all"; // changed default to "all"
  const currentGenre = searchParams.get("genre") || "all";
  const currentSort = (searchParams.get("sort") as SortOption) || "popularity";
  const currentYear = searchParams.get("year") || "all";
  const currentNetwork = searchParams.get("network") || "all";
  const currentCountry = searchParams.get("country") || "all";
  const currentRating = (searchParams.get("rating") as RatingOption) || "all"; // Add this line

  const updateSearchParams = (params: { [key: string]: string }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      current.set(key, value);
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  const fetchGenres = async () => {
    try {
      if (currentType === "all") {
        const [movieGenres, tvGenres] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          ).then((res) => res.json()),
        ]);

        // Add null checks and default to empty arrays if genres are undefined
        const movieGenresList = movieGenres?.genres || [];
        const tvGenresList = tvGenres?.genres || [];

        // Merge genres and remove duplicates
        const mergedGenres = [...movieGenresList, ...tvGenresList];
        const uniqueGenres = Array.from(
          new Map(mergedGenres.map((item) => [item.id, item])).values(),
        );
        //@ts-ignore
        setGenres(uniqueGenres);
      } else {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/${currentType}/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        );
        const data = await response.json();
        setGenres(data?.genres || []);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
      setGenres([]); // Set empty array on error
    }
  };

  const getSortQuery = (sort: SortOption) => {
    switch (sort) {
      case "popularity":
        return "popularity.desc";
      case "latest":
        return "primary_release_date.desc";
      case "oldest":
        return "primary_release_date.asc";
      case "a-z":
        return "original_title.asc";
      case "z-a":
        return "original_title.desc";
      case "rating":
        return "vote_average.desc";
      default:
        return "popularity.desc";
    }
  };

  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year);
    }
    return years;
  };

  const fetchNetworks = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/network/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      );
      const data = await response.json();
      setNetworks(data.networks || []);
    } catch (error) {
      console.error("Error fetching networks:", error);
      setNetworks([]);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchResults = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const baseUrl = "https://api.themoviedb.org/3";
    const ratingQuery =
      currentRating !== "all" ? `&vote_average.gte=${currentRating}` : "";

    try {
      if (searchQuery) {
        // Use search endpoint when there's a query
        if (currentType === "all") {
          const response = await fetch(
            `${baseUrl}/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}&page=${currentPage}`,
          );
          const data = await response.json();

          setResultsMap((prevMap) => {
            const newMap = reset ? new Map() : new Map(prevMap);
            data.results.forEach((item: any) => {
              if (
                (item.media_type === "movie" || item.media_type === "tv") &&
                item.poster_path
              ) {
                newMap.set(item.id + (item.media_type === "tv" ? "_tv" : ""), {
                  ...item,
                  id: item.id + (item.media_type === "tv" ? "_tv" : ""),
                });
              }
            });
            return newMap;
          });
        } else {
          const response = await fetch(
            `${baseUrl}/search/${currentType}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}&page=${currentPage}`,
          );
          const data = await response.json();

          setResultsMap((prevMap) => {
            const newMap = reset ? new Map() : new Map(prevMap);
            data.results.forEach((item: any) => {
              if (item.poster_path) {
                newMap.set(item.id, { ...item, media_type: currentType });
              }
            });
            return newMap;
          });
        }
      } else {
        // Use discover endpoint when no search query
        if (currentType === "all") {
          // Keep existing all type logic but add media_type
          const [movieRes, tvRes] = await Promise.all([
            fetch(
              `${baseUrl}/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&sort_by=${getSortQuery(currentSort)}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&primary_release_year=${currentYear}` : ""}${currentNetwork !== "all" ? `&with_networks=${currentNetwork}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
            ),
            fetch(
              `${baseUrl}/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&sort_by=${getSortQuery(currentSort)}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&first_air_date_year=${currentYear}` : ""}${currentNetwork !== "all" ? `&with_networks=${currentNetwork}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
            ),
          ]);

          const [movieData, tvData] = await Promise.all([
            movieRes.json(),
            tvRes.json(),
          ]);

          setResultsMap((prevMap) => {
            const newMap = reset ? new Map() : new Map(prevMap);

            // Add movies first
            movieData.results.forEach((item: Result) => {
              if (item.poster_path) {
                newMap.set(item.id, { ...item, media_type: "movie" });
              }
            });

            // Add TV shows after
            tvData.results.forEach((item: Result) => {
              if (item.poster_path) {
                newMap.set(item.id + "_tv", {
                  ...item,
                  media_type: "tv",
                  id: item.id + "_tv",
                });
              }
            });

            return newMap;
          });
        } else {
          // Original single type logic
          const response = await fetch(
            `${baseUrl}/discover/${currentType}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&sort_by=${getSortQuery(currentSort)}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&${currentType === "movie" ? "primary_release_year" : "first_air_date_year"}=${currentYear}` : ""}${currentNetwork !== "all" ? `&with_networks=${currentNetwork}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
          );
          const data = await response.json();

          setResultsMap((prevMap) => {
            const newMap = reset ? new Map() : new Map(prevMap);
            data.results.forEach((item: Result) => {
              if (item.poster_path) {
                newMap.set(item.id, { ...item, media_type: currentType });
              }
            });
            return newMap;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }

    setLoading(false);
  };

  // Move debounced search to useEffect
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 500);

  // Add effect to handle debounced search
  useEffect(() => {
    debouncedSearch(inputValue);
    // Cleanup function to cancel debounced call
    return () => debouncedSearch.cancel();
  }, [inputValue]);

  // Add new useEffect for search
  useEffect(() => {
    if (searchQuery !== undefined) {
      setPage(1);
      fetchResults(true);
    }
  }, [searchQuery]);

  // Remove searchQuery reset from filter change effect
  useEffect(() => {
    fetchResults(true);
  }, [
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentNetwork,
    currentCountry,
    currentRating, // Add this
  ]); // Add currentYear and currentNetwork

  // Optional: Add a cleanup for searchQuery only when component unmounts
  useEffect(() => {
    return () => {
      setSearchQuery("");
    };
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [currentType]);

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
      fetchResults();
    }
  }, [inView]);

  const handleReset = () => {
    setInputValue("");
    setSearchQuery("");
    setPage(1);
    router.push(pathname); // This will clear all URL params
    fetchResults(true);
  };

  return (
    <div className="container mx-auto max-w-[1440px] p-4 pt-20">
      <div className="mb-6 flex flex-col gap-4">
        <Input
          placeholder="Search..."
          className="w-full rounded-lg py-4 capitalize text-black dark:text-white"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap">
          <button
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-x-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 xl:w-fit"
          >
            <ResetIcon />
            Reset
          </button>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-1 xl:flex-wrap">
            <Select
              value={currentType}
              onValueChange={(value: MediaType) =>
                updateSearchParams({ type: value })
              }
            >
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Type</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={currentGenre}
              onValueChange={(value) => updateSearchParams({ genre: value })}
            >
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Genre</SelectItem>
                {genres.map((genre: any) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentSort}
              onValueChange={(value: SortOption) =>
                updateSearchParams({ sort: value })
              }
            >
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="latest">Latest Release</SelectItem>
                <SelectItem value="oldest">Oldest Release</SelectItem>
                <SelectItem value="a-z">Title A-Z</SelectItem>
                <SelectItem value="z-a">Title Z-A</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={currentYear}
              onValueChange={(value) => updateSearchParams({ year: value })}
            >
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Year</SelectItem>
                {getYearsList().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentCountry}
              onValueChange={(value) => updateSearchParams({ country: value })}
            >
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Country</SelectItem>
                {country.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentRating}
              onValueChange={(value: RatingOption) =>
                updateSearchParams({ rating: value })
              }
            >
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Ratings</SelectItem>
                <SelectItem value="4">4+ ⭐</SelectItem>
                <SelectItem value="5">5+ ⭐</SelectItem>
                <SelectItem value="6">6+ ⭐</SelectItem>
                <SelectItem value="7">7+ ⭐</SelectItem>
                <SelectItem value="8">8+ ⭐</SelectItem>
                <SelectItem value="9">9+ ⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from(resultsMap.values()).map((result) => (
          <Link key={result.id} href={`/${result.media_type}/${result.id}`}>
            <div className="relative overflow-hidden rounded-md hover:text-white">
              <div className="relative rounded-sm">
                <img
                  className="object-cover"
                  src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
                  alt={result.title || result.name}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-sm bg-gray-900 bg-opacity-60 opacity-0 transition-opacity hover:opacity-100 hover:backdrop-blur-[2px]">
                  <img src="/icon-play.png" alt="play" width={25} height={25} />
                  <div className="absolute bottom-2 px-1 text-center text-sm font-semibold leading-snug sm:text-base">
                    <h3 className="mb-2 line-clamp-2 text-xs font-semibold">
                      {result.title || result.name}
                    </h3>
                    <p className="-mt-2 text-[10px] text-gray-400">
                      {result.media_type?.toUpperCase()} /{" "}
                      {new Date(
                        result.release_date || result.first_air_date || "",
                      ).getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 rounded-r bg-yellow-500 px-0.5 text-xs font-semibold text-white">
                  HD
                </div>
                <div className="absolute right-0 top-2 flex gap-1 rounded-l bg-black bg-opacity-50 pl-1 text-xs font-semibold text-white">
                  <svg
                    className="h-4 w-4 fill-yellow-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  {result.vote_average.toFixed(1)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && <div className="mt-4 text-center">Loading...</div>}
      <div ref={ref} className="h-10" />
    </div>
  );
}
