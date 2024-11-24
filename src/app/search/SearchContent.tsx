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

interface FilterSectionProps {
  currentType: MediaType;
  currentGenre: string;
  currentSort: SortOption;
  currentYear: string;
  currentCountry: string;
  currentRating: RatingOption;
  genres: Array<{ id: number; name: string }>;
  updateSearchParams: (params: { [key: string]: string }) => void;
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

const FilterSection = memo(
  ({
    currentType,
    currentGenre,
    currentSort,
    currentYear,
    currentCountry,
    currentRating,
    genres,
    updateSearchParams,
  }: FilterSectionProps) => (
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
          <SelectItem value="popularity">Sort by</SelectItem>
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
  ),
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

        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap">
          <button
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-x-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 xl:w-fit"
          >
            <ResetIcon />
            Reset
          </button>

          <FilterSection
            currentType={currentType}
            currentGenre={currentGenre}
            currentSort={currentSort}
            currentYear={currentYear}
            currentCountry={currentCountry}
            currentRating={currentRating}
            genres={genres}
            updateSearchParams={updateSearchParams}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from(resultsMap.values()).map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>

      {loading && <div className="mt-4 text-center">Loading...</div>}
      <div ref={ref} className="h-10" />
    </div>
  );
}
