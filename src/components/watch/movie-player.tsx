"use client";

import { usePersistedState } from "@/hooks/usePersistedState";
import { MovieInfo } from "@/types/tmdbApi";
import { Server, X } from "lucide-react";
import { useState } from "react";

const PROVIDERS = [
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "Embedsu",
    url: "https://embed.su/embed/movie/",
    countryUrl: `https://flagsapi.com/GB/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
    countryUrl: `https://flagsapi.com/US/flat/32.png`,
  },
];

interface VideoPlayerProps {
  movieId: string;
  movieInfo: MovieInfo;
}

const VideoPlayer = ({ movieId, movieInfo }: VideoPlayerProps) => {
  const [showServers, setShowServers] = useState(false);
  const [currentProvider, setCurrentProvider, loading] = usePersistedState(
    "currentProvider",
    PROVIDERS[0],
  );
  const [autoplay, setAutoplay] = usePersistedState("autoplay", false);
  const [bookmarked, setBookmarked] = usePersistedState("bookmarked", false);
  const [autonext, setAutonext] = usePersistedState("autonext", false);

  const handleProviderChange = (provider: (typeof PROVIDERS)[0]) => {
    setCurrentProvider(provider);
    setShowServers(false);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-screen-xl px-4 pt-10">
        <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-lg shadow-lg lg:w-3/4">
          <button
            onClick={() => setShowServers(!showServers)}
            className="absolute left-0 right-0 top-2 z-20 mx-auto flex h-10 w-40 items-center justify-center gap-x-2 rounded-md bg-red-500 text-white transition-all hover:bg-red-600"
          >
            {showServers ? <X /> : <Server />}
            {showServers ? "Close" : "Select a server"}
          </button>

          {!loading && (
            <div
              className={`absolute left-0 right-0 top-12 z-20 mx-auto mt-1 w-fit max-w-[90vw] rounded-md bg-gray-800 p-4 text-white transition-all duration-200 ${
                showServers
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <div className="scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 max-h-[20vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {PROVIDERS.map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => handleProviderChange(provider)}
                      className={`w-full rounded-md px-3 py-1 text-base font-semibold transition-all duration-150 ${
                        currentProvider!.name === provider.name
                          ? "bg-red-500"
                          : "bg-gray-700 hover:bg-gray-600"
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

          {!loading && (
            <iframe
              src={`${currentProvider?.url ? currentProvider.url : PROVIDERS[0].url}${movieId}`}
              className="absolute left-0 top-0 h-full w-full"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          )}
        </div>

        <div className="mt-2 flex items-center justify-center gap-x-4 text-sm">
          <label className="flex cursor-pointer items-center gap-x-2 rounded-md transition-all">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="h-3 w-3 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
            />
            <span>Autoplay</span>
          </label>

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

        <div className="mt-8 px-4 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="mt-6 flex flex-col lg:mt-0">
              <h1 className="text-xl font-semibold">
                Now Watching:{" "}
                <span className="font-bold">{movieInfo.title}</span>
              </h1>

              {/* <div className="mt-2 flex flex-wrap gap-2">
                {movieInfo.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-red-500 px-3 py-1 text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-x-4 text-gray-400">
                <span>{new Date(movieInfo.release_date).getFullYear()}</span>
                <span>•</span>
                <span>
                  {Math.floor(movieInfo.runtime / 60)}h {movieInfo.runtime % 60}
                  m
                </span>
                <span>•</span>
                <span>{movieInfo.vote_average.toFixed(1)} ⭐</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
