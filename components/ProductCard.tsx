import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { TrendingUp, TrendingDown, Heart, ArrowRight } from "lucide-react-native";
import { Product } from "@/mocks/products";
import Colors from "@/constants/colors";

interface ProductCardProps {
  product: Product;
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
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.priceFlow}>
            <View style={[styles.priceBadge, styles.amazonBadge]}>
              <Text style={styles.priceLabel}>Amazon</Text>
              <Text style={styles.priceValue}>${product.amazonPrice.toFixed(2)}</Text>
            </View>
            <ArrowRight size={16} color={Colors.dark.textMuted} />
            <View style={[styles.priceBadge, styles.ebayBadge]}>
              <Text style={styles.priceLabel}>eBay</Text>
              <Text style={styles.priceValue}>${product.ebayPrice.toFixed(2)}</Text>
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
  priceValue: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.dark.text,
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
