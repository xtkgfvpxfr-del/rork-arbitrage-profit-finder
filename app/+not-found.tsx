import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertCircle size={48} color={Colors.dark.textMuted} />
        </View>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  link: {
    marginTop: 24,
    backgroundColor: Colors.dark.profit,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.dark.background,
  },
});
