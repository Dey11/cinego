"use client";

import { usePersistedState } from "@/hooks/usePersistedState";
import { TVInfo } from "@/types/tmdbApi";
import {
  Bell,
  BookmarkIcon,
  FastForward,
  X,
  Check,
  Download,
  Forward,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Combobox } from "../tv-page/EpisodesSection";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  isBookmarked,
  toggleTVBookmark,
  DEFAULT_TV_PROVIDER,
} from "@/lib/utils";
import { PROVIDERS_TV } from "@/lib/constants";

interface TVPlayerProps {
  tvId: string;
  tvInfo: TVInfo;
}

const TVPlayer = ({ tvId, tvInfo }: TVPlayerProps) => {
  const searchParams = useSearchParams();
  const [showServers, setShowServers] = useState(false);
  const [currentProvider, setCurrentProvider, loading] = usePersistedState(
    "currentTVProvider",
    DEFAULT_TV_PROVIDER,
  );
  const [currentSeason, setCurrentSeason] = useState(
    parseInt(searchParams.get("season") || "1"),
  );
  const [currentEpisode, setCurrentEpisode] = useState(
    parseInt(searchParams.get("episode") || "1"),
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [seasons, setSeasons] = useState<number>(tvInfo.number_of_seasons);
  const [currSeasonEps, setCurrSeasonEps] = useState<number>(0);
  const [isLastEp, setIsLastEp] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const canGoBack = () => {
    return !(currentSeason === 1 && currentEpisode === 1);
  };

  const canGoForward = () => {
    const lastSeason = tvInfo.seasons[tvInfo.seasons.length - 1];
    return !(
      currentSeason === lastSeason.season_number &&
      currentEpisode === currSeasonEps
    );
  };

  const getNextEpisodeLink = () => {
    if (currentEpisode === currSeasonEps) {
      return `/watch/tv/${tvId}?season=${currentSeason + 1}&episode=1`;
    }
    return `/watch/tv/${tvId}?season=${currentSeason}&episode=${
      currentEpisode + 1
    }`;
  };

  const getPreviousEpisodeLink = () => {
    if (currentEpisode === 1) {
      const prevSeasonData = tvInfo.seasons.find(
        (season) => season.season_number === currentSeason - 1,
      );
      return `/watch/tv/${tvId}?season=${
        currentSeason - 1
      }&episode=${prevSeasonData?.episode_count || 1}`;
    }
    return `/watch/tv/${tvId}?season=${currentSeason}&episode=${
      currentEpisode - 1
    }`;
  };

  useEffect(() => {
    const season = searchParams.get("season");
    const episode = searchParams.get("episode");
    if (season) setCurrentSeason(parseInt(season));
    if (episode) setCurrentEpisode(parseInt(episode));

    const data = tvInfo.seasons.find(
      (season) => season.season_number === currentSeason,
    );
    setCurrSeasonEps(data?.episode_count || 0);

    console.log(currSeasonEps, "  ", currentEpisode);
    if (currentEpisode === currSeasonEps) {
      console.log("im here");
      setIsLastEp(true);
    }
  }, [searchParams, currentSeason, tvInfo.seasons]);

  useEffect(() => {
    setBookmarked(isBookmarked(tvId, "tv"));
  }, [tvId]);

  const handleProviderChange = (provider: (typeof PROVIDERS_TV)[0]) => {
    setCurrentProvider(provider);
    setShowServers(false);
  };

  const handleEpisodeSelect = (season: number, episode: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  };

  const handleBookmarkToggle = () => {
    const isNowBookmarked = toggleTVBookmark(
      tvId,
      currentSeason,
      currentEpisode,
    );
    setBookmarked(isNowBookmarked);
  };

  const handleShare = () => {
    const link = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: tvInfo.name,
          url: link,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(link).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      });
    }
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
            <Bell className="h-3 w-3 fill-white" />
            <span className="text-[10px] md:text-xs lg:text-sm">
              Please switch to other servers if default server doesnt work.
            </span>
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
            className="absolute left-0 right-0 top-0 z-20 mx-auto flex h-10 w-40 items-center justify-center gap-x-2 rounded-b-[12px] bg-red-700 text-white transition-all hover:bg-[#fa1111]"
          >
            {showServers ? (
              <X />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-7 md:w-7"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M20 3H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-5 5h-2V6h2zm4 0h-2V6h2zm1 5H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zm-5 5h-2v-2h2zm4 0h-2v-2h2z"
                ></path>
              </svg>
            )}
            {showServers ? "Close" : "Select a server"}
          </button>
          {/* Server selection modal */}
          {!loading && (
            <div
              className={`absolute left-0 right-0 top-12 z-20 mx-auto w-fit max-w-[90vw] rounded-md bg-gray-800 p-4 text-white transition-all duration-200 ${
                showServers
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <div className="scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 max-h-[12vh] overflow-y-auto px-2 sm:max-h-[20vh]">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {PROVIDERS_TV.map((provider, index) => (
                    <button
                      key={`${provider.name}-${index}`}
                      onClick={() => handleProviderChange(provider)}
                      className={`w-full rounded-md px-2 py-1 text-xs font-semibold transition-all duration-150 sm:text-[.8rem] ${
                        currentProvider?.name === provider.name
                          ? "bg-[#960000]"
                          : "border border-[#444444] bg-[#3e3939] hover:bg-[#960000]"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-x-1">
                        {<img src={provider.countryUrl} alt="Country" />}{" "}
                        {provider.name}
                      </div>
                    </button>
                  ))}
                </div>
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
        <div className="relative z-10 mx-auto -mt-[5px] flex w-full items-center justify-center gap-x-4 rounded-b-lg bg-gray-900 py-1 text-sm text-white lg:w-3/4">
          {canGoBack() && (
            <Link href={getPreviousEpisodeLink()}>
              <label className="flex cursor-pointer items-center gap-x-1 rounded-md transition-all">
                <FastForward className="h-4 w-4 rotate-180 fill-white" />
                <span className="hidden lg:block">Previous</span>
              </label>
            </Link>
          )}

          {canGoForward() && (
            <Link href={getNextEpisodeLink()}>
              <label className="flex cursor-pointer items-center gap-x-1 rounded-md transition-all">
                <FastForward className="h-4 w-4 fill-white" />
                <span className="hidden lg:block">Next</span>
              </label>
            </Link>
          )}

          <label
            className="flex cursor-pointer items-center gap-x-1 rounded-md transition-all"
            onClick={handleBookmarkToggle}
          >
            <BookmarkIcon
              className={cn("h-4 w-4 rounded", bookmarked && "fill-white")}
            />
            <span className="hidden lg:block">Bookmark</span>
          </label>

          <label
            className="flex cursor-pointer items-center gap-x-1 rounded-md transition-all"
            onClick={handleShare}
          >
            {linkCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Forward className="h-5 w-5" />
            )}
            <span className="hidden lg:block">Share</span>
          </label>

          <Link
            href={`https://dl.vidsrc.vip/tv/${tvId}/${currentSeason}/${currentEpisode}`}
          >
            <label className="flex cursor-pointer items-center gap-x-1 rounded-md transition-all">
              <Download className="h-4 w-4" />
              <span className="hidden lg:block">Download</span>
            </label>
          </Link>
        </div>

        {/* TV Info and Episodes */}
        <div className="mx-auto mt-8 w-full lg:w-3/4">
          {/* Episodes Section */}
          <div className="mt-6">
            <Combobox
              props={{
                id: Number(tvId),
                seasons: tvInfo.seasons,
                backdrop_path: tvInfo.backdrop_path,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVPlayer;
