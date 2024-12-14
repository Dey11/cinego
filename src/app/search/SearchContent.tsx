"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { country } from "@/lib/constants";
import { ResetIcon } from "@radix-ui/react-icons";
import {
  useSearch,
  Result,
  MediaType,
  SortOption,
  RatingOption,
} from "@/hooks/use-search";
import { useRouter } from "next/navigation";

interface FilterSectionProps {
  currentType: MediaType;
  currentGenre: string;
  currentSort: SortOption;
  currentYear: string;
  currentCountry: string;
  currentRating: RatingOption;
  currentNetwork: string;
  genres: Array<{ id: number; name: string }>;
  updateSearchParams: (params: { [key: string]: string }) => void;
  handleReset: () => void;
}

const ResultCard = memo(({ result }: { result: Result }) => (
  <Link href={`/${result.media_type}/${result.id}`}>
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
));

ResultCard.displayName = "ResultCard";

const getYearsList = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }
  return years;
};

const networks = [
  { id: 213, name: "Netflix" },
  { id: 49, name: "HBO" },
  { id: 2739, name: "Disney+" },
  { id: 1024, name: "Amazon Prime Video" },
  { id: 453, name: "Hulu" },
  { id: 2552, name: "Apple TV+" },
  { id: 6, name: "NBC" },
  { id: 4, name: "BBC One" },
  { id: 71, name: "The CW" },
  { id: 16, name: "CBS" },
  { id: 67, name: "Showtime" },
  { id: 34, name: "Starz" },
  { id: 174, name: "AMC" },
  { id: 88, name: "FX" },
  { id: 56, name: "Cartoon Network" },
  { id: 13, name: "Nickelodeon" },
  { id: 813, name: "HBO Max" },
  { id: 3353, name: "Peacock" },
  { id: 5, name: "BBC Two" },
  { id: 15, name: "TBS" },
];

const FilterSection = memo(
  ({
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentCountry,
    currentRating,
    currentNetwork,
    genres,
    handleReset,
    updateSearchParams,
  }: FilterSectionProps) => {
    const router = useRouter();

    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:items-center xl:gap-0 xl:space-x-2">
        <Select
          value={currentType}
          onValueChange={(value: MediaType) => {
            if (value === "anime") {
              router.push("/search/anime");
              return;
            }
            updateSearchParams({ type: value });
          }}
        >
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Type</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
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
            <SelectItem value="popularity">Sort by</SelectItem>
            <SelectItem value="popularity">Popular</SelectItem>
            <SelectItem value="latest">Latest Release</SelectItem>
            <SelectItem value="oldest">Oldest Release</SelectItem>
            <SelectItem value="a-z">Title A-Z</SelectItem>
            <SelectItem value="z-a">Title Z-A</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
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
          value={currentNetwork}
          onValueChange={(value) => updateSearchParams({ network: value })}
        >
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Network</SelectItem>
            {networks.map((network) => (
              <SelectItem key={network.id} value={network.id.toString()}>
                {network.name}
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

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-x-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          <ResetIcon />
          Reset
        </button>
      </div>
    );
  },
);

FilterSection.displayName = "FilterSection";

export default function SearchContent() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const {
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
  } = useSearch();

  useEffect(() => {
    if (inView && !loading) {
      setPage((prev) => prev + 1);
      loadMore();
    }
  }, [inView, loading, loadMore]);

  return (
    <div className="container mx-auto max-w-[1440px] p-4 pt-20">
      <div className="mb-6 flex flex-col gap-4">
        <Input
          placeholder="Search..."
          className="w-full rounded-lg py-4 capitalize text-black dark:text-white"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <FilterSection
            currentType={currentType}
            currentGenre={currentGenre}
            currentSort={currentSort}
            currentYear={currentYear}
            currentCountry={currentCountry}
            currentRating={currentRating}
            currentNetwork={currentNetwork}
            genres={genres}
            updateSearchParams={updateSearchParams}
            handleReset={handleReset}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from(resultsMap.values()).map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>

      {loading && (
        <div className="flex min-h-[50dvh] min-w-full items-center justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="size-7 animate-spin fill-red-600 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
}
