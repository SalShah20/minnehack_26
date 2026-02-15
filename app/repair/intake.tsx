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
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert} from "react-native";
import {useNavigation} from "@react-navigation/native";

export default function Intake() {
  const navigation = useNavigation();

  const [what, setWhat] = useState("");
  const [who, setWho] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");

  const submit = () => {
    if (!what || !who || !outcome) {
      Alert.alert("Fill all fields.");
      return;
    }

    // Pass to drafts screen, calls SDK
    navigation.navigate("Drafts" as never, {
      scenario: what,
      relationship: who,
      goal: outcome,
    } as never);
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

      {/* Make nicer if time */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, gap: 16},

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: #6B5DD2,
  },

  input: {
    borderWidth: 1,
    borderColor: #E5E5F8,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  submitButton: {
    backgroundColor: #FFF6A5,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: #6B5DD2,
  },
});