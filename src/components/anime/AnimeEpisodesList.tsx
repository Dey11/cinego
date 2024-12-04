"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  GalleryThumbnails,
  List,
  ListEndIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";

interface AnimeEpisode {
  id: string;
  title: string;
  description: string;
  image: string;
  number: number;
}

interface AnimeEpisodesListProps {
  episodes: AnimeEpisode[];
  animeId: string;
}

export function AnimeEpisodesList({
  episodes,
  animeId,
}: AnimeEpisodesListProps) {
  const [order, setOrder] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"list" | "grid" | "thumbnail">(
    "list",
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredEpisodes = React.useMemo(() => {
    return episodes.filter(
      (ep) =>
        ep.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(ep.number).includes(searchTerm),
    );
  }, [episodes, searchTerm]);

  return (
    <div className="h-fit w-full">
      <h1 className="pb-5 text-2xl font-semibold">Episodes</h1>
      <div className="flex justify-between">
        <div className="flex w-full items-center gap-2">
          <div className="mr-2 flex h-10 w-full items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-1 w-32 rounded-md border bg-background px-2 py-[5px] lg:w-44"
            />
            <div className="flex gap-x-2">
              <div>
                {order ? (
                  <ArrowUpNarrowWide
                    onClick={() => setOrder(!order)}
                    className="cursor-pointer"
                  />
                ) : (
                  <ArrowDownWideNarrow
                    onClick={() => setOrder(!order)}
                    className="cursor-pointer"
                  />
                )}
              </div>
              <div>
                {viewMode === "list" ? (
                  <List
                    onClick={() => setViewMode("grid")}
                    className="cursor-pointer"
                  />
                ) : viewMode === "thumbnail" ? (
                  <GalleryThumbnails
                    onClick={() => setViewMode("list")}
                    className="cursor-pointer"
                  />
                ) : (
                  <ListEndIcon
                    onClick={() => setViewMode("thumbnail")}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {episodes.length > 1 ? (
        <ScrollArea className="h-[500px] px-2 pt-5">
          <div
            className={clsx(
              viewMode === "thumbnail" &&
                "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
            )}
          >
            {(order ? filteredEpisodes : [...filteredEpisodes].reverse()).map(
              (episode) => (
                <EpisodeItem
                  key={episode.id}
                  episode={episode}
                  viewMode={viewMode}
                  animeId={animeId}
                />
              ),
            )}
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea className="h-60 px-2 pt-5">
          <div
            className={clsx(
              viewMode === "thumbnail" &&
                "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
            )}
          >
            {(order ? filteredEpisodes : [...filteredEpisodes].reverse()).map(
              (episode) => (
                <EpisodeItem
                  key={episode.id}
                  episode={episode}
                  viewMode={viewMode}
                  animeId={animeId}
                />
              ),
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

interface EpisodeItemProps {
  episode: AnimeEpisode;
  viewMode: "list" | "grid" | "thumbnail";
  animeId: string;
}

function EpisodeItem({ episode, viewMode, animeId }: EpisodeItemProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/watch/anime/${animeId}?episode=${episode.number}`);
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleNavigate}
        className="mb-2 flex h-20 w-full cursor-pointer gap-2 overflow-hidden rounded-md bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-[#2a2a30] dark:hover:bg-gray-700"
      >
        <div className="relative h-full min-w-36">
          <Image
            className="rounded-l-md object-cover"
            src={episode.image}
            fill
            alt={`Episode ${episode.number} - ${episode.title}`}
          />
          <div className="absolute inset-0">
            <div className="absolute left-0 top-0 rounded-br-md rounded-tl-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
              {episode.number}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center p-2">
          <h2 className="text-sm font-semibold">
            {episode.title ?? `Episode ${episode.number}`}
          </h2>
          <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {episode.description}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div
        onClick={handleNavigate}
        className="mb-2 flex h-12 w-full cursor-pointer gap-2 overflow-hidden rounded-md bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-[#2a2a30] dark:hover:bg-gray-700"
      >
        <div className="flex flex-1 items-center justify-center p-2">
          <div className="flex flex-1 text-sm font-semibold">
            Episode {episode.number}
            {episode.title && `: ${episode.title}`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleNavigate}
      className="relative cursor-pointer transition-opacity hover:opacity-80"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          className="rounded-md object-cover"
          src={episode.image}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          priority={episode.number <= 4}
          alt={`Episode ${episode.number} - ${episode.title}`}
        />
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 rounded-br-md rounded-tl-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
            {episode.number}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeEpisodesList;
