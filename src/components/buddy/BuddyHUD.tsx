/**
 * Small HUD showing:
 * - Heat
 * - Repair
 * - XP
 *
 * Styled in Tamagotchi fashion.
 */

import React from "react";
import {View, Text, StyleSheet} from "react-native";
import type { BuddyMood } from "@/src/engine/game/buddyMood";

type Props = {
  mood: BuddyMood;
  heat: number;
  repair: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  level: number;
  comboLabel?: string | null;
};

// temp data
export default function BuddyHUD({
  mood,
  heat,
  repair,
  xpIntoLevel,
  level,
  comboLabel,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.mood}>{moodLabel(mood)}</Text>

        <View style={styles.rightTop}>
          <Text style={styles.level}>Lv {level}</Text>
          <Text style={styles.xp}>{xpIntoLevel} XP</Text>
        </View>
      </View>

      {comboLabel ? (
        <View style={styles.comboPill}>
          <Text style={styles.comboText}>Combo: {comboLabel}</Text>
        </View>
      ): null}

      <StatBar label="Heat" value={heat} variant="heat" />
      <StatBar label="Repair" value={repair} variant="repair" />
    </View>
  );
}

function moodLabel(mood: BuddyMood) {
  switch (mood) {
    case "neutral":
      return "Chillin'";
    case "encouraging":
      return "You got this.";
    case "proud":
      return "Proud of you";
    case "concerned":
      return "Let's slow down";
    case "worried":
      return "Careful, not too heated";
    default:
      return "Chillin'";
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function StatBar({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "heat" | "repair";
}) {
  const v = clamp(Math.round(value), 0, 100);

  return (
    <View style={styles.barWrap}>
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{v}</Text>
      </View>

      <View style={styles.barBg}>
        <View 
          style={[
            styles.barFill,
            { width: `${v}%` },
            variant === "heat" ? styles.heatFill : styles.repairFill,
          ]}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mood: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  rightTop: {
    alignItems: "flex-end",
  },

  level: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  xp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
  },
  comboPill: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    marginBottom: 10,
  },
  comboText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  barWrap: {
    marginTop: 10,
  },
  barRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom:6,
  },
  barLabel: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  barValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  barBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  heatFill: {
    backgroundColor: "rgba(255, 90, 90, 0.90)",

  },
  repairFill: {
    backgroundColor: "rgba(90, 210, 140, 0.90)",
  },
});