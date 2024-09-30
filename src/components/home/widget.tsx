"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ListItem {
  id: number;
  title?: string;
  original_name?: string;
  season?: number;
  episode?: number;
  poster_path: string;
}

interface TopListProps {
  movieItems: ListItem[];
  tvItems: ListItem[];
  type: "Movies" | "Series";
}

export default function TopList({ movieItems, tvItems, type }: TopListProps) {
  const [activeTab, setActiveTab] = useState<"Movies" | "Series">("Series");
  console.log(activeTab, type);
  const filteredItems = activeTab === "Movies" ? movieItems : tvItems;

  return (
    <div className="w-full p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold">
          <span className="mr-2 text-yellow-400">▶</span> TOP
        </h2>
        <div className="space-x-2">
          <Button
            variant={activeTab === "Movies" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("Movies")}
            className="text-sm"
          >
            Movies
          </Button>
          <Button
            variant={activeTab === "Series" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("Series")}
            className="text-sm"
          >
            Series
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center space-x-3 rounded bg-gray-900 p-2"
          >
            <div className="relative h-16 w-12 flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                alt={item.title || item.original_name}
                className="h-full w-full rounded object-cover"
              />
              <div className="absolute -left-3 top-1/3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-500 bg-red-500 text-sm font-bold text-black">
                {index + 1}
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-xs text-gray-400">
                {activeTab} {item.season && `/ SS ${item.season}`}{" "}
                {item.episode && `/ EP ${item.episode}`}
              </p>
              <h3 className="line-clamp-1 font-semibold">
                {item.title || item.original_name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
