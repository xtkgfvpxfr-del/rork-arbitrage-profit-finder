import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  ArrowLeft,
  Heart,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Star,
  Package,
  DollarSign,
  Percent,
  ShoppingCart,
  BarChart3,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { mockProducts } from "@/mocks/products";
import { useWatchlist } from "@/contexts/WatchlistContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleWatched, isWatched } = useWatchlist();

  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === id);
  }, [id]);

  if (!product) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const watched = isWatched(product.id);
  const isProfitable = product.profit > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Product Details</Text>
          <Pressable
            style={styles.headerButton}
            onPress={() => toggleWatched(product.id)}
          >
            <Heart
              size={24}
              color={watched ? Colors.dark.loss : Colors.dark.text}
              fill={watched ? Colors.dark.loss : "transparent"}
            />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.ratingRow}>
              <Star size={16} color={Colors.dark.amazon} fill={Colors.dark.amazon} />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewsText}>
                ({product.reviews.toLocaleString()} reviews)
              </Text>
            </View>

            <View style={styles.profitCard}>
              <View style={styles.profitHeader}>
                <Text style={styles.profitLabel}>Estimated Profit</Text>
                <View
                  style={[
                    styles.roiBadge,
                    isProfitable ? styles.roiBadgePositive : styles.roiBadgeNegative,
                  ]}
                >
                  {isProfitable ? (
                    <TrendingUp size={14} color={Colors.dark.profit} />
                  ) : (
                    <TrendingDown size={14} color={Colors.dark.loss} />
                  )}
                  <Text
                    style={[
                      styles.roiText,
                      isProfitable ? styles.roiTextPositive : styles.roiTextNegative,
                    ]}
                  >
                    {product.roi}% ROI
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.profitValue,
                  isProfitable ? styles.profitPositive : styles.profitNegative,
                ]}
              >
                ${product.profit.toFixed(2)}
              </Text>
              <Text style={styles.profitSubtext}>per unit after fees</Text>
            </View>

            <Text style={styles.sectionTitle}>Price Breakdown</Text>

            <View style={styles.priceBreakdown}>
              <View style={[styles.priceCard, styles.amazonCard]}>
                <View style={styles.priceCardHeader}>
                  <Package size={18} color={Colors.dark.amazon} />
                  <Text style={styles.priceCardTitle}>Buy on Amazon</Text>
                </View>
                <Text style={styles.priceCardValue}>
                  ${product.amazonPrice.toFixed(2)}
                </Text>
                <View style={styles.priceDetail}>
                  <Text style={styles.priceDetailLabel}>Shipping</Text>
                  <Text style={styles.priceDetailValue}>
                    {product.amazonShipping === 0
                      ? "FREE"
                      : `$${product.amazonShipping.toFixed(2)}`}
                  </Text>
                </View>
                <View style={styles.priceDetail}>
                  <Text style={styles.priceDetailLabel}>Sales Rank</Text>
                  <Text style={styles.priceDetailValue}>
                    #{product.amazonSalesRank}
                  </Text>
                </View>
              </View>

              <View style={[styles.priceCard, styles.ebayCard]}>
                <View style={styles.priceCardHeader}>
                  <ShoppingCart size={18} color={Colors.dark.ebay} />
                  <Text style={styles.priceCardTitle}>Sell on eBay</Text>
                </View>
                <Text style={styles.priceCardValue}>
                  ${product.ebayPrice.toFixed(2)}
                </Text>
                <View style={styles.priceDetail}>
                  <Text style={styles.priceDetailLabel}>eBay Fees (~13%)</Text>
                  <Text style={styles.priceDetailValueNegative}>
                    -${product.ebayFees.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.priceDetail}>
                  <Text style={styles.priceDetailLabel}>Active Listings</Text>
                  <Text style={styles.priceDetailValue}>{product.ebayListings}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Market Data</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.dark.profitLight }]}>
                  <DollarSign size={18} color={Colors.dark.profit} />
                </View>
                <Text style={styles.statValue}>${product.profit.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Net Profit</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.dark.amazonLight }]}>
                  <Percent size={18} color={Colors.dark.amazon} />
                </View>
                <Text style={styles.statValue}>{product.roi}%</Text>
                <Text style={styles.statLabel}>ROI</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.dark.ebayLight }]}>
                  <BarChart3 size={18} color={Colors.dark.ebay} />
                </View>
                <Text style={styles.statValue}>{product.ebaySold.toLocaleString()}</Text>
                <Text style={styles.statLabel}>eBay Sold</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={styles.amazonButton}>
                <Package size={18} color={Colors.dark.background} />
                <Text style={styles.amazonButtonText}>View on Amazon</Text>
                <ExternalLink size={16} color={Colors.dark.background} />
              </Pressable>
              <Pressable style={styles.ebayButton}>
                <ShoppingCart size={18} color={Colors.dark.background} />
                <Text style={styles.ebayButtonText}>View on eBay</Text>
                <ExternalLink size={16} color={Colors.dark.background} />
              </Pressable>
            </View>

            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                * Prices and fees are estimates. Actual profits may vary based on shipping costs, condition, and market fluctuations.
              </Text>
            </View>
          </View>
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.dark.profit,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.dark.background,
    fontWeight: "600" as const,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  imageContainer: {
    position: "relative",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    backgroundColor: Colors.dark.card,
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  content: {
    paddingHorizontal: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    lineHeight: 32,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  profitCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  profitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profitLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: "500" as const,
  },
  roiBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  roiBadgePositive: {
    backgroundColor: Colors.dark.profitLight,
  },
  roiBadgeNegative: {
    backgroundColor: Colors.dark.lossLight,
  },
  roiText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  roiTextPositive: {
    color: Colors.dark.profit,
  },
  roiTextNegative: {
    color: Colors.dark.loss,
  },
  profitValue: {
    fontSize: 40,
    fontWeight: "700" as const,
    marginTop: 8,
  },
  profitPositive: {
    color: Colors.dark.profit,
  },
  profitNegative: {
    color: Colors.dark.loss,
  },
  profitSubtext: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginTop: 28,
    marginBottom: 16,
  },
  priceBreakdown: {
    gap: 12,
  },
  priceCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  amazonCard: {
    backgroundColor: Colors.dark.amazonLight,
    borderColor: Colors.dark.amazon + "40",
  },
  ebayCard: {
    backgroundColor: Colors.dark.ebayLight,
    borderColor: Colors.dark.ebay + "40",
  },
  priceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceCardTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
  },
  priceCardValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.dark.text,
    marginTop: 8,
    marginBottom: 12,
  },
  priceDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  priceDetailLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  priceDetailValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  priceDetailValueNegative: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.loss,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  actionButtons: {
    gap: 12,
    marginTop: 28,
  },
  amazonButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.amazon,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  amazonButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.background,
  },
  ebayButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.ebay,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  ebayButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.text,
  },
  disclaimer: {
    marginTop: 24,
    marginBottom: 40,
    padding: 16,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    lineHeight: 18,
  },
});
