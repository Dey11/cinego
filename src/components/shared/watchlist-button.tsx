"use client";

import { useMediaList } from "@/hooks/use-media-list";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

interface WatchlistButtonProps {
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  backdrop_path: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function WatchlistButton({
  mediaId,
  mediaType,
  title,
  backdrop_path,
  className,
  variant = "outline",
  size = "default",
}: WatchlistButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isPaused] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedPauseStatus = localStorage.getItem("watchHistoryPaused");
      return storedPauseStatus === "true";
    }
    return false;
  });

  const {
    addItem: addToWatchlist,
    removeItem: removeFromWatchlist,
    isInList: isInWatchlist,
  } = useMediaList("watchlist", isPaused);

  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    setIsWatchlisted(isInWatchlist(mediaId, mediaType));
  }, [mediaId, mediaType, isInWatchlist]);

  const handleWatchlistToggle = () => {
    if (!isSignedIn) {
      return;
    }

    if (isWatchlisted) {
      // setIsWatchlisted(false);
      removeFromWatchlist(mediaId, mediaType);
    } else {
      // setIsWatchlisted(true);
      addToWatchlist({
        mediaId,
        mediaType,
        title,
        backdrop_path,
        watchedAt: new Date().toISOString(),
      });
    }
  };

  if (!isSignedIn || !isLoaded) {
    return (
      <SignInButton mode="modal">
        <Button variant={variant} size={size} className={className}>
          <Plus className="mr-2 h-4 w-4" />
          Watchlist
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button
      onClick={handleWatchlistToggle}
      variant={variant}
      size={size}
      className={className}
    >
      {isWatchlisted ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Watchlist
    </Button>
  );
}
