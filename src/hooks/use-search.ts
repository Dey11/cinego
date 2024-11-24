import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type MediaType = "all" | "movie" | "tv";
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

  const currentType = (searchParams.get("type") as MediaType) || "all";
  const currentGenre = searchParams.get("genre") || "all";
  const currentSort = (searchParams.get("sort") as SortOption) || "popularity";
  const currentYear = searchParams.get("year") || "all";
  const currentNetwork = searchParams.get("network") || "all";
  const currentCountry = searchParams.get("country") || "all";
  const currentRating = (searchParams.get("rating") as RatingOption) || "all";

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
                `${baseUrl}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&primary_release_year=${currentYear}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
              ),
              fetch(
                `${baseUrl}/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&first_air_date_year=${currentYear}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
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
            `${baseUrl}${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${currentPage}${currentSort !== "rating" ? `&sort_by=${getSortQuery(currentSort)}` : ""}${currentGenre !== "all" ? `&with_genres=${currentGenre}` : ""}${currentYear !== "all" ? `&${currentType === "movie" ? "primary_release_year" : "first_air_date_year"}=${currentYear}` : ""}${currentNetwork !== "all" ? `&with_networks=${currentNetwork}` : ""}${currentCountry !== "all" ? `&with_origin_country=${currentCountry}` : ""}${ratingQuery}`,
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

  // Effect for handling URL search params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setInputValue(query);
    setSearchQuery(query);
  }, [searchParams]);

  // Effect for fetching genres
  useEffect(() => {
    fetchGenres();
  }, [currentType]);

  // Effect for fetching results
  useEffect(() => {
    fetchResults(true);
  }, [
    searchQuery,
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentNetwork,
    currentCountry,
    currentRating,
  ]);

  const handleReset = () => {
    setInputValue("");
    setSearchQuery("");
    setPage(1);
    router.push(pathname);
    fetchResults(true);
  };

  // Effect for infinite scroll
  const loadMore = () => {
    if (!loading) {
      fetchResults(false); // Pass false to append results instead of resetting
    }
  };

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      updateSearchParams({ q: query });
    }, 500),
    [],
  );

  // Update the input handler to use debouncing
  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    resultsMap,
    loading,
    inputValue,
    genres,
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentNetwork,
    currentCountry,
    currentRating,
    setInputValue,
    updateSearchParams,
    setPage,
    handleReset,
    loadMore,
    handleInputChange,
  };
}
