import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TrendingUp, DollarSign, Package, Zap } from "lucide-react-native";
import Colors from "@/constants/colors";
import { mockProducts, categories } from "@/mocks/products";
import { useWatchlist } from "@/contexts/WatchlistContext";
import ProductCard from "@/components/ProductCard";
import StatsCard from "@/components/StatsCard";
import CategoryFilter from "@/components/CategoryFilter";

export default function DashboardScreen() {
  const router = useRouter();
  const { toggleWatched, isWatched } = useWatchlist();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];
    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }
    return products.sort((a, b) => b.roi - a.roi);
  }, [selectedCategory]);

  const stats = useMemo(() => {
    const totalProfit = mockProducts.reduce((sum, p) => sum + p.profit, 0);
    const avgRoi = mockProducts.reduce((sum, p) => sum + p.roi, 0) / mockProducts.length;
    const topDeal = mockProducts.reduce((max, p) => (p.roi > max.roi ? p : max));
    return { totalProfit, avgRoi, topDeal, totalDeals: mockProducts.length };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dark.profit}
            />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.title}>Arbitrage Finder</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Total Potential"
              value={`$${stats.totalProfit.toFixed(0)}`}
              subtitle="From all deals"
              icon={DollarSign}
              iconColor={Colors.dark.profit}
              iconBgColor={Colors.dark.profitLight}
            />
            <View style={{ width: 12 }} />
            <StatsCard
              title="Avg. ROI"
              value={`${stats.avgRoi.toFixed(1)}%`}
              subtitle="Per item"
              icon={TrendingUp}
              iconColor={Colors.dark.amazon}
              iconBgColor={Colors.dark.amazonLight}
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title="Active Deals"
              value={stats.totalDeals.toString()}
              subtitle="Products found"
              icon={Package}
              iconColor={Colors.dark.ebay}
              iconBgColor={Colors.dark.ebayLight}
            />
            <View style={{ width: 12 }} />
            <StatsCard
              title="Best ROI"
              value={`${stats.topDeal.roi}%`}
              subtitle={stats.topDeal.name.substring(0, 15) + "..."}
              icon={Zap}
              iconColor={Colors.dark.accent}
              iconBgColor={Colors.dark.accentLight}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Opportunities</Text>
            <Text style={styles.sectionSubtitle}>Sorted by ROI</Text>
          </View>

          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
              onToggleWatch={() => toggleWatched(product.id)}
              isWatched={isWatched(product.id)}
            />
          ))}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginTop: 4,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.profitLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.profit,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.profit,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  bottomSpacing: {
    height: 24,
  },
});
