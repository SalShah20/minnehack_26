import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import {Link} from "expo-router";

import BuddySprite from "../../src/components/buddy/BuddySprite";
import BuddyHUD from "../../src/components/buddy/BuddyHUD";

import { calculateLevel } from "../../src/engine/game/xp";
import { getBuddyMood, getBuddyMessage, type BuddyMood } from "../../src/engine/game/buddyMood";
import type { ScoreResponse } from "../../src/types/api";

export default function BuddyTab() {
  const [xp, setXp] = useState<number>(0);
  const [heat, setHeat] = useState<number>(10);
  const [repair, setRepair] = useState<number>(10);

  const levelInfo = useMemo(() => calculateLevel(xp), [xp]);

  const score: ScoreResponse = {
    heat,
    repair,
    xpDelta: 0,
    highlights: [],
  };

  const mood: BuddyMood = useMemo(
    () => getBuddyMood(score),
    [score]
  );

  const buddyMessage = getBuddyMessage(mood);

  const addXP = (delta: number) => {
    setXp((prev: number) => Math.max(0, prev + delta));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buddy</Text>
      <Text style={styles.sub}>Your companion.</Text>

      <BuddySprite mood={mood} size={220} />

      <BuddyHUD
        mood={mood}
        level={levelInfo.level}
        xpIntoLevel={levelInfo.xpIntoLevel}
        xpForNextLevel={levelInfo.xpForNextLevel}
        heat={heat}
        repair={repair}
      />

      <Text style={styles.message}>{buddyMessage}</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => addXP(25)}>
          <Text style={styles.btnPrimaryText}>+25 XP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => {
            setHeat((h: number) => Math.min(100, h + 25));
            setRepair((r: number) => Math.max(0, r - 10));
          }}
        >
          <Text style={styles.btnOutlineText}>Simulate Heat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => {
            setHeat((h: number) => Math.max(0, h - 20));
            setRepair((r: number) => Math.min(100, r + 20));
          }}
        >
          <Text style={styles.btnOutlineText}>Simulate Repair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnDanger}
          onPress={() => {
            setXp(0);
            setHeat(10);
            setRepair(10);
          }}
        >
          <Text style={styles.btnDangerText}>Reset</Text>
        </TouchableOpacity>
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
      
              <Link href="/index" asChild>
                <Pressable style={styles.chip}>
                  <Text style={styles.chipText}>Home</Text>
                </Pressable>
              </Link>
            </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#111" },
  sub: { color: "#000000", marginTop: -6 },

  message: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },

  btnPrimary: {
    flex: 1,
    backgroundColor: "#FF8A65",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#000", fontWeight: "800" },

  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5F8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnOutlineText: { color: "#6B5DD2", fontWeight: "800" },

  btnDanger: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDangerText: { color: "#fff", fontWeight: "800" },
  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },
});