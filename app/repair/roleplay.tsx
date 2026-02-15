/**
 * Optional Roleplay Test (Helper Mode).
 *
 * Lets user simulate conversation before sending.
 *
 * Uses:
 * - roleplayReply()
 * - Stability scoring
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { roleplayReply } from "@/sdk";
import Meter from "@/components/Meter";

export const Roleplay = () => {
  const [scenario, setScenario] = useState("");
  const [message, setMessage] = useState("");
  const [vibe, setVibe] = useState("hurt");

  const [reply, setReply] = useState("");
  const [stability, setStability] = useState(50);

  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!scenario || !message) return;

    setLoading(true);

    try {
      const { reply, stability } = await roleplayReply({
        scenario,
        userMessage: message,
        otherPersonVibe: vibe,
        speak: false,
      });

      setReply(reply);
      setStability(stability);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Practice Conversation</Text>

      {/* Scenario input */}
      <Text style={styles.label}>Scenario</Text>
      <TextInput
        style={styles.input}
        placeholder="What happened?"
        multiline
        value={scenario}
        onChangeText={setScenario}
      />

      {/* User message */}
      <Text style={styles.label}>Your Message</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type what you might say..."
        value={message}
        onChangeText={setMessage}
      />

      {/* Vibe selector (simple buttons) */}
      <Text style={styles.label}>Other Person's Vibe</Text>
      <View style={styles.vibeRow}>
        {["defensive", "hurt", "busy", "confused"].map(v => (
          <TouchableOpacity
            key={v}
            style={[
              styles.vibeButton,
              vibe === v && styles.vibeSelected,
            ]}
            onPress={() => setVibe(v)}
          >
            <Text style={styles.vibeText}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Simulate button */}
      <TouchableOpacity
        style={styles.simulateButton}
        onPress={handleSimulate}
        disabled={loading}
      >
        <Text style={styles.simulateText}>
          {loading ? "Simulating..." : "Simulate Reply"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#6B5DD2" />}

      {/* Stability Meter */}
      {!!reply && (
        <>
          <Meter label="Stability" value={stability} />

          <View style={styles.replyCard}>
            <Text style={styles.replyLabel}>Their Response</Text>
            <Text style={styles.replyText}>{reply}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#6B5DD2",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5DD2",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5F8",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 80,
  },

  vibeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  vibeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E5E5F8",
    borderRadius: 10,
  },

  vibeSelected: {
    backgroundColor: "#FFF6A5",
  },

  vibeText: {
    color: "#6B5DD2",
    fontWeight: "600",
  },

  simulateButton: {
    backgroundColor: "#FFF6A5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  simulateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5DD2",
  },

  replyCard: {
    backgroundColor: "#E5E5F8",
    padding: 16,
    borderRadius: 12,
  },

  replyLabel: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#6B5DD2",
  },

  replyText: {
    fontSize: 15,
    color: "#333",
  },
});

export default Roleplay;
