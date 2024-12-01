"use client";

import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { useState, useEffect } from "react";
import { Pause, Play, Trash } from "lucide-react";
import { useMediaList } from "@/hooks/use-media-list";

interface HistoryItem {
  mediaType: "movie" | "tv";
  mediaId: string;
  title: string;
  backdrop_path: string;
  season?: number;
  episode?: number;
  watchedAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    const storedPauseStatus = window.localStorage.getItem("watchHistoryPaused");
    setIsPaused(storedPauseStatus === "true");
  }, []);

  const { items, loading, addItem, removeItem, isInList } = useMediaList(
    "history",
    isPaused,
  );

  // Filter out invalid watchedAt dates
  const validHistory = items.filter((item) => {
    const date = new Date(item.watchedAt!);
    const isValidDate = !isNaN(date.getTime());
    if (!isValidDate) {
      console.error(
        `Invalid date for item ${item.mediaId}: ${item.watchedAt!}`,
      );
    }
    return isValidDate;
  });

  // Filter history based on search query
  const filteredHistory = validHistory.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedHistory = filteredHistory.reduce(
    (acc, item) => {
      const date = new Date(item.watchedAt!);
      const dateString = format(date, "dd MMMM, yyyy");
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  const togglePauseHistory = () => {
    const newPauseStatus = !isPaused;
    setIsPaused(newPauseStatus);
    window.localStorage.setItem(
      "watchHistoryPaused",
      JSON.stringify(newPauseStatus),
    );
  };

  return (
    <div className="container mx-auto max-w-[1440px] bg-white px-4 py-20 dark:bg-transparent">
      <div className="flex items-center justify-center gap-x-5">
        <input
          type="text"
          placeholder="Filter by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="my-4 w-44 rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:text-white sm:w-56 md:w-80 lg:w-96"
        />
        <button
          onClick={togglePauseHistory}
          className={`rounded-md px-2 py-2 text-white transition-colors ${
            isPaused
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isPaused ? (
            <div className="flex items-center gap-x-2">
              <Play className="h-5 w-5 fill-white" />
              <span>Resume History</span>
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <Pause className="h-5 w-5 fill-white" />
              <span>Pause History</span>
            </div>
          )}
        </button>
      </div>

      {Object.entries(groupedHistory).map(([date, items], index) => (
        <div key={index} className="mb-8">
          <h2 className="py-5 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {date}
          </h2>
          <ul className="list-disc pl-5">
            {items.reverse().map((item, index) => {
              const watchedDate = new Date(item.watchedAt);
              const formattedDate = `Watched ${formatDistanceToNow(watchedDate)} ago`;

              return (
                <li
                  key={index}
                  className="mb-4 flex items-center justify-between"
                >
                  <Link
                    href={`/${item.mediaType}/${item.mediaId}`}
                    className="group flex w-full items-center space-x-4 rounded-md bg-gray-100 transition-all hover:bg-[#960000] dark:bg-gray-900 dark:hover:bg-[#b03030]"
                  >
                    <img
                      src={
                        item.backdrop_path
                          ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                          : "/placeholder.png"
                      }
                      alt={item.title}
                      className="h-[80px] w-[120px] rounded-md object-cover lg:h-[100px] lg:w-[150px]"
                    />
                    <div className="flex-1">
                      <h3 className="line-clamp-2 text-lg font-semibold text-gray-800 group-hover:text-white dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-300 dark:text-gray-300">
                        {item.mediaType === "tv" && item.season && item.episode
                          ? `S${item.season} E${item.episode}`
                          : item.mediaType.toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-400 dark:text-gray-400">
                        {formattedDate}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeItem(item.mediaId, item.mediaType)}
                    className="ml-4 text-red-500 hover:text-red-700"
                    aria-label="Delete item"
                  >
                    <Trash size={20} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {filteredHistory.length === 0 && (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No valid watch history found.
          </p>
        </div>
      )}
    </div>
  );
}
