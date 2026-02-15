import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";

import { generateDraftOptions } from "@/src/sdk/runanywhereClient.web";
import type { DraftOption } from "@/src/types/api";
import type { Goal, Relationship } from "@/src/sdk/prompts";

type Params = {
  scenario?: string;
  goal?: Goal;
  relationship?: Relationship;
};

export default function DraftsScreen() {
  const params = useLocalSearchParams<Params>();

  const scenario = typeof params.scenario === "string" ? params.scenario : "";
  const goal = typeof params.goal === "string" ? (params.goal as Goal) : "Clarify";
  const relationship =
    typeof params.relationship === "string"
      ? (params.relationship as Relationship)
      : "Unspecified";

  const [options, setOptions] = useState<DraftOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await generateDraftOptions({
          scenario: scenario || "Describe what happened briefly.",
          goal,
          relationship,
        });
        if (!cancelled) setOptions(res.options ?? []);
      } catch (e) {
        console.error(e);
        Alert.alert("Failed to generate drafts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [scenario, goal, relationship]);

  const openEditor = (opt: DraftOption) => {
    // Expo Router params must be serializable (strings).
    router.push({
      pathname: "/repair/editor",
      params: { draft: JSON.stringify(opt) },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Generating drafts...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {options.length === 0 ? (
        <Text style={{ color: "#666" }}>
          No drafts returned. Try changing the prompt and retry.
        </Text>
      ) : null}

      {options.map((opt, i) => (
        <View key={`${opt.label}-${i}`} style={styles.card}>
          <TouchableOpacity onPress={() => openEditor(opt)}>
            <Text style={styles.label}>{opt.label}</Text>
            <Text style={styles.text}>{opt.text}</Text>
            <Text style={styles.why}>{opt.whyItWorks}</Text>
            <Text style={styles.tapHint}>Tap to edit →</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.row}>
        <Link href="/(tabs)/buddy" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Buddy</Text>
          </Pressable>
        </Link>

        <Link href="/repair/intake" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Repair Mode</Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/play" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Play</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 10 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    backgroundColor: "#E5E5F8",
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },

  label: { fontSize: 16, fontWeight: "700", color: "#6B5DD2" },
  text: { fontSize: 16, lineHeight: 22 },
  why: { fontSize: 12, color: "#666" },
  tapHint: { marginTop: 8, fontSize: 12, fontWeight: "700", color: "#3B2FA8" },

  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },
});