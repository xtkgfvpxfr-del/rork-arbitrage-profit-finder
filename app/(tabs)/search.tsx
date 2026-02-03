import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, X, SlidersHorizontal } from "lucide-react-native";
import Colors from "@/constants/colors";
import { mockProducts, categories } from "@/mocks/products";
import { useWatchlist } from "@/contexts/WatchlistContext";
import ProductCard from "@/components/ProductCard";

type SortOption = "roi" | "profit" | "price";

export default function SearchScreen() {
  const router = useRouter();
  const { toggleWatched, isWatched } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("roi");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "roi":
        products.sort((a, b) => b.roi - a.roi);
        break;
      case "profit":
        products.sort((a, b) => b.profit - a.profit);
        break;
      case "price":
        products.sort((a, b) => a.amazonPrice - b.amazonPrice);
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Products</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.dark.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={Colors.dark.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <X size={20} color={Colors.dark.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal
              size={20}
              color={showFilters ? Colors.dark.background : Colors.dark.text}
            />
          </Pressable>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.filterChips}>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.chip,
                    selectedCategory === cat && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === cat && styles.chipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.filterChips}>
              {[
                { key: "roi" as SortOption, label: "Best ROI" },
                { key: "profit" as SortOption, label: "Highest Profit" },
                { key: "price" as SortOption, label: "Lowest Price" },
              ].map((option) => (
                <Pressable
                  key={option.key}
                  style={[styles.chip, sortBy === option.key && styles.chipSelected]}
                  onPress={() => setSortBy(option.key)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      sortBy === option.key && styles.chipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredProducts.length} results found
          </Text>
        </View>

        <FlatList
          data={filteredProducts}
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
              <Search size={48} color={Colors.dark.textMuted} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    paddingVertical: 14,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.dark.profit,
    borderColor: Colors.dark.profit,
  },
  filtersContainer: {
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
    marginBottom: 10,
    marginTop: 4,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipSelected: {
    backgroundColor: Colors.dark.profit,
    borderColor: Colors.dark.profit,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.dark.textSecondary,
  },
  chipTextSelected: {
    color: Colors.dark.background,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.dark.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
});
