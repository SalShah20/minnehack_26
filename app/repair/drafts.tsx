/**
 * Draft Options Screen.
 *
 * Displays 3 AI-generated message styles:
 * - Soft Repair
 * - Boundary + Respect
 * - Direct & Clear
 *
 * User selects one → navigates to editor.
 */

import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, ActivityIndicator, Alert} from "react-native";
import {generateDraftOptions} from "@/sdk";
import {useNavigation, useRoute} from "@react-navigation/native";

type DraftOption = {
  label: string;  // "Soft Repair", "Boundary + Respect", "Direct & Clear"
  text: string;   // The actual message
  whyItWorks: string; // Explanation
};

type DraftsScreenProps = {
  scenario: string;
  goal: "Reconnect" | "Apologize" | "Set Boundary" | "Clarify";
  relationship: "Friend" | "Partner" | "Family" | "Work/School" | "Roommate";
};

export default function Drafts() {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route: any = useRoute();

  const {scenario, goal, relationship} = route.params;


  useEffect(() => {
    const load = async () => {
      try {
        const { options } = await generateDraftOptions({
          scenario,
          goal,
          relationship,
        });

        setOpts(options);
      } catch (e) {
        console.error(e);
        Alert.alert("Failed to generate drafts.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6B5DD2" />
        <Text>Generating drafts...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {options.map((opt, i) => (
        <TouchableOpacity 
          key={i} 
          style={styles.card} 
          onPress={() => navigation.navigate("Editor" as never, { draft: o } as never)}
          >
          <Text style={styles.label}>{opt.label}</Text>
          <Text>{opt.text}</Text>
          <Text style={styles.why}>{opt.whyItWorks}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    backgroundColor: "#E5E5F8",
    padding: 16,
    borderRadius: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#6B5DD2",
  },

  why: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
});