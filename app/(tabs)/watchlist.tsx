import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Heart, TrendingUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import { mockProducts } from "@/mocks/products";
import { useWatchlist } from "@/contexts/WatchlistContext";
import ProductCard from "@/components/ProductCard";

export default function WatchlistScreen() {
  const router = useRouter();
  const { watchedIds, toggleWatched, isWatched } = useWatchlist();

  const watchedProducts = useMemo(() => {
    return mockProducts.filter((p) => watchedIds.includes(p.id));
  }, [watchedIds]);

  const totalPotentialProfit = useMemo(() => {
    return watchedProducts.reduce((sum, p) => sum + p.profit, 0);
  }, [watchedProducts]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Watchlist</Text>
          <Text style={styles.subtitle}>
            {watchedProducts.length} items saved
          </Text>
        </View>

        {watchedProducts.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <TrendingUp size={24} color={Colors.dark.profit} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Total Potential Profit</Text>
              <Text style={styles.summaryValue}>
                ${totalPotentialProfit.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        <FlatList
          data={watchedProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
              onToggleWatch={() => toggleWatched(item.id)}
              isWatched={isWatched(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Heart size={48} color={Colors.dark.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No saved items</Text>
              <Text style={styles.emptySubtitle}>
                Tap the heart icon on any product to add it to your watchlist
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.profitLight,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.profit,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.profit + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryContent: {
    marginLeft: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.dark.profit,
    fontWeight: "500" as const,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.dark.profit,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
