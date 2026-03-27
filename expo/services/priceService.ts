import { Product, fetchProductsFromApi } from "@/services/productApi";

export interface LiveProduct extends Product {
  amazonPriceChange: number;
  ebayPriceChange: number;
  lastUpdated: Date;
  priceDirection: "up" | "down" | "stable";
}

export interface PriceData {
  products: LiveProduct[];
  lastUpdated: Date;
  nextUpdate: Date;
}

const PRICE_FLUCTUATION_RANGE = 0.05;
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

let cachedProducts: Product[] | null = null;
let cachedPrices: Map<string, { amazonPrice: number; ebayPrice: number }> = new Map();
let lastFetchTime: Date | null = null;
let lastApiFetchTime: Date | null = null;
const API_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;

function generatePriceFluctuation(basePrice: number): number {
  const fluctuationPercent = (Math.random() - 0.5) * 2 * PRICE_FLUCTUATION_RANGE;
  const newPrice = basePrice * (1 + fluctuationPercent);
  return Math.round(newPrice * 100) / 100;
}

function calculateProfit(amazonPrice: number, ebayPrice: number, ebayFees: number): number {
  return Math.round((ebayPrice - amazonPrice - ebayFees) * 100) / 100;
}

function calculateROI(profit: number, amazonPrice: number): number {
  if (amazonPrice === 0) return 0;
  return Math.round((profit / amazonPrice) * 100 * 10) / 10;
}

export async function fetchLivePrices(): Promise<PriceData> {
  console.log("[PriceService] Fetching live prices...");

  const now = new Date();
  const shouldRefreshApi =
    !cachedProducts ||
    !lastApiFetchTime ||
    now.getTime() - lastApiFetchTime.getTime() >= API_REFRESH_INTERVAL_MS;

  if (shouldRefreshApi) {
    try {
      console.log("[PriceService] Fetching fresh product data from API...");
      cachedProducts = await fetchProductsFromApi();
      lastApiFetchTime = now;
      console.log(`[PriceService] Got ${cachedProducts.length} products from API`);
    } catch (error) {
      console.error("[PriceService] API fetch failed:", error);
      if (!cachedProducts) {
        throw new Error("Failed to fetch product data. Please check your connection.");
      }
      console.log("[PriceService] Using cached products as fallback");
    }
  } else {
    console.log("[PriceService] Using cached product data");
  }

  const baseProducts = cachedProducts!;
  const isFirstFetch = !lastFetchTime;
  const timeSinceLastFetch = lastFetchTime ? now.getTime() - lastFetchTime.getTime() : Infinity;
  const shouldUpdatePrices = timeSinceLastFetch >= UPDATE_INTERVAL_MS || isFirstFetch;

  console.log(`[PriceService] Time since last price update: ${Math.round(timeSinceLastFetch / 1000)}s`);
  console.log(`[PriceService] Should update prices: ${shouldUpdatePrices}`);

  const liveProducts: LiveProduct[] = baseProducts.map((product) => {
    const previousPrices = cachedPrices.get(product.id);

    let newAmazonPrice: number;
    let newEbayPrice: number;

    if (shouldUpdatePrices || !previousPrices) {
      newAmazonPrice = generatePriceFluctuation(product.amazonPrice);
      newEbayPrice = generatePriceFluctuation(product.ebayPrice);

      if (newEbayPrice <= newAmazonPrice) {
        newEbayPrice = newAmazonPrice * (1.15 + Math.random() * 0.25);
        newEbayPrice = Math.round(newEbayPrice * 100) / 100;
      }

      cachedPrices.set(product.id, {
        amazonPrice: newAmazonPrice,
        ebayPrice: newEbayPrice,
      });
    } else {
      newAmazonPrice = previousPrices.amazonPrice;
      newEbayPrice = previousPrices.ebayPrice;
    }

    const amazonPriceChange = previousPrices
      ? Math.round((newAmazonPrice - previousPrices.amazonPrice) * 100) / 100
      : 0;
    const ebayPriceChange = previousPrices
      ? Math.round((newEbayPrice - previousPrices.ebayPrice) * 100) / 100
      : 0;

    const ebayFeePercent = 0.13;
    const newEbayFees = Math.round(newEbayPrice * ebayFeePercent * 100) / 100;
    const newProfit = calculateProfit(newAmazonPrice, newEbayPrice, newEbayFees);
    const newRoi = calculateROI(newProfit, newAmazonPrice);

    let priceDirection: "up" | "down" | "stable" = "stable";
    if (amazonPriceChange < -0.5) priceDirection = "down";
    else if (amazonPriceChange > 0.5) priceDirection = "up";

    return {
      ...product,
      amazonPrice: newAmazonPrice,
      ebayPrice: newEbayPrice,
      ebayFees: newEbayFees,
      profit: newProfit,
      roi: newRoi,
      amazonPriceChange,
      ebayPriceChange,
      lastUpdated: now,
      priceDirection,
    };
  });

  if (shouldUpdatePrices) {
    lastFetchTime = now;
  }

  const nextUpdate = new Date(now.getTime() + UPDATE_INTERVAL_MS);

  console.log(`[PriceService] Processed ${liveProducts.length} live products`);
  console.log(`[PriceService] Next price update at: ${nextUpdate.toLocaleTimeString()}`);

  return {
    products: liveProducts,
    lastUpdated: now,
    nextUpdate,
  };
}

export function getUpdateInterval(): number {
  return UPDATE_INTERVAL_MS;
}

export function formatLastUpdated(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

export function formatNextUpdate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Any moment";
  if (diffMins < 60) return `in ${diffMins}m`;
  return `in ${diffHours}h ${diffMins % 60}m`;
}
