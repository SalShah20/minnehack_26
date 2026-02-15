import React, { useState, useMemo } from "react";
import { View, Pressable, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { router, Link } from "expo-router"; 

import BuddyAvatar from "@/src/components/buddy/BuddySprite";
import BuddyHUD from "@/src/components/buddy/BuddyHUD";
import Button from "@/src/components/ui/Button";

import { scoreMessage } from "@/src/engine/scoring/scoreMessage";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function moodFromScores(heat:number, repair:number) {
  if (heat >= 70) return "worried";
  if (heat >= 40) return "concerned";
  if (repair >= 70) return "proud";
  if (repair >= 40) return "encouraging";
  return "neutral";
}

function xpFromScores(heat: number, repair: number) {
  const repairXP = Math.round(repair*0.5);
  const heatBonus = heat < 30 ? 10 : 0;
  return repairXP + heatBonus;
}

function levelFromXP(xp: number) {
  return Math.max(1, Math.floor(xp/50) + 1);
}

export default function DemoScreen() {
  const [message, setMessage] = useState("");
  const [lastScore, setLastScore] = useState<ReturnType<typeof scoreMessage> | null>(null);
  const [xp, setXp] = useState(0);

  const score = useMemo(() => {
    if (!lastScore) return null;
    return {
      heat: lastScore.heat,
      repair: lastScore.repair,
      xp: lastScore.xp ?? xpFromScores(lastScore.heat, lastScore.repair),
      combo: lastScore.combo ?? null,
      heatTriggers: lastScore.heatTriggers ?? [],
      repairTriggers: lastScore.repairTriggers ?? [],
    };
  }, [lastScore]);

  const mood = useMemo(() => {
    const h = score?.heat ?? 0;
    const r = score?.repair ?? 0;
    return moodFromScores(h, r);
  }, [score?.heat, score?.repair]);

  const level = levelFromXP(xp);

  function onScore() {
    const s = scoreMessage(message);
    setLastScore(s);
    setXp((prev) => prev + (s.xp ?? xpFromScores(s.heat, s.repair)));
  }

  function onLoadSample(kind: "bad" | "good") {
    if (kind === "bad") {
      setMessage("You never listen. You always do this. I'm done.");
    } else {
      setMessage("I hear you. I'm sorry for how that came off. Can we talk and  find a better way forward?");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Olive Branch</Text>
      <Text style={styles.subtitle}>Type a message, score it, and watch Buddy react.</Text>

      <BuddyAvatar mood={mood as any} size={220}/>
      
      <BuddyHUD mood={mood as any}
                heat={score?.heat ?? 0}
                repair={score?.repair ?? 0}
                xpIntoLevel={xp}
                xpForNextLevel={0}
                level={level}
                comboLabel={score?.combo ?? null}/>

      <View style={{height: 18}}/>
      <Text style={styles.label}>Your message</Text>
      <TextInput style={styles.input}
                 placeholder="Type something here..."
                 placeholderTextColor="rgba(255, 255, 255, 0.5)"
                 value={message}
                 onChangeText={setMessage}
                 multiline/>
      <View style={styles.row}>
        <Button title="Load heated sample" onPress={() => onLoadSample("bad")}/>
      </View>
      <View style={styles.row}>
        <Button title="Load repair sample" onPress={() => onLoadSample("good")}/>
      </View>

      <View style={{height: 10}} />
      <Button title="Score message" onPress={onScore}/>
      
      <Button title="Generate Senario" onPress={() => router.push("/play/scenario")}/>  

      {lastScore ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What got detected</Text>

          <Text style={styles.cardLine}>
            Heat triggers:{" "}
            <Text style={styles.mono}>{(lastScore.heatTriggers ?? []).join(", ") || "None"}</Text>
          </Text>

          <Text style={styles.cardLine}>
            Repair triggers:{" "}
            <Text style={styles.mono}>{(lastScore.repairTriggers ?? []).join(", ") || "None"}</Text>
          </Text>
          {lastScore.combo ? (
            <Text style={styles.cardLine}>
              Combo: <Text style={styles.mono}>{lastScore.combo}</Text>
            </Text>
          ): null}
        </View>
      ): null}
    
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
  container: {
    padding: 18,
    paddingTop: 44,
    backgroundColor: "#5f64d9",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 14,
  },
  label: {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    minHeight: 110,
    borderRadius: 14,
    padding:12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(0, 0, 0, 0.10)",
    color: "#fff",
    marginBottom: 12,
  },
  row: {
    marginBottom: 10
  },
  card: {
    marginTop: 14,
    borderRadius: 16, 
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "900",
    marginBottom: 8,
  },
  cardLine: {
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 6,
  },
  mono: {
    color: "#fff",
    fontWeight: "700",
  },
  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },
});