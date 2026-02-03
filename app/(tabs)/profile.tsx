import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  TrendingUp,
  Package,
} from "lucide-react-native";
import Colors from "@/constants/colors";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  isDestructive = false,
}: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemIcon}>{icon}</View>
      <View style={styles.menuItemContent}>
        <Text
          style={[styles.menuItemTitle, isDestructive && styles.destructiveText]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && (
        <ChevronRight size={20} color={Colors.dark.textMuted} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" }}
                style={styles.avatar}
              />
              <View style={styles.proBadge}>
                <Crown size={12} color={Colors.dark.background} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <Text style={styles.profileEmail}>alex@arbitrage.pro</Text>
              <View style={styles.proPill}>
                <Crown size={12} color={Colors.dark.amazon} />
                <Text style={styles.proText}>PRO Member</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.dark.profitLight }]}>
                <TrendingUp size={18} color={Colors.dark.profit} />
              </View>
              <Text style={styles.statValue}>$2,847</Text>
              <Text style={styles.statLabel}>Total Profit</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.dark.amazonLight }]}>
                <Package size={18} color={Colors.dark.amazon} />
              </View>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Items Sold</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={<User size={20} color={Colors.dark.text} />}
                title="Edit Profile"
                subtitle="Name, email, photo"
              />
              <MenuItem
                icon={<CreditCard size={20} color={Colors.dark.text} />}
                title="Subscription"
                subtitle="PRO plan - Renews Dec 15"
              />
              <MenuItem
                icon={<Bell size={20} color={Colors.dark.text} />}
                title="Notifications"
                subtitle="Price alerts, new deals"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={<Settings size={20} color={Colors.dark.text} />}
                title="Settings"
                subtitle="App preferences"
              />
              <MenuItem
                icon={<HelpCircle size={20} color={Colors.dark.text} />}
                title="Help & Support"
                subtitle="FAQs, contact us"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={<LogOut size={20} color={Colors.dark.loss} />}
                title="Sign Out"
                showChevron={false}
                isDestructive
              />
            </View>
          </View>

          <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.dark.surfaceLight,
  },
  proBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.amazon,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.dark.card,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.amazonLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
    gap: 4,
  },
  proText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.amazon,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
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
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.dark.text,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: Colors.dark.loss,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 32,
    marginBottom: 24,
  },
});
