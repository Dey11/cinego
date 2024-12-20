import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type MediaType = "all" | "movie" | "tv" | "anime";
export type SortOption =
  | "popularity"
  | "latest"
  | "oldest"
  | "a-z"
  | "z-a"
  | "rating";
export type RatingOption = "all" | "4" | "5" | "6" | "7" | "8" | "9";

export interface Result {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: "movie" | "tv";
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialQuery = searchParams.get("q") || "";

  const [resultsMap, setResultsMap] = useState<Map<number, Result>>(new Map());
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [genres, setGenres] = useState([]);
  const [watchProviders, setWatchProviders] = useState<WatchProvider[]>([]);

  const currentType = (searchParams.get("type") as MediaType) || "all";
  const currentGenre = searchParams.get("genre") || "all";
  const currentSort = (searchParams.get("sort") as SortOption) || "popularity";
  const currentYear = searchParams.get("year") || "all";
  const currentWatchProvider = searchParams.get("watch_provider") || "all";
  const currentCountry = searchParams.get("country") || "US";
  const currentRating = (searchParams.get("rating") as RatingOption) || "all";
  const watchRegion = currentCountry === "all" ? "US" : currentCountry;

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

        const movieGenresList = movieGenres?.genres || [];
        const tvGenresList = tvGenres?.genres || [];
        const mergedGenres = [...movieGenresList, ...tvGenresList];
        const uniqueGenres = Array.from(
          new Map(mergedGenres.map((item) => [item.id, item])).values(),
        );
        // @ts-ignore
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
      setGenres([]);
    }
  };

  const fetchWatchProviders = async () => {
    try {
      const [movieProviders, tvProviders] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region=${watchRegion}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        ).then((res) => res.json()),
        fetch(
          `https://api.themoviedb.org/3/watch/providers/tv?language=en-US&watch_region=${watchRegion}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        ).then((res) => res.json()),
      ]);

      const allProviders = [...movieProviders.results, ...tvProviders.results];
      const uniqueProviders = Array.from(
        new Map(allProviders.map((item) => [item.provider_id, item])).values(),
      );
      
      setWatchProviders(uniqueProviders);

      // If current watch provider is not available in the new region, reset it
      if (
        currentWatchProvider !== "all" &&
        !uniqueProviders.some(
          (provider) => provider.provider_id.toString() === currentWatchProvider,
        )
      ) {
        updateSearchParams({ watch_provider: "all" });
      }
    } catch (error) {
      console.error("Error fetching watch providers:", error);
      setWatchProviders([]);
    }
  };

  const fetchResults = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const baseUrl = "https://api.themoviedb.org/3";
    const ratingQuery =
      currentRating !== "all" ? `&vote_average.gte=${currentRating}` : "";

    try {
      if (searchQuery) {
        // Search endpoint logic
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
        // Discover/Top Rated endpoint logic
        if (currentType === "all") {
          // Special handling for top rated
          if (currentSort === "rating") {
            const [movieRes, tvRes] = await Promise.all([
              fetch(
                `${baseUrl}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&primary_release_year=${currentYear}` : ""}${currentWatchProvider !== "all" ? `&with_watch_providers=${currentWatchProvider}&watch_region=${watchRegion}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
              ),
              fetch(
                `${baseUrl}/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&first_air_date_year=${currentYear}` : ""}${currentWatchProvider !== "all" ? `&with_watch_providers=${currentWatchProvider}&watch_region=${watchRegion}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
              ),
            ]);

            const [movieData, tvData] = await Promise.all([
              movieRes.json(),
              tvRes.json(),
            ]);

            setResultsMap((prevMap) => {
              const newMap = reset ? new Map() : new Map(prevMap);

              movieData.results.forEach((item: Result) => {
                if (item.poster_path) {
                  newMap.set(item.id, { ...item, media_type: "movie" });
                }
              });

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
            // Discover endpoint logic
            const [movieRes, tvRes] = await Promise.all([
              fetch(
                `${baseUrl}/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&sort_by=${getSortQuery(currentSort)}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&primary_release_year=${currentYear}` : ""}${currentWatchProvider !== "all" ? `&with_watch_providers=${currentWatchProvider}&watch_region=${watchRegion}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
              ),
              fetch(
                `${baseUrl}/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&sort_by=${getSortQuery(currentSort)}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&first_air_date_year=${currentYear}` : ""}${currentWatchProvider !== "all" ? `&with_watch_providers=${currentWatchProvider}&watch_region=${watchRegion}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
              ),
            ]);

            const [movieData, tvData] = await Promise.all([
              movieRes.json(),
              tvRes.json(),
            ]);

            setResultsMap((prevMap) => {
              const newMap = reset ? new Map() : new Map(prevMap);

              movieData.results.forEach((item: Result) => {
                if (item.poster_path) {
                  newMap.set(item.id, { ...item, media_type: "movie" });
                }
              });

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
          }
        } else {
          // Single type logic (movie or tv)
          const endpoint =
            currentSort === "rating"
              ? `/${currentType}/top_rated`
              : `/discover/${currentType}`;

          const response = await fetch(
            `${baseUrl}${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}${currentSort !== "rating" ? `&sort_by=${getSortQuery(currentSort)}` : ""}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&${currentType === "movie" ? "primary_release_year" : "first_air_date_year"}=${currentYear}` : ""}${currentWatchProvider !== "all" ? `&with_watch_providers=${currentWatchProvider}&watch_region=${watchRegion}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
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

  const updateSearchParams = (params: { [key: string]: string }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("q", value);
      router.push(`${pathname}?${params.toString()}`);
    }, 300),
    [searchParams, pathname, router]
  );

  const handleSearch = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleReset = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
    setPage(1);
    setResultsMap(new Map());
    router.push(pathname);
  }, [pathname, router]);

  const loadMore = useCallback(() => {
    if (!loading) {
      setPage((prev) => prev + 1);
      fetchResults(false);
    }
  }, [loading, fetchResults]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    setInputValue(query);
  }, [searchParams]);

  useEffect(() => {
    fetchResults(true);
  }, [
    searchQuery,
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentWatchProvider,
    currentCountry,
    currentRating,
  ]);

  useEffect(() => {
    fetchGenres();
    fetchWatchProviders();
  }, [currentType, currentCountry]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    resultsMap,
    loading,
    searchQuery,
    inputValue,
    genres,
    watchProviders,
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentCountry,
    currentRating,
    currentWatchProvider,
    setInputValue,
    handleSearch,
    handleReset,
    updateSearchParams,
    loadMore,
  };
}
