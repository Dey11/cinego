import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface MediaItem {
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  backdrop_path: string;
  season?: number;
  episode?: number;
  watchedAt: string;
}

const LOCAL_STORAGE_KEYS = {
  WATCHLIST: "watchlist",
  HISTORY: "history",
};

export function useMediaList(type: "watchlist" | "history", isPaused: boolean) {
  const { user, isSignedIn } = useUser();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        if (isSignedIn) {
          // Load from API
          const response = await fetch(`/api/${type}`);
          if (!response.ok) {
            console.error("Failed to fetch items:", response.statusText);
            return;
          }
          const data = await response.json();
          setItems(data);
        } else if (typeof window !== "undefined") {
          // Load from localStorage only on client side
          const storedItems = window.localStorage.getItem(
            LOCAL_STORAGE_KEYS[
              type.toUpperCase() as keyof typeof LOCAL_STORAGE_KEYS
            ],
          );
          setItems(storedItems ? JSON.parse(storedItems) : []);
        }
      } catch (error) {
        console.error("Error loading items:", error);
      }
      setLoading(false);
    };

    loadItems();
  }, [isSignedIn, type]);

  const addItem = async (item: MediaItem) => {
    try {
      if (isSignedIn) {
        // Check if watch history is paused
        if (isPaused) {
          console.log("Watch history is paused. Item will not be added.");
          return; // Exit if the history is paused
        }

        // Add to API
        const response = await fetch(`/api/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!response.ok) {
          console.error("Failed to add item:", response.statusText);
          return; // Exit if the response is not OK
        }
        const newItem = await response.json();
        setItems((prev) => {
          // Remove duplicates
          const filteredItems = prev.filter(
            (existingItem) =>
              !(
                existingItem.mediaId === newItem.mediaId &&
                existingItem.mediaType === newItem.mediaType
              ),
          );
          return [...filteredItems, newItem]; // Add the new item at the end
        });
      } else if (typeof window !== "undefined") {
        if (isPaused) {
          console.log("Watch history is paused. Item will not be added.");
          return; // Exit if the history is paused
        }
        // Add to localStorage with safety check
        const storedItems = window.localStorage.getItem(
          LOCAL_STORAGE_KEYS[
            type.toUpperCase() as keyof typeof LOCAL_STORAGE_KEYS
          ],
        );
        const newItems = storedItems ? JSON.parse(storedItems) : [];

        // Remove duplicates
        const filteredItems = newItems.filter(
          (existingItem: any) =>
            !(
              existingItem.mediaId === item.mediaId &&
              existingItem.mediaType === item.mediaType
            ),
        );

        filteredItems.push(item); // Add the new item at the end
        window.localStorage.setItem(
          LOCAL_STORAGE_KEYS[
            type.toUpperCase() as keyof typeof LOCAL_STORAGE_KEYS
          ],
          JSON.stringify(filteredItems),
        );
        setItems(filteredItems);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (mediaId: string, mediaType: string) => {
    try {
      if (isSignedIn) {
        // Remove from API
        await fetch(`/api/${type}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaId, mediaType }),
        });
      }
      // Remove locally
      const newItems = items.filter(
        (item) => !(item.mediaId === mediaId && item.mediaType === mediaType),
      );
      if (!isSignedIn) {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEYS[
            type.toUpperCase() as keyof typeof LOCAL_STORAGE_KEYS
          ],
          JSON.stringify(newItems),
        );
      }
      setItems(newItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const isInList = (mediaId: string, mediaType: string) => {
    return items.some(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    );
  };

  return {
    items,
    loading,
    addItem,
    removeItem,
    isInList,
  };
}
