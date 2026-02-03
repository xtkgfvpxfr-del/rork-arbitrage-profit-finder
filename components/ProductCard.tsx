import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { TrendingUp, TrendingDown, Heart, ArrowRight, ChevronDown, ChevronUp } from "lucide-react-native";
import { LiveProduct } from "@/services/priceService";
import Colors from "@/constants/colors";

interface ProductCardProps {
  product: LiveProduct;
  onPress: () => void;
  onToggleWatch: () => void;
  isWatched: boolean;
}

export default function ProductCard({
  product,
  onPress,
  onToggleWatch,
  isWatched,
}: ProductCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const isProfitable = product.profit > 0;
  const hasAmazonChange = Math.abs(product.amazonPriceChange || 0) > 0.01;
  const hasEbayChange = Math.abs(product.ebayPriceChange || 0) > 0.01;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderPriceChange = (change: number, isAmazon: boolean) => {
    if (Math.abs(change) < 0.01) return null;
    
    const isDown = change < 0;
    const color = isAmazon 
      ? (isDown ? Colors.dark.profit : Colors.dark.loss)
      : (isDown ? Colors.dark.loss : Colors.dark.profit);
    
    return (
      <View style={styles.priceChangeContainer}>
        {isDown ? (
          <ChevronDown size={10} color={color} />
        ) : (
          <ChevronUp size={10} color={color} />
        )}
        <Text style={[styles.priceChangeText, { color }]}>
          ${Math.abs(change).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleWatch();
            }}
            style={styles.heartButton}
          >
            <Heart
              size={18}
              color={isWatched ? Colors.dark.loss : Colors.dark.textMuted}
              fill={isWatched ? Colors.dark.loss : "transparent"}
            />
          </Pressable>
          {product.priceDirection === "down" && (
            <View style={styles.priceDropBadge}>
              <ChevronDown size={10} color="#fff" />
              <Text style={styles.priceDropText}>DROP</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.priceFlow}>
            <View style={[styles.priceBadge, styles.amazonBadge]}>
              <Text style={styles.priceLabel}>Amazon</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>${product.amazonPrice.toFixed(2)}</Text>
                {hasAmazonChange && renderPriceChange(product.amazonPriceChange, true)}
              </View>
            </View>
            <ArrowRight size={16} color={Colors.dark.textMuted} />
            <View style={[styles.priceBadge, styles.ebayBadge]}>
              <Text style={styles.priceLabel}>eBay</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>${product.ebayPrice.toFixed(2)}</Text>
                {hasEbayChange && renderPriceChange(product.ebayPriceChange, false)}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View
              style={[
                styles.profitBadge,
                isProfitable ? styles.profitPositive : styles.profitNegative,
              ]}
            >
              {isProfitable ? (
                <TrendingUp size={14} color={Colors.dark.profit} />
              ) : (
                <TrendingDown size={14} color={Colors.dark.loss} />
              )}
              <Text
                style={[
                  styles.profitText,
                  isProfitable ? styles.profitTextPositive : styles.profitTextNegative,
                ]}
              >
                ${product.profit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.roiBadge}>
              <Text style={styles.roiText}>{product.roi}% ROI</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  pressable: {
    flexDirection: "row",
    padding: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
  },
  heartButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 6,
  },
  priceDropBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.profit,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  priceDropText: {
    fontSize: 8,
    fontWeight: "700" as const,
    color: "#fff",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  category: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.dark.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.text,
    marginTop: 4,
    lineHeight: 18,
  },
  priceFlow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  priceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amazonBadge: {
    backgroundColor: Colors.dark.amazonLight,
  },
  ebayBadge: {
    backgroundColor: Colors.dark.ebayLight,
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: "500" as const,
    color: Colors.dark.textSecondary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  priceChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceChangeText: {
    fontSize: 9,
    fontWeight: "600" as const,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  profitBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  profitPositive: {
    backgroundColor: Colors.dark.profitLight,
  },
  profitNegative: {
    backgroundColor: Colors.dark.lossLight,
  },
  profitText: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
  profitTextPositive: {
    color: Colors.dark.profit,
  },
  profitTextNegative: {
    color: Colors.dark.loss,
  },
  roiBadge: {
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roiText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
  },
});
