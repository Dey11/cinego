"use client";

import { usePersistedState } from "@/hooks/usePersistedState";
import { Server, X } from "lucide-react";
import { useState } from "react";

const PROVIDERS = [
  {
    name: "VidSrc",
    url: "https://vidsrc.xyz/embed/movie/",
  },
  {
    name: "Embedsu",
    url: "https://embed.su/embed/movie/",
  },
];

const VideoPlayer = ({ params }: { params: { id: string } }) => {
  const [showServers, setShowServers] = useState(false);
  const [currentProvider, setCurrentProvider] = usePersistedState(
    "currentProvider",
    PROVIDERS[0],
  );

  const handleProviderChange = (provider: (typeof PROVIDERS)[0]) => {
    setCurrentProvider(provider);
    setShowServers(false);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 pt-20">
        <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
          <button
            onClick={() => setShowServers(!showServers)}
            className="absolute left-0 right-0 top-2 z-20 mx-auto flex h-10 w-40 items-center justify-center gap-x-2 rounded-md bg-red-500 transition-all hover:bg-red-600"
          >
            {showServers ? <X /> : <Server />}
            {showServers ? "Close" : "Select a server"}
          </button>

          {showServers && (
            <div className="absolute left-0 right-0 top-12 z-20 mx-auto w-fit rounded-md bg-gray-800 p-4">
              <div className="flex gap-2">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleProviderChange(provider)}
                    className={`rounded-md px-4 py-2 transition-all ${
                      currentProvider.name === provider.name
                        ? "bg-red-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <iframe
            src={`${currentProvider.url}${params.id}`}
            className="absolute left-0 top-0 h-full w-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>

        <div className="mt-4 text-gray-300">
          <h1 className="text-2xl font-bold">Now Playing</h1>
          <p className="text-sm">Movie ID: {params.id}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
