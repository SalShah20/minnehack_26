/**
 * Buddy Dashboard screen.
 *
 * Displays:
 * - Tamagotchi companion
 * - XP + Level
 * - Badges / Achievements
 * - Cosmetic unlocks
 *
 * Uses:
 * - buddyMood engine
 * - xp/achievement logic
 */

import React, {useMemo} from "react";
import {View, Text, ScrollView, StyleSheet} from "react-native";
import BuddySprite from "../../src/components/buddy/BuddySprite";
import BuddyHUD from "../../src/components/buddy/BuddyHUD";
import {processSession} from "../../src/engine/game/sessionResults";

const lastScore = {
  repairScore: 80,
  heatScore: 30,
  flags: ["validation", "ownership"],
  totalXP: 240,
};

export default function BuddyScreen() {
  const session = useMemo(() => processSession(lastScore), []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Repair Buddy</Text>

      {/* Tamagotchi buddy */}
      <BuddySprite mood={session.buddyMood} />

      {/* XP + Level HUD */}
      <BuddyHUD
        level={session.level}
        xp={session.totalXP}
        xpToNext={100 - (session.totalXP % 100)}
      />

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgeGrid}>
          {session.achievements.map((a) => (
            <View key={a.id} style={styles.badge}>
              <Text>{a.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cosmetic unlock placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cosmetics</Text>
        <Text style={{ opacity: 0.6 }}>Unlockables coming soon</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "#f7f7f7"},
  content: {alignItems: "center", padding: 20},
  title: {fontSize: 26, fontWeight: "600", marginBottom: 20},
  section: {width: "100%", marginTop: 30},
  sectionTitle: {fontSize: 18, fontWeight: "600", marginBottom: 10},
  badgeGrid: {flexDirection: "row", flexWrap: "wrap", gap: 10},
  badge: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },
});