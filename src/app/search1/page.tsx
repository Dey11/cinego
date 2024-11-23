"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Suspense,
} from "react";
import debounce from "lodash/debounce";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, Circle, CircleCheck, Star, ChevronDown } from "lucide-react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  original_title?: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  original_language: string;
}

// Move the current SearchPage component content into SearchContent
const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const seenIds = useRef(new Set<number>());

  // Initialize filters from URL params
  const [filters, setFilters] = useState(() => ({
    genre: searchParams.get("genre") || "",
    country: searchParams.get("country") || "",
    year: searchParams.get("year") || "",
    sortBy: searchParams.get("sortBy") || "",
    type: searchParams.get("type") || "",
  }));

  // Replace the old fetchResults with this updated version
  const fetchResults = async (
    searchQuery: string,
    currentFilters: typeof filters,
    pageNum: number,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        ...(searchQuery && { query: searchQuery }),
        ...(currentFilters.type && { type: currentFilters.type }),
        ...(currentFilters.genre && { genre: currentFilters.genre }),
        ...(currentFilters.country && { country: currentFilters.country }),
        ...(currentFilters.year && { year: currentFilters.year }),
      });

      const endpoint = searchQuery ? "/api/search" : "/api/discover";
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      const filteredResults = data.results.filter(
        (item: Movie) => item.poster_path,
      );

      if (pageNum === 1) {
        seenIds.current.clear();
        setResults(filteredResults);
        filteredResults.forEach((item: Movie) => seenIds.current.add(item.id));

        // Update URL only on initial load or filter changes
        const urlParams = new URLSearchParams();
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) urlParams.set(key, value);
        });
        if (searchQuery) urlParams.set("q", searchQuery);
        const urlWithParams = urlParams.toString()
          ? `?${urlParams.toString()}`
          : "";
        router.replace(`/search${urlWithParams}`, { scroll: false });
      } else {
        const newResults = filteredResults.filter((item: Movie) => {
          if (seenIds.current.has(item.id)) return false;
          seenIds.current.add(item.id);
          return true;
        });
        setResults((prev) => [...prev, ...newResults]);
      }

      setHasMore(data.page < data.total_pages && filteredResults.length > 0);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Add initial fetch effect
  useEffect(() => {
    const initialQuery = searchParams.get("q") || "";
    fetchResults(initialQuery, filters, 1);
  }, []); // Run once on mount

  // Update filter change effect
  useEffect(() => {
    if (page === 1) {
      fetchResults(query, filters, 1);
    }
  }, [filters.type, filters.genre, filters.country, filters.year]);

  const observer = useRef<IntersectionObserver>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // Update updateFiltersAndFetch to handle URL updates more carefully
  const updateFiltersAndFetch = async (
    newFilters: typeof filters,
    newQuery?: string,
    resetAll = false,
  ) => {
    setFilters(newFilters);
    setPage(1);
    seenIds.current.clear();

    const params = new URLSearchParams();
    if (!resetAll) {
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    if (newQuery || query) {
      params.set("q", newQuery || query);
    }

    await fetchResults(newQuery || query, newFilters, 1);

    const urlWithParams = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/search${urlWithParams}`, { scroll: false });
  };

  const resetFilters = async () => {
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== "" && value !== "popularity.desc",
    );

    if (!hasActiveFilters) return;

    const defaultFilters = {
      genre: "",
      country: "",
      year: "",
      sortBy: "",
      type: "",
    };

    setActiveFilter(null);
    await updateFiltersAndFetch(defaultFilters, query, true);
  };

  const handleFilterChange = async (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setActiveFilter(null);
    await updateFiltersAndFetch(newFilters);
  };

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      updateFiltersAndFetch(filters, searchQuery);
    }, 800),
    [filters],
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel(); // Cleanup debounce
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (page > 1) {
      fetchResults(query, filters, page);
    }
  }, [page, query, filters]);

  const getSortedResults = () => {
    const sortedResults = [...results];
    switch (filters.sortBy) {
      case "popularity.desc":
        return sortedResults.sort((a, b) => {
          return (b as any).popularity - (a as any).popularity;
        });
      case "release_date.desc":
        return sortedResults.sort(
          (a, b) =>
            new Date(b.release_date || b.first_air_date || "").getTime() -
            new Date(a.release_date || a.first_air_date || "").getTime(),
        );
      case "release_date.asc":
        return sortedResults.sort(
          (a, b) =>
            new Date(a.release_date || a.first_air_date || "").getTime() -
            new Date(b.release_date || b.first_air_date || "").getTime(),
        );
      case "original_title.asc":
        return sortedResults.sort((a, b) =>
          (a.title || a.name || "").localeCompare(b.title || b.name || ""),
        );
      case "original_title.desc":
        return sortedResults.sort((a, b) =>
          (b.title || b.name || "").localeCompare(a.title || a.name || ""),
        );
      case "vote_average.desc":
        return sortedResults.sort((a, b) => b.vote_average - a.vote_average);
      case "vote_average.asc":
        return sortedResults.sort((a, b) => a.vote_average - b.vote_average);
      default:
        return sortedResults;
    }
  };

  const sortOptions = [
    // { value: "popularity.desc", label: "Most Popular" },
    { value: "release_date.desc", label: "Latest Release" },
    { value: "release_date.asc", label: "Oldest Release" },
    { value: "original_title.asc", label: "Title A-Z" },
    { value: "original_title.desc", label: "Title Z-A" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "vote_average.desc", label: "Highest Rated" },
  ];

  const filterOptions = {
    type: [
      { value: "movie", label: "Movies" },
      { value: "tv", label: "TV Shows" },
      { value: "anime", label: "Anime" },
    ],
    year: Array.from({ length: 2024 - 1950 + 1 }, (_, i) => ({
      value: String(2024 - i),
      label: String(2024 - i),
    })),
    genre: [
      { value: "28", label: "Action" },
      { value: "12", label: "Adventure" },
      { value: "16", label: "Animation" },
      { value: "35", label: "Comedy" },
      { value: "80", label: "Crime" },
      { value: "99", label: "Documentary" },
      { value: "18", label: "Drama" },
      { value: "10751", label: "Family" },
      { value: "14", label: "Fantasy" },
      { value: "36", label: "History" },
      { value: "27", label: "Horror" },
      { value: "10402", label: "Music" },
      { value: "9648", label: "Mystery" },
      { value: "10749", label: "Romance" },
      { value: "878", label: "Science Fiction" },
      { value: "53", label: "Thriller" },
      { value: "10752", label: "War" },
    ],
    country: [
      { value: "AF", label: "Afghanistan" },
      { value: "AL", label: "Albania" },
      { value: "DZ", label: "Algeria" },
      { value: "AS", label: "American Samoa" },
      { value: "AD", label: "Andorra" },
      { value: "AO", label: "Angola" },
      { value: "AI", label: "Anguilla" },
      { value: "AQ", label: "Antarctica" },
      { value: "AG", label: "Antigua and Barbuda" },
      { value: "AR", label: "Argentina" },
      { value: "AM", label: "Armenia" },
      { value: "AW", label: "Aruba" },
      { value: "AU", label: "Australia" },
      { value: "AT", label: "Austria" },
      { value: "AZ", label: "Azerbaijan" },
      { value: "BS", label: "Bahamas" },
      { value: "BH", label: "Bahrain" },
      { value: "BD", label: "Bangladesh" },
      { value: "BB", label: "Barbados" },
      { value: "BY", label: "Belarus" },
      { value: "BE", label: "Belgium" },
      { value: "BZ", label: "Belize" },
      { value: "BJ", label: "Benin" },
      { value: "BM", label: "Bermuda" },
      { value: "BT", label: "Bhutan" },
      { value: "BO", label: "Bolivia" },
      { value: "BA", label: "Bosnia and Herzegovina" },
      { value: "BW", label: "Botswana" },
      { value: "BR", label: "Brazil" },
      { value: "BN", label: "Brunei Darussalam" },
      { value: "BG", label: "Bulgaria" },
      { value: "BF", label: "Burkina Faso" },
      { value: "BI", label: "Burundi" },
      { value: "KH", label: "Cambodia" },
      { value: "CM", label: "Cameroon" },
      { value: "CA", label: "Canada" },
      { value: "CV", label: "Cape Verde" },
      { value: "KY", label: "Cayman Islands" },
      { value: "CF", label: "Central African Republic" },
      { value: "TD", label: "Chad" },
      { value: "CL", label: "Chile" },
      { value: "CN", label: "China" },
      { value: "CO", label: "Colombia" },
      { value: "KM", label: "Comoros" },
      { value: "CG", label: "Congo" },
      { value: "CD", label: "Congo, Democratic Republic" },
      { value: "CR", label: "Costa Rica" },
      { value: "CI", label: "Cote d'Ivoire" },
      { value: "HR", label: "Croatia" },
      { value: "CU", label: "Cuba" },
      { value: "CY", label: "Cyprus" },
      { value: "CZ", label: "Czech Republic" },
      { value: "DK", label: "Denmark" },
      { value: "DJ", label: "Djibouti" },
      { value: "DM", label: "Dominica" },
      { value: "DO", label: "Dominican Republic" },
      { value: "EC", label: "Ecuador" },
      { value: "EG", label: "Egypt" },
      { value: "SV", label: "El Salvador" },
      { value: "GQ", label: "Equatorial Guinea" },
      { value: "ER", label: "Eritrea" },
      { value: "EE", label: "Estonia" },
      { value: "ET", label: "Ethiopia" },
      { value: "FJ", label: "Fiji" },
      { value: "FI", label: "Finland" },
      { value: "FR", label: "France" },
      { value: "GA", label: "Gabon" },
      { value: "GM", label: "Gambia" },
      { value: "GE", label: "Georgia" },
      { value: "DE", label: "Germany" },
      { value: "GH", label: "Ghana" },
      { value: "GR", label: "Greece" },
      { value: "GL", label: "Greenland" },
      { value: "GD", label: "Grenada" },
      { value: "GU", label: "Guam" },
      { value: "GT", label: "Guatemala" },
      { value: "GN", label: "Guinea" },
      { value: "GW", label: "Guinea-Bissau" },
      { value: "GY", label: "Guyana" },
      { value: "HT", label: "Haiti" },
      { value: "HN", label: "Honduras" },
      { value: "HK", label: "Hong Kong" },
      { value: "HU", label: "Hungary" },
      { value: "IS", label: "Iceland" },
      { value: "IN", label: "India" },
      { value: "ID", label: "Indonesia" },
      { value: "IR", label: "Iran" },
      { value: "IQ", label: "Iraq" },
      { value: "IE", label: "Ireland" },
      { value: "IL", label: "Israel" },
      { value: "IT", label: "Italy" },
      { value: "JM", label: "Jamaica" },
      { value: "JP", label: "Japan" },
      { value: "JO", label: "Jordan" },
      { value: "KZ", label: "Kazakhstan" },
      { value: "KE", label: "Kenya" },
      { value: "KI", label: "Kiribati" },
      { value: "KP", label: "Korea, Democratic People's Republic" },
      { value: "KR", label: "Korea, Republic" },
      { value: "KW", label: "Kuwait" },
      { value: "KG", label: "Kyrgyzstan" },
      { value: "LA", label: "Lao People's Democratic Republic" },
      { value: "LV", label: "Latvia" },
      { value: "LB", label: "Lebanon" },
      { value: "LS", label: "Lesotho" },
      { value: "LR", label: "Liberia" },
      { value: "LY", label: "Libya" },
      { value: "LI", label: "Liechtenstein" },
      { value: "LT", label: "Lithuania" },
      { value: "LU", label: "Luxembourg" },
      { value: "MO", label: "Macao" },
      { value: "MK", label: "Macedonia" },
      { value: "MG", label: "Madagascar" },
      { value: "MW", label: "Malawi" },
      { value: "MY", label: "Malaysia" },
      { value: "MV", label: "Maldives" },
      { value: "ML", label: "Mali" },
      { value: "MT", label: "Malta" },
      { value: "MH", label: "Marshall Islands" },
      { value: "MR", label: "Mauritania" },
      { value: "MU", label: "Mauritius" },
      { value: "MX", label: "Mexico" },
      { value: "FM", label: "Micronesia" },
      { value: "MD", label: "Moldova" },
      { value: "MC", label: "Monaco" },
      { value: "MN", label: "Mongolia" },
      { value: "ME", label: "Montenegro" },
      { value: "MA", label: "Morocco" },
      { value: "MZ", label: "Mozambique" },
      { value: "MM", label: "Myanmar" },
      { value: "NA", label: "Namibia" },
      { value: "NR", label: "Nauru" },
      { value: "NP", label: "Nepal" },
      { value: "NL", label: "Netherlands" },
      { value: "NZ", label: "New Zealand" },
      { value: "NI", label: "Nicaragua" },
      { value: "NE", label: "Niger" },
      { value: "NG", label: "Nigeria" },
      { value: "NO", label: "Norway" },
      { value: "OM", label: "Oman" },
      { value: "PK", label: "Pakistan" },
      { value: "PW", label: "Palau" },
      { value: "PS", label: "Palestine" },
      { value: "PA", label: "Panama" },
      { value: "PG", label: "Papua New Guinea" },
      { value: "PY", label: "Paraguay" },
      { value: "PE", label: "Peru" },
      { value: "PH", label: "Philippines" },
      { value: "PL", label: "Poland" },
      { value: "PT", label: "Portugal" },
      { value: "PR", label: "Puerto Rico" },
      { value: "QA", label: "Qatar" },
      { value: "RO", label: "Romania" },
      { value: "RU", label: "Russia" },
      { value: "RW", label: "Rwanda" },
      { value: "KN", label: "Saint Kitts and Nevis" },
      { value: "LC", label: "Saint Lucia" },
      { value: "VC", label: "Saint Vincent and the Grenadines" },
      { value: "WS", label: "Samoa" },
      { value: "SM", label: "San Marino" },
      { value: "ST", label: "Sao Tome and Principe" },
      { value: "SA", label: "Saudi Arabia" },
      { value: "SN", label: "Senegal" },
      { value: "RS", label: "Serbia" },
      { value: "SC", label: "Seychelles" },
      { value: "SL", label: "Sierra Leone" },
      { value: "SG", label: "Singapore" },
      { value: "SK", label: "Slovakia" },
      { value: "SI", label: "Slovenia" },
      { value: "SB", label: "Solomon Islands" },
      { value: "SO", label: "Somalia" },
      { value: "ZA", label: "South Africa" },
      { value: "SS", label: "South Sudan" },
      { value: "ES", label: "Spain" },
      { value: "LK", label: "Sri Lanka" },
      { value: "SD", label: "Sudan" },
      { value: "SR", label: "Suriname" },
      { value: "SZ", label: "Swaziland" },
      { value: "SE", label: "Sweden" },
      { value: "CH", label: "Switzerland" },
      { value: "SY", label: "Syrian Arab Republic" },
      { value: "TW", label: "Taiwan" },
      { value: "TJ", label: "Tajikistan" },
      { value: "TZ", label: "Tanzania" },
      { value: "TH", label: "Thailand" },
      { value: "TL", label: "Timor-Leste" },
      { value: "TG", label: "Togo" },
      { value: "TO", label: "Tonga" },
      { value: "TT", label: "Trinidad and Tobago" },
      { value: "TN", label: "Tunisia" },
      { value: "TR", label: "Turkey" },
      { value: "TM", label: "Turkmenistan" },
      { value: "TV", label: "Tuvalu" },
      { value: "UG", label: "Uganda" },
      { value: "UA", label: "Ukraine" },
      { value: "AE", label: "United Arab Emirates" },
      { value: "GB", label: "United Kingdom" },
      { value: "US", label: "United States" },
      { value: "UY", label: "Uruguay" },
      { value: "UZ", label: "Uzbekistan" },
      { value: "VU", label: "Vanuatu" },
      { value: "VE", label: "Venezuela" },
      { value: "VN", label: "Vietnam" },
      { value: "YE", label: "Yemen" },
      { value: "ZM", label: "Zambia" },
      { value: "ZW", label: "Zimbabwe" },
    ],
    sortBy: [
      // { value: "popularity.desc", label: "Most Popular" },
      { value: "release_date.desc", label: "Latest Release" },
      { value: "release_date.asc", label: "Oldest Release" },
      { value: "original_title.asc", label: "Title A-Z" },
      { value: "original_title.desc", label: "Title Z-A" },
      { value: "vote_average.desc", label: "Highest Rated" },
      { value: "vote_average.asc", label: "Lowest Rated" },
    ],
  };

  return (
    <div className="mx-auto max-w-[1440px] px-2 pb-20 pt-32">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies and TV shows..."
        className="mb-4 w-full rounded-2xl border bg-gray-900 p-2 px-4 text-white"
      />

      <div className="mb-4 grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
        {Object.entries(filterOptions).map(([filterType, options]) => {
          const selectedOption = options.find(
            (opt) => opt.value === filters[filterType as keyof typeof filters],
          );

          return (
            <div key={filterType} className="relative w-full md:w-40">
              <div
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-white hover:bg-gray-700 ${
                  activeFilter === filterType ? "bg-gray-800" : "bg-[#333333]"
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === filterType ? null : filterType,
                  )
                }
              >
                <div>
                  <span className="block text-xs text-gray-400">
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </span>
                  <span className="block truncate text-sm">
                    {selectedOption ? selectedOption.label : "All"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </div>
              {activeFilter === filterType && (
                <div className="absolute z-10 mt-2 w-full rounded-lg border bg-gray-200 p-1 shadow-lg dark:bg-[#2a2a30] md:w-40">
                  <div className="no-scrollbar max-h-32 overflow-y-auto text-xs">
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className={`cursor-pointer rounded p-2 hover:bg-gray-400 dark:hover:bg-gray-700 ${
                          filters[filterType as keyof typeof filters] ===
                          option.value
                            ? "bg-gray-500 text-yellow-500 dark:bg-gray-900"
                            : ""
                        }`}
                        onClick={() => {
                          handleFilterChange(filterType, option.value);
                          setActiveFilter(null);
                        }}
                      >
                        <div className="flex items-center gap-x-1">
                          {option.value ===
                          filters[filterType as keyof typeof filters] ? (
                            <CircleCheck className="mb-[1px] size-[14px] fill-yellow-500 text-gray-500 dark:text-gray-900" />
                          ) : (
                            <Circle className="mb-[1px] size-[14px] fill-gray-500 text-gray-500" />
                          )}
                          {option.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-center md:w-auto"
          onClick={resetFilters}
        >
          Reset Filters
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {getSortedResults().map((item, index) => {
          const type = item.title ? "movie" : "tv";
          return (
            <div
              key={item.id}
              ref={index === results.length - 1 ? lastElementRef : undefined}
              className="relative aspect-[2/3]"
            >
              <Link href={`/${type}/${item.id}`}>
                <div className="relative h-full w-full hover:text-white">
                  <Image
                    className="rounded object-cover transition-transform hover:scale-110"
                    src={
                      `https://image.tmdb.org/t/p/original${item.poster_path}` ||
                      "/placeholder.png"
                    }
                    alt={item.title || item.name || ""}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={index < 6}
                  />
                  <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded bg-gray-900 bg-opacity-60 opacity-0 transition-opacity hover:opacity-100 hover:backdrop-blur-[2px]">
                    <Image
                      src="/icon-play.png"
                      alt="play"
                      width={25}
                      height={25}
                    />
                    <div className="absolute bottom-2 px-1 text-center">
                      <h3 className="mb-2 line-clamp-2 text-xs font-semibold sm:text-sm">
                        {item.title || item.name}
                      </h3>
                      <p className="-mt-2 text-[10px] text-gray-400">
                        {type.toUpperCase()} /{" "}
                        {
                          (
                            item.release_date ||
                            item.first_air_date ||
                            ""
                          ).split("-")[0]
                        }{" "}
                        / {item.original_language.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 rounded-r bg-yellow-500 px-0.5 text-xs font-semibold text-white">
                    HD
                  </div>
                  <div className="absolute right-0 top-2 flex items-center gap-1 rounded-l bg-black bg-opacity-50 px-1 text-xs font-semibold text-white">
                    <Star
                      size={12}
                      strokeWidth={0.5}
                      className="fill-yellow-500"
                    />
                    {item.vote_average.toPrecision(2)}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="my-4 text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 text-blue-500"
            role="status"
          >
            {/* <span className="visually-hidden">Loading...</span> */}
          </div>
        </div>
      )}
    </div>
  );
};

// New main page component with Suspense
const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 text-blue-500" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
