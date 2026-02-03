import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import Colors from "@/constants/colors";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
}: StatsCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
});
