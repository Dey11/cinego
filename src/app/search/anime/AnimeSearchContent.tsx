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
import { ResetIcon } from "@radix-ui/react-icons";
import {
  useAnimeSearch,
  AnimeResult,
  animeGenres,
} from "@/hooks/use-anime-search";
import { useRouter } from "next/navigation";

const AnimeResultCard = memo(({ result }: { result: AnimeResult }) => (
  <Link href={`/anime/${result.originalId || result.id.split("-")[0]}`}>
    <div className="relative overflow-hidden rounded-md hover:text-white">
      <div className="relative rounded-sm">
        <img
          className="object-cover"
          src={result.image}
          alt={result.title.english || result.title.romaji}
          style={{ width: "100%", height: "100%" }}
        />
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-sm bg-gray-900 bg-opacity-60 opacity-0 transition-opacity hover:opacity-100 hover:backdrop-blur-[2px]">
          <img src="/icon-play.png" alt="play" width={25} height={25} />
          <div className="absolute bottom-2 px-1 text-center text-sm font-semibold leading-snug sm:text-base">
            <h3 className="mb-2 line-clamp-2 text-xs font-semibold">
              {result.title.english || result.title.romaji}
            </h3>
            <p className="-mt-2 text-[10px] text-gray-400">
              {result.type} / {new Date(result.releaseDate).getFullYear()}
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
          {result.rating / 10}
        </div>
      </div>
    </div>
  </Link>
));

AnimeResultCard.displayName = "AnimeResultCard";

const getYearsList = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }
  return years;
};

export default function AnimeSearchContent() {
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const {
    results,
    loading,
    hasMore,
    inputValue,
    currentSeason,
    currentGenre,
    currentYear,
    setInputValue,
    updateSearchParams,
    setPage,
    handleReset,
    loadMore,
    handleInputChange,
  } = useAnimeSearch();

  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prev) => prev + 1);
      loadMore();
    }
  }, [inView, loading, hasMore, loadMore]);

  return (
    <div className="container mx-auto max-w-[1440px] p-4 pt-20">
      <div className="mb-6 flex flex-col gap-4">
        <Input
          placeholder="Search anime..."
          className="w-full rounded-lg py-4 capitalize text-black dark:text-white"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:items-center xl:gap-0 xl:space-x-2">
          <Select
            value="anime"
            onValueChange={(value) => {
              if (value === "all" || value === "movie" || value === "tv") {
                router.push(`/search?type=${value}`);
                return;
              }
              updateSearchParams({ type: value });
            }}
          >
            <SelectTrigger className="w-full xl:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anime">Anime</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentSeason}
            onValueChange={(value) => updateSearchParams({ season: value })}
          >
            <SelectTrigger className="w-full xl:w-[180px]">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WINTER">Winter</SelectItem>
              <SelectItem value="SPRING">Spring</SelectItem>
              <SelectItem value="SUMMER">Summer</SelectItem>
              <SelectItem value="FALL">Fall</SelectItem>
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
              <SelectItem value="all">All Genres</SelectItem>
              {animeGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
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
              <SelectItem value="all">All Years</SelectItem>
              {getYearsList().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value="all"
            onValueChange={(value) => updateSearchParams({ format: value })}
          >
            <SelectTrigger className="w-full xl:w-[180px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="TV">TV</SelectItem>
              <SelectItem value="OVA">OVA</SelectItem>
              <SelectItem value="MOVIE">Movie</SelectItem>
              <SelectItem value="ONA">ONA</SelectItem>
              <SelectItem value="SPECIAL">Special</SelectItem>
              <SelectItem value="MUSIC">Music</SelectItem>
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
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {results.map((result) => (
          <AnimeResultCard
            key={`${result.id}-${result.title.romaji}`}
            result={result}
          />
        ))}
      </div>

      {loading && <div className="mt-4 text-center">Loading...</div>}
      <div ref={ref} className="h-10" />
    </div>
  );
}
