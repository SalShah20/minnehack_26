/**
 * Intake Screen (Helper Mode).
 *
 * User enters:
 * - What happened
 * - Who it's with
 * - Desired outcome
 *
 * On submit:
 * - Calls generateOptions()
 * - Navigates to drafts screen
 */

import React, {useState} from "react";
import {View, Text, Pressable, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert} from "react-native";
import {useRouter, Link} from "expo-router";

export default function Intake() {
  const router = useRouter();

  const [what, setWhat] = useState("");
  const [who, setWho] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");

  const submit = () => {
    if (!what.trim() || !who.trim() || !desiredOutcome.trim()) {
      Alert.alert("Fill all fields.");
      return;
    }

    // Pass to drafts screen, calls SDK
    router.push({
      pathname: "/repair/drafts",
      params: {
        scenario: what,
        relationship: who,
        goal: desiredOutcome,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What Happened?</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Describe the situation"
        value={what}
        onChangeText={setWhat}
      />

      <Text style={styles.title}>Who is it with?</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend, Partner, Family, etc."
        value={who}
        onChangeText={setWho}
      />

      <Text style={styles.title}>Desired Outcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Reconnect, Apologize, Set Boundary, Clarify"
        value={desiredOutcome}
        onChangeText={setDesiredOutcome}
      />

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Generate drafts</Text>
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
};

const styles = StyleSheet.create({
    row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  container: {padding: 16, gap: 16},

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5DD2",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5F8",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 48,
  },

  btn: {
    backgroundColor: "#FF8A65",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop:8,
  },
  
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  chip: {
    backgroundColor: "#FFF6A5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontWeight: "700", color: "#3B2FA8" },
});