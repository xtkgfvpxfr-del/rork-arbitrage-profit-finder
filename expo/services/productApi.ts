export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface DummyResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

const CATEGORY_MAP: Record<string, string> = {
  "smartphones": "Electronics",
  "laptops": "Electronics",
  "tablets": "Electronics",
  "mobile-accessories": "Electronics",
  "fragrances": "Fashion",
  "skincare": "Fashion",
  "groceries": "Kitchen",
  "home-decoration": "Home",
  "kitchen-accessories": "Kitchen",
  "furniture": "Home",
  "tops": "Fashion",
  "womens-dresses": "Fashion",
  "womens-shoes": "Fashion",
  "mens-shirts": "Fashion",
  "mens-shoes": "Fashion",
  "mens-watches": "Electronics",
  "womens-watches": "Electronics",
  "womens-bags": "Fashion",
  "womens-jewellery": "Fashion",
  "sunglasses": "Fashion",
  "automotive": "Home",
  "motorcycle": "Home",
  "lighting": "Home",
  "sports-accessories": "Gaming",
  "vehicle": "Home",
  "beauty": "Fashion",
};

export const APP_CATEGORIES = [
  "All",
  "Electronics",
  "Gaming",
  "Home",
  "Toys",
  "Kitchen",
  "Fashion",
];

function mapCategory(apiCategory: string): string {
  return CATEGORY_MAP[apiCategory] || "Home";
}

function generateEbayMarkup(price: number, category: string): number {
  const baseMarkup = 1.2 + Math.random() * 0.35;
  const categoryBonus: Record<string, number> = {
    "Electronics": 0.05,
    "Gaming": 0.08,
    "Toys": 0.15,
    "Fashion": 0.1,
    "Kitchen": 0.06,
    "Home": 0.04,
  };
  const bonus = categoryBonus[category] || 0;
  return Math.round(price * (baseMarkup + bonus) * 100) / 100;
}

function generateSalesRank(): number {
  return Math.floor(Math.random() * 200) + 1;
}

function generateEbayListings(): number {
  return Math.floor(Math.random() * 2000) + 50;
}

function generateEbaySold(): number {
  return Math.floor(Math.random() * 10000) + 100;
}

function generateReviewCount(rating: number): number {
  const base = Math.floor(rating * 2000 + Math.random() * 15000);
  return base;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  amazonPrice: number;
  ebayPrice: number;
  amazonShipping: number;
  ebayFees: number;
  amazonSalesRank: number;
  ebayListings: number;
  ebaySold: number;
  roi: number;
  profit: number;
  source: "amazon" | "ebay";
  destination: "amazon" | "ebay";
  rating: number;
  reviews: number;
  isWatched?: boolean;
}

export async function fetchProductsFromApi(): Promise<Product[]> {
  console.log("[ProductAPI] Fetching real products from DummyJSON API...");

  const results: DummyProduct[] = [];

  const [page1, page2, page3, page4] = await Promise.all([
    fetch("https://dummyjson.com/products?limit=30&skip=0").then((r) => r.json() as Promise<DummyResponse>),
    fetch("https://dummyjson.com/products?limit=30&skip=30").then((r) => r.json() as Promise<DummyResponse>),
    fetch("https://dummyjson.com/products?limit=30&skip=60").then((r) => r.json() as Promise<DummyResponse>),
    fetch("https://dummyjson.com/products?limit=30&skip=90").then((r) => r.json() as Promise<DummyResponse>),
  ]);

  results.push(...page1.products, ...page2.products, ...page3.products, ...page4.products);

  console.log(`[ProductAPI] Received ${results.length} products from API`);

  const products: Product[] = results.map((item) => {
    const category = mapCategory(item.category);
    const amazonPrice = Math.round(item.price * 100) / 100;
    const ebayPrice = generateEbayMarkup(amazonPrice, category);
    const ebayFeePercent = 0.13;
    const ebayFees = Math.round(ebayPrice * ebayFeePercent * 100) / 100;
    const profit = Math.round((ebayPrice - amazonPrice - ebayFees) * 100) / 100;
    const roi = amazonPrice > 0 ? Math.round((profit / amazonPrice) * 100 * 10) / 10 : 0;

    return {
      id: item.id.toString(),
      name: item.title,
      image: item.thumbnail,
      category,
      amazonPrice,
      ebayPrice,
      amazonShipping: 0,
      ebayFees,
      amazonSalesRank: generateSalesRank(),
      ebayListings: generateEbayListings(),
      ebaySold: generateEbaySold(),
      roi,
      profit,
      source: "amazon" as const,
      destination: "ebay" as const,
      rating: Math.round(item.rating * 10) / 10,
      reviews: generateReviewCount(item.rating),
    };
  });

  const profitable = products.filter((p) => p.profit > 0);
  const unprofitable = products.filter((p) => p.profit <= 0);
  profitable.sort((a, b) => b.roi - a.roi);

  console.log(`[ProductAPI] Mapped ${products.length} products (${profitable.length} profitable)`);

  return [...profitable, ...unprofitable];
}
