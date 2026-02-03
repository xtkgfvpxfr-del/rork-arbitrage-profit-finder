import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TrendingUp, DollarSign, Package, Zap, Clock, RefreshCw } from "lucide-react-native";
import Colors from "@/constants/colors";
import { categories } from "@/mocks/products";
import { useWatchlist } from "@/contexts/WatchlistContext";
import {
  useProducts,
  useFilteredProducts,
  useProductStats,
} from "@/contexts/ProductsContext";
import ProductCard from "@/components/ProductCard";
import StatsCard from "@/components/StatsCard";
import CategoryFilter from "@/components/CategoryFilter";

export default function DashboardScreen() {
  const router = useRouter();
  const { toggleWatched, isWatched } = useWatchlist();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    isLoading,
    isFetching,
    lastUpdatedText,
    nextUpdateText,
    refetch,
  } = useProducts();

  const filteredProducts = useFilteredProducts(selectedCategory, "roi");
  const stats = useProductStats();

  const onRefresh = async () => {
    console.log("[Dashboard] Manual refresh triggered");
    await refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.profit} />
        <Text style={styles.loadingText}>Fetching live prices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
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

          <View style={styles.updateBar}>
            <View style={styles.updateInfo}>
              <Clock size={14} color={Colors.dark.textSecondary} />
              <Text style={styles.updateText}>
                Updated {lastUpdatedText}
              </Text>
            </View>
            <View style={styles.updateInfo}>
              <RefreshCw size={14} color={Colors.dark.accent} />
              <Text style={styles.nextUpdateText}>
                Next update {nextUpdateText}
              </Text>
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
              value={stats.topDeal ? `${stats.topDeal.roi}%` : "-"}
              subtitle={stats.topDeal ? stats.topDeal.name.substring(0, 15) + "..." : "-"}
              icon={Zap}
              iconColor={Colors.dark.accent}
              iconBgColor={Colors.dark.accentLight}
            />
          </View>

          <View style={styles.priceAlertBar}>
            <View style={styles.priceAlertItem}>
              <View style={[styles.alertDot, styles.alertDotDown]} />
              <Text style={styles.priceAlertText}>
                {stats.priceDrops} price drops
              </Text>
            </View>
            <View style={styles.priceAlertItem}>
              <View style={[styles.alertDot, styles.alertDotUp]} />
              <Text style={styles.priceAlertText}>
                {stats.priceIncreases} price increases
              </Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
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
  updateBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  updateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  updateText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  nextUpdateText: {
    fontSize: 12,
    color: Colors.dark.accent,
    fontWeight: "500" as const,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  priceAlertBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 8,
  },
  priceAlertItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertDotDown: {
    backgroundColor: Colors.dark.profit,
  },
  alertDotUp: {
    backgroundColor: Colors.dark.loss,
  },
  priceAlertText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 16,
    marginTop: 8,
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
