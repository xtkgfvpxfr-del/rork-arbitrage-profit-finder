import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState, useCallback } from "react";

const WATCHLIST_KEY = "arbitrage_watchlist";

export const [WatchlistProvider, useWatchlist] = createContextHook(() => {
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const stored = await AsyncStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setWatchedIds(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWatchlist = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
    } catch (error) {
      console.log("Error saving watchlist:", error);
    }
  };

  const toggleWatched = useCallback((productId: string) => {
    setWatchedIds((prev) => {
      const isWatched = prev.includes(productId);
      const updated = isWatched
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      saveWatchlist(updated);
      return updated;
    });
  }, []);

  const isWatched = useCallback(
    (productId: string) => watchedIds.includes(productId),
    [watchedIds]
  );

  return {
    watchedIds,
    toggleWatched,
    isWatched,
    isLoading,
  };
});
