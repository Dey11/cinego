"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Share2, Trash } from "lucide-react";
import { useMediaList } from "@/hooks/use-media-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";

interface WatchlistItem {
  mediaType: "movie" | "tv";
  mediaId: string;
  title: string;
  backdrop_path: string;
  watchedAt: string;
}

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { items, removeItem } = useMediaList("watchlist", false);

  const handleShare = (item: WatchlistItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out ${item.title}`,
        url: `${window.location.origin}/${item.mediaType}/${item.mediaId}`,
      });
    }
  };

  const filteredWatchlist = items
    .sort(
      (a, b) =>
        new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime(),
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div>
      <SignedIn>
        <div className="container mx-auto h-screen max-w-[1440px] bg-white px-4 py-20 dark:bg-transparent">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,400px]">
            <div className="order-2 lg:order-1">
              <ul className="space-y-4">
                {filteredWatchlist.map((item) => {
                  const addedDate = new Date(item.watchedAt);
                  const formattedDate = `Added ${formatDistanceToNow(addedDate)} ago`;

                  return (
                    <li key={item.mediaId} className="relative">
                      <Link
                        href={`/${item.mediaType}/${item.mediaId}`}
                        className="group flex w-full items-center space-x-4 rounded-md bg-gray-100 transition-all hover:bg-gray-200 dark:bg-[#2a2a30] dark:hover:bg-gray-700"
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
                        <div className="flex-1 pr-12">
                          <h3 className="line-clamp-2 text-lg font-semibold text-gray-800 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.mediaType.toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formattedDate}
                          </p>
                        </div>
                      </Link>
                      <div className="absolute right-2 top-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShare(item)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                removeItem(item.mediaId, item.mediaType)
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {filteredWatchlist.length === 0 && (
                <div className="mt-10 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Your watchlist is empty.
                  </p>
                </div>
              )}
            </div>

            <div className="order-1 h-full space-y-4 lg:order-2 lg:pt-8">
              <Input
                type="text"
                placeholder="Search watchlist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
