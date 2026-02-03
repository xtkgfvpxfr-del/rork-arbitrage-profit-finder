import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";
import {
  fetchLivePrices,
  getUpdateInterval,
  LiveProduct,
  PriceData,
  formatLastUpdated,
  formatNextUpdate,
} from "@/services/priceService";

export const [ProductsProvider, useProducts] = createContextHook(() => {
  const [countdown, setCountdown] = useState<string>("");

  const query = useQuery<PriceData>({
    queryKey: ["live-prices"],
    queryFn: fetchLivePrices,
    refetchInterval: getUpdateInterval(),
    staleTime: getUpdateInterval() - 60000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!query.data?.nextUpdate) return;

    const updateCountdown = () => {
      const nextUpdate = query.data?.nextUpdate;
      if (nextUpdate) {
        setCountdown(formatNextUpdate(nextUpdate));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [query.data?.nextUpdate]);

  const products = query.data?.products ?? [];
  const lastUpdated = query.data?.lastUpdated ?? null;
  const nextUpdate = query.data?.nextUpdate ?? null;

  const lastUpdatedText = lastUpdated ? formatLastUpdated(lastUpdated) : "Loading...";

  return {
    products,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isFetching: query.isFetching,
    error: query.error,
    lastUpdated,
    lastUpdatedText,
    nextUpdate,
    nextUpdateText: countdown,
    refetch: query.refetch,
  };
});

export function useFilteredProducts(
  category: string,
  sortBy: "roi" | "profit" | "price" = "roi"
) {
  const { products } = useProducts();

  return useMemo(() => {
    let filtered = [...products];

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    switch (sortBy) {
      case "roi":
        filtered.sort((a, b) => b.roi - a.roi);
        break;
      case "profit":
        filtered.sort((a, b) => b.profit - a.profit);
        break;
      case "price":
        filtered.sort((a, b) => a.amazonPrice - b.amazonPrice);
        break;
    }

    return filtered;
  }, [products, category, sortBy]);
}

export function useProductById(id: string): LiveProduct | undefined {
  const { products } = useProducts();
  return useMemo(() => products.find((p) => p.id === id), [products, id]);
}

export function useProductStats() {
  const { products } = useProducts();

  return useMemo(() => {
    if (products.length === 0) {
      return {
        totalProfit: 0,
        avgRoi: 0,
        topDeal: null as LiveProduct | null,
        totalDeals: 0,
        priceDrops: 0,
        priceIncreases: 0,
      };
    }

    const totalProfit = products.reduce((sum, p) => sum + p.profit, 0);
    const avgRoi = products.reduce((sum, p) => sum + p.roi, 0) / products.length;
    const topDeal = products.reduce((max, p) => (p.roi > max.roi ? p : max));
    const priceDrops = products.filter((p) => p.priceDirection === "down").length;
    const priceIncreases = products.filter((p) => p.priceDirection === "up").length;

    return {
      totalProfit,
      avgRoi,
      topDeal,
      totalDeals: products.length,
      priceDrops,
      priceIncreases,
    };
  }, [products]);
}

export function useSearchProducts(searchQuery: string) {
  const { products } = useProducts();

  return useMemo(() => {
    if (!searchQuery.trim()) return products;

    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);
}
