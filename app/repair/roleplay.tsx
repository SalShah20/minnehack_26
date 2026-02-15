import React, { useMemo, useState } from "react";
import { View, Pressable, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { roleplayReply } from "../../src/sdk/runanywhereClient.web";
import type { OtherPersonVibe } from "../../src/sdk/prompts";
import {Link} from "expo-router";

type Params = {
  scenario?: string;
  userMessage?: string;
  otherPersonVibe?: OtherPersonVibe;
};

export default function RepairRoleplayScreen({ route, navigation }: any) {
  const params: Params = route?.params ?? {};

  const [scenario, setScenario] = useState<string>(
    params.scenario ??
      "You and a friend had plans. They left you on read all day, but you saw them posting online."
  );

  const [userMessage, setUserMessage] = useState<string>(
    params.userMessage ?? "Hey—are we still on for today? I wasn’t sure what happened."
  );

  const [vibe, setVibe] = useState<OtherPersonVibe>(params.otherPersonVibe ?? "confused");
  const [speak, setSpeak] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string>("");
  const [stability, setStability] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const vibeOptions: OtherPersonVibe[] = useMemo(
    () => ["defensive", "hurt", "busy", "confused"],
    []
  );

  async function onRun() {
    setLoading(true);
    setError("");

    try {
      const out = await roleplayReply({
        scenario,
        userMessage,
        otherPersonVibe: vibe,
        speak,
      });

      setReply(out.reply);
      setStability(out.stability);
    } catch (e: any) {
      setError(e?.message ?? "Roleplay failed");
      setReply("");
      setStability(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Roleplay</Text>
      <Text style={styles.sub}>Test how the other person might respond.</Text>

      <Text style={styles.label}>Scenario</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={scenario}
        onChangeText={setScenario}
        multiline
      />

      <Text style={styles.label}>Your message</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={userMessage}
        onChangeText={setUserMessage}
        multiline
      />

      <View style={styles.row}>
        <Text style={styles.label}>Other person vibe</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {vibeOptions.map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setVibe(v)}
              style={[styles.chip, vibe === v && styles.chipActive]}
            >
              <Text style={[styles.chipText, vibe === v && styles.chipTextActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.row, { alignItems: "center", justifyContent: "space-between" }]}>
        <Text style={styles.label}>Speak reply</Text>
        <Switch value={speak} onValueChange={setSpeak} />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onRun}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Generating..." : "Run roleplay"}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {reply ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Other person says</Text>
          <Text style={styles.reply}>{reply}</Text>

          {stability !== null ? (
            <Text style={styles.stability}>Stability: {stability}/100</Text>
          ) : null}
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.linkBtn]}
        onPress={() => navigation?.goBack?.()}
      >
        <Text style={styles.linkText}>← Back</Text>
      </TouchableOpacity>
      {/* Quick navigation row */}
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
  container: { padding: 16, gap: 12 },
  h1: { fontSize: 24, fontWeight: "700" },
  sub: { color: "#555", marginBottom: 8 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },

  row: { gap: 8 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#6B5DD2", borderColor: "#6B5DD2" },
  chipText: { color: "#333", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  button: {
    backgroundColor: "#FF8A65",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#111", fontWeight: "700", fontSize: 16 },

  card: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#fff",
    gap: 8,
    marginTop: 8,
  },
  cardTitle: { fontWeight: "700" },
  reply: { fontSize: 16, lineHeight: 22 },
  stability: { marginTop: 4, fontWeight: "700" },

  error: { color: "crimson" },

  linkBtn: { paddingVertical: 10 },
  linkText: { color: "#6B5DD2", fontWeight: "700" },
});
