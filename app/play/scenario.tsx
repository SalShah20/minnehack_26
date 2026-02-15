/**
 * Scenario Screen (Game Mode).
 *
 * Displays:
 * - Random or selected scenario
 * - Emotion tags + difficulty
 * - Response input box
 *
 * On submit:
 * - Calls scoreMessage()
 * - Navigates to score screen
 */
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView , Pressable} from "react-native";
import { router, Link } from "expo-router";
import { generateScenario } from "../../src/sdk/runanywhereClient.web";
import type { ScenarioRealm } from "../../src/types/api";

const realms: ScenarioRealm[] = ["Friend", "Family", "Partner", "Work/School", "Roommate"];
const difficulties: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

export default function PlayScenarioScreen() {
  const [realm, setRealm] = useState<ScenarioRealm>("Friend");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);

  const [loading, setLoading] = useState(false);
  const [scenarioText, setScenarioText] = useState<string>("");

  const generate = async () => {
    setLoading(true);
    try {
      const out = await generateScenario({ realm, difficulty });
      setScenarioText(out.scenario.description);
    } catch (e) {
      console.error(e);
      setScenarioText(
        "You texted a friend about plans, and they left you on read all day. Later you see them posting online. You want to address it without starting a fight."
      );
    } finally {
      setLoading(false);
    }
  };

  const start = () => {
    router.push({
      pathname: "/play/roleplay",
      params: {
        scenario: scenarioText,
        vibe: "confused",
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Play Mode</Text>
      <Text style={styles.sub}>Generate a scenario, then roleplay it.</Text>

      <Text style={styles.section}>Realm</Text>
      <View style={styles.rowWrap}>
        {realms.map((r) => {
          const active = r === realm;
          return (
            <TouchableOpacity
              key={r}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setRealm(r)}
              disabled={loading}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          );
        })}
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
                    <Text style={styles.chipText}>Repair Mode</Text>
                  </Pressable>
                </Link>
        
                <Link href="/(tabs)/home" asChild>
                  <Pressable style={styles.chip}>
                    <Text style={styles.chipText}>Home</Text>
                  </Pressable>
                </Link>
              </View>

      <Text style={styles.section}>Difficulty</Text>
      <View style={styles.row}>
        {difficulties.map((d) => {
          const active = d === difficulty;
          return (
            <TouchableOpacity
              key={d}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setDifficulty(d)}
              disabled={loading}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={generate} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.primaryText}>Generate Scenario</Text>}
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Scenario</Text>
        <Text style={styles.cardText}>
          {scenarioText ? scenarioText : "Tap “Generate Scenario” to create one."}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.secondaryBtn, !scenarioText && { opacity: 0.5 }]}
        onPress={start}
        disabled={!scenarioText}
      >
        <Text style={styles.secondaryText}>Start Roleplay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#111" },
  sub: { color: "#666", marginTop: -6 },

  section: { marginTop: 6, fontSize: 14, fontWeight: "700", color: "#111" },

  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  rowWrap: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  chip: {
    borderWidth: 1,
    borderColor: "#E5E5F8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#E5E5F8" },
  chipText: { color: "#333", fontWeight: "600" },
  chipTextActive: { color: "#6B5DD2" },

  primaryBtn: {
    backgroundColor: "#FF8A65",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  card: {
    borderWidth: 1,
    borderColor: "#EFEFF7",
    backgroundColor: "#F7F7FB",
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  cardLabel: { fontSize: 12, color: "#666", marginBottom: 6 },
  cardText: { color: "#111" },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#E5E5F8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryText: { color: "#6B5DD2", fontWeight: "800", fontSize: 16 },
});