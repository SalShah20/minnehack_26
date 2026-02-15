/**
 * Roleplay Screen (Game Mode).
 *
 * AI simulates the other person’s response.
 * Displays:
 * - Chat interface
 * - Stability score
 *
 * Updates XP based on outcome.
 */
import React, {useMemo, useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert, Pressable} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { roleplayReply } from "@/src/sdk/runanywhereClient.web";

type ChatMsg = {
    who: "you" | "them";
    text: string;
};

const vibeOptions = ["defensive", "hurt", "busy", "confused"] as const;
type Vibe = (typeof vibeOptions)[number];

export default function PlayRoleplayScreen() {
  const params = useLocalSearchParams<{
    scenario?: string;
    userMessage?: string;
    vibe?: string;}>();

  const scenario = params.scenario ?? "";
  const initialUserMessage = params.userMessage ?? "";
  const initialVibe = (vibeOptions.includes(params.vibe as Vibe) ? (params.vibe as Vibe) : "confused");
  const [vibe, setVibe] = useState<Vibe>(initialVibe);
  const [speak, setSpeak] = useState(false);
  const [stability, setStability] = useState(55);
  const [input, setInput] = useState(initialUserMessage);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>
  (initialUserMessage? [{ who: "you", text: initialUserMessage }]: []);

  const canSend = useMemo(
    () => !!scenario.trim() && !!input.trim() && !loading,
    [scenario, input, loading]
);

const send = async () => {
    if (!scenario.trim()) {
      Alert.alert("Missing scenario", "Pass a scenario into this screen.");
      return;
    }

    const userText = input.trim();
    if (!userText) return;
    
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { who: "you", text: userText }]);

    try {
        const out = await roleplayReply({
        scenario,
        userMessage: userText,
        otherPersonVibe: vibe,
        speak,
      });

    setStability(out.stability);
    setMessages((prev) => [...prev, { who: "them", text: out.reply }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { who: "them", text: "…I’m not sure what to say right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.screen}>
        <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Roleplay</Text>
          <Text style={styles.sub}>Stability: {stability}/100</Text>
        </View>


    <View style={styles.speakRow}>
        <Text style={styles.speakLabel}>Speak</Text>
        <Switch value={speak} onValueChange={setSpeak} />
        </View>
        </View>

      <View style={styles.vibeRow}>
        {vibeOptions.map((v) => {
          const active = vibe === v;
          return (
            <TouchableOpacity
              key={v}
              style={[styles.vibeChip, active && styles.vibeChipActive]}
              onPress={() => setVibe(v)}
              disabled={loading}
            >
              <Text style={[styles.vibeText, active && styles.vibeTextActive]}>
                {v}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.scenarioBox}>
        <Text style={styles.scenarioLabel}>Scenario</Text>
        <Text style={styles.scenarioText}>
          {scenario ? scenario : "No scenario passed in."}
        </Text>
      </View>

      <ScrollView style={styles.chat} contentContainerStyle={{ paddingBottom: 16 }}>
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              m.who === "you" ? styles.bubbleYou : styles.bubbleThem,
            ]}
          >
            <Text style={styles.bubbleText}>{m.text}</Text>
          </View>
        ))}
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
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your reply…"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !canSend && { opacity: 0.5 }]}
          onPress={send}
          disabled={!canSend}
        >
          <Text style={styles.sendText}>{loading ? "…" : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
      row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  screen: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  sub: { marginTop: 2, color: "#666" },

  speakRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  speakLabel: { color: "#111" },

  vibeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  vibeChip: {
    borderWidth: 1,
    borderColor: "#E5E5F8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  vibeChipActive: { backgroundColor: "#E5E5F8" },
  vibeText: { color: "#333", fontWeight: "600" },
  vibeTextActive: { color: "#6B5DD2" },

  scenarioBox: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F7F7FB",
    borderWidth: 1,
    borderColor: "#EFEFF7",
  },
  scenarioLabel: { fontSize: 12, color: "#666", marginBottom: 6 },
  scenarioText: { color: "#111" },

  chat: { flex: 1, paddingHorizontal: 16 },

  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  bubbleYou: {
    alignSelf: "flex-end",
    backgroundColor: "#6B5DD2",
  },
  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5F8",
  },
  bubbleText: { color: "#fff" },

  composer: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#E5E5F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  sendBtn: {
    backgroundColor: "#FF8A65",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sendText: { color: "#fff", fontWeight: "700" },
  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },
});