"use client";

import { usePersistedState } from "@/hooks/usePersistedState";
import { TVInfo } from "@/types/tmdbApi";
import { Bell, Server, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Combobox } from "../tv-page/EpisodesSection";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const PROVIDERS = [
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/tv/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "Embedsu",
    url: "https://embed.su/embed/tv/",
    countryUrl: `https://flagsapi.com/GB/flat/32.png`,
  },
];

interface TVPlayerProps {
  tvId: string;
  tvInfo: TVInfo;
}

const TVPlayer = ({ tvId, tvInfo }: TVPlayerProps) => {
  const searchParams = useSearchParams();
  const [showServers, setShowServers] = useState(false);
  const [currentProvider, setCurrentProvider, loading] = usePersistedState(
    "currentTVProvider",
    PROVIDERS[0],
  );
  const [currentSeason, setCurrentSeason] = useState(
    parseInt(searchParams.get("season") || "1"),
  );
  const [currentEpisode, setCurrentEpisode] = useState(
    parseInt(searchParams.get("episode") || "1"),
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [autonext, setAutonext] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const season = searchParams.get("season");
    const episode = searchParams.get("episode");
    if (season) setCurrentSeason(parseInt(season));
    if (episode) setCurrentEpisode(parseInt(episode));
  }, [searchParams]);

  const handleProviderChange = (provider: (typeof PROVIDERS)[0]) => {
    setCurrentProvider(provider);
    setShowServers(false);
  };

  const handleEpisodeSelect = (season: number, episode: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <h1 className="truncate pb-5 text-center text-xl font-semibold">
          Now Watching: <span className="font-bold">{tvInfo.name}</span>
        </h1>

        <div
          className={cn(
            "mx-auto mb-2 flex w-full items-center rounded-sm bg-red-700 text-white lg:w-3/4 lg:pl-6",
            isOpen ? "" : "hidden",
          )}
        >
          <div className="flex w-full items-center justify-center gap-x-2 p-2 text-sm">
            <Bell className="h-4 w-4 fill-white" />
            <p>
              Please switch to other servers if default server is not working.
            </p>
          </div>
          <X
            className="h-8 w-8 cursor-pointer justify-end pr-2"
            onClick={() => setIsOpen(false)}
          />
        </div>

        <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-lg shadow-lg lg:w-3/4">
          {/* Server selection */}
          <button
            onClick={() => setShowServers(!showServers)}
            className="absolute left-0 right-0 top-0 z-20 mx-auto flex h-10 w-40 items-center justify-center gap-x-2 rounded-md bg-red-500 text-white transition-all hover:bg-red-600"
          >
            {showServers ? <X /> : <Server />}
            {showServers ? "Close" : "Select a server"}
          </button>

          {/* Server selection modal */}
          {!loading && (
            <div
              className={`absolute left-0 right-0 top-12 z-20 mx-auto mt-1 w-fit max-w-[90vw] rounded-md bg-gray-800 p-4 text-white transition-all duration-200 ${
                showServers
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleProviderChange(provider)}
                    className={`w-full rounded-md px-3 py-1 text-base font-semibold transition-all duration-150 ${
                      currentProvider?.name === provider.name
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-x-1">
                      <img src={provider.countryUrl} alt="Country" />{" "}
                      {provider.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video Player */}
          {!loading && (
            <div>
              <iframe
                src={`${currentProvider?.url}${tvId}/${currentSeason}/${currentEpisode}`}
                className="absolute left-0 top-0 h-full w-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mx-auto flex w-full items-center justify-center gap-x-4 rounded-b-md bg-gray-900 py-1 text-sm text-white lg:w-3/4">
          <label className="flex cursor-pointer items-center gap-x-2 rounded-md transition-all">
            <input
              type="checkbox"
              checked={autonext}
              onChange={(e) => setAutonext(e.target.checked)}
              className="h-3 w-3 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
            />
            <span>Auto Next</span>
          </label>

          <label className="flex cursor-pointer items-center gap-x-2 rounded-md transition-all">
            <input
              type="checkbox"
              checked={bookmarked}
              onChange={(e) => setBookmarked(e.target.checked)}
              className="h-3 w-3 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
            />
            <span>Bookmark</span>
          </label>
        </div>

        {/* TV Info and Episodes */}
        <div className="mx-auto mt-8 w-full lg:w-3/4">
          {/* Episodes Section */}
          <div className="mt-6">
            <Combobox
              props={{
                id: Number(tvId),
                seasons: tvInfo.seasons,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVPlayer;
