/**
 * Editor Screen (Helper Mode).
 *
 * Editable message with:
 * - Live Heat + Repair meters
 * - Repair tools bar
 *
 * Calls scoreMessage() on debounce.
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

import Meter from "@/src/components/ui/Meter";
import { scoreMessage } from "@/src/engine/scoring/scoreMessage";
import type { DraftOption } from "@/src/types/api";

export default function Editor() {
  const { draft } = useLocalSearchParams<{ draft?: string }>();

  const parsedDraft: DraftOption | null = useMemo(() => {
    if (!draft || typeof draft !== "string") return null;
    try {
      return JSON.parse(draft) as DraftOption;
    } catch {
      return null;
    }
  }, [draft]);

  const [message, setMessage] = useState<string>(() => parsedDraft?.text ?? "");
  const [heat, setHeat] = useState<number>(0);
  const [repair, setRepair] = useState<number>(0);

  // If user navigates here with a different draft, update editor text
  useEffect(() => {
    setMessage(parsedDraft?.text ?? "");
  }, [parsedDraft?.text]);

  // Debounced scoring
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const s = scoreMessage(message);
        setHeat(s.heat);
        setRepair(s.repair);
      } catch (e) {
        console.log("Scoring failed", e);
      }
    }, 450);

    return () => clearTimeout(t);
  }, [message]);

  const addTool = (tool: string) => {
    setMessage((prev: string) => (prev.trim() ? `${prev} ${tool}` : tool));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editing Draft</Text>

      {parsedDraft?.label ? (
        <Text style={styles.subtitle}>{parsedDraft.label}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        multiline
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
      />

      <View style={styles.meters}>
        <Meter label="Heat" value={heat} />
        <Meter label="Repair" value={repair} />
      </View>

      <View style={styles.toolsBar}>
        {["Empathize", "Apologize", "Clarify", "Set Boundary"].map((tool) => (
          <TouchableOpacity
            key={tool}
            style={styles.toolButton}
            onPress={() => addTool(tool)}
          >
            <Text style={styles.toolText}>{tool}</Text>
          </TouchableOpacity>
        ))}
      </View>

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

        <Link href="/(tabs)/home" asChild>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Home</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },

  title: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 14, fontWeight: "700", color: "#6B5DD2" },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5F8",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 140,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },

  meters: { gap: 12 },

  toolsBar: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  toolButton: {
    backgroundColor: "#FF8A65",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  toolText: { color: "#6B5DD2", fontWeight: "600" },

  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },
});