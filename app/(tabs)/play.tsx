/**
 * Play Mode (Practice Game) root screen.
 *
 * Displays:
 * - Scenario selection
 * - Start game button
 *
 * Routes into:
 * - /play/scenario

 */
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link, router } from "expo-router";

export default function PlayTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play</Text>
      <Text style={styles.subtitle}>
        Practice scenarios, roleplay, and earn XP.
      </Text>

      {/* Primary flows */}
      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push("/play/scenario")}
      >
        <Text style={styles.primaryButtonText}>Start a Scenario</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/play/roleplay")}
      >
        <Text style={styles.secondaryButtonText}>Jump to Roleplay</Text>
      </Pressable>

      {/* Helpful note */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested flow</Text>
        <Text style={styles.cardBody}>
          1) Generate a scenario → 2) Send your reply → 3) See score + buddy mood
          → 4) Try again for improvement XP.
        </Text>
      </View>
      {/* Quick navigation row */}
      <View style={styles.row}>
        <Link href="/(tabs)/buddy" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Game</Text>
          </Pressable>
        </Link>

        <Link href="/repair/intake" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Buddy</Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/home" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 14 },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: "#666" },

  primaryButton: {
    backgroundColor: "#6B5DD2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  secondaryButton: {
    backgroundColor: "#E5E5F8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#3B2FA8", fontWeight: "700", fontSize: 16 },

  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },

  card: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 14,
    padding: 12,
  },
  cardTitle: { fontWeight: "800", marginBottom: 6 },
  cardBody: { color: "#555", lineHeight: 20 },
});