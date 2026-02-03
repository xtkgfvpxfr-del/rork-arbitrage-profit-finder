import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Colors from "@/constants/colors";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selected === category;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
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
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
  },
  chipTextSelected: {
    color: Colors.dark.background,
  },
});
