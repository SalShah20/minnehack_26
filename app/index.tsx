/**
 * Entry screen.
 *
 * Handles initial routing:
 * - Redirect to tabs
 * - Optional intro splash
 * - Future onboarding entry
 *
 * Keep minimal — no game logic here.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";

import { generateScenario, roleplayReply } from "@/src/sdk/runanywhereClient";

export default function Index() {
  const [scenario, setScenario] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [reply, setReply] = useState("");
  const [stability, setStability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onGenerateScenario = async () => {
    setLoading(true);
    setError("");
    try {
      const { scenario } = await generateScenario({ realm: "Friend", difficulty: 3 });
      setScenario(scenario.description);
      setUserMessage("");
      setReply("");
      setStability(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const onRoleplay = async () => {
    if (!scenario.trim() || !userMessage.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await roleplayReply({
        scenario,
        userMessage,
        otherPersonVibe: "confused",
        speak: false,
      });

      setReply(res.reply);
      setStability(res.stability);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>MendQuest SDK Smoke Test</Text>

      {!!error && <Text style={styles.error}>Error: {error}</Text>}

      <Pressable style={styles.btn} onPress={onGenerateScenario} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Working..." : "Generate Scenario"}</Text>
      </Pressable>

      <Text style={styles.label}>Scenario</Text>
      <View style={styles.box}>
        <Text>{scenario || "(none yet)"}</Text>
      </View>

      <Text style={styles.label}>Your reply</Text>
      <TextInput
        style={styles.input}
        value={userMessage}
        onChangeText={setUserMessage}
        placeholder="Type your response…"
        multiline
      />

      <Pressable
        style={[styles.btn, (!scenario || !userMessage) && styles.btnDisabled]}
        onPress={onRoleplay}
        disabled={loading || !scenario || !userMessage}
      >
        <Text style={styles.btnText}>Roleplay Reply</Text>
      </Pressable>

      <Text style={styles.label}>Other person</Text>
      <View style={styles.box}>
        <Text>{reply || "(waiting)"}</Text>
      </View>

      <Text style={styles.label}>Stability</Text>
      <View style={styles.box}>
        <Text>{stability === null ? "(none yet)" : `${stability} / 100`}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  h1: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 14, fontWeight: "700" },
  box: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#fff", fontWeight: "700" },
  error: { color: "crimson", fontWeight: "600" },
});
