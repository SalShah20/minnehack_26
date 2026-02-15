/**
 * Editor Screen (Helper Mode).
 *
 * Editable message with:
 * - Live Heat + Repair meters
 * - Repair tools bar
 *
 * Calls scoreMessage() on debounce.
 */

import React, {useState, useEffect, useCallback} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView} from "react-native";
import {debounce} from "lodash";
import Meter from "@/components/Meter"; // Your animated Meter
import {scoreMessage} from "@/engine/scoring"; // Assumed function
import {RouteProp, useRoute} from "@react-navigation/native";

// Draft type passed from Drafts screen
type DraftOption = {
  label: string;
  text: string;
  whyItWorks: string;
};

// Navigation route props
type EditorRouteProp = RouteProp<{params: {draft: DraftOption}}, "params">;

export const Editor: React.FC = () => {
  const route = useRoute<EditorRouteProp>();
  const {draft} = route.params;

  const [message, setMessage] = useState(draft.text);
  const [heat, setHeat] = useState(0);   // 0 – 100
  const [repair, setRepair] = useState(0); // 0 – 100

  const updateScores = useCallback(
    debounce(async (msg: string) => {
      try {
        const { heatScore, repairScore } = await scoreMessage(msg); 
        setHeat(heatScore);
        setRepair(repairScore);
      } catch (err) {
        console.error("Scoring failed:", err);
      }
    }, 400),
    []
  );

  useEffect(() => {
    updateScores(message);
  }, [message, updateScores]);

  const handleToolPress = (tool: string) => {
    setMessage((prev) => prev + " " + tool);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editing Draft</Text>

      {/* Editable text */}
      <TextInput
        style={styles.textInput}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      {/* Live meters */}
      <View style={styles.meters}>
        <Meter label="Heat" value={heat} />
        <Meter label="Repair" value={repair} />
      </View>

      {/* Repair Tools Bar */}
      <View style={styles.toolsBar}>
        {["Empathize", "Apologize", "Clarify", "Set Boundary"].map((tool) => (
          <TouchableOpacity
            key={tool}
            style={styles.toolButton}
            onPress={() => handleToolPress(tool)}
          >
            <Text style={styles.toolText}>{tool}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  meters: {
    gap: 12,
    marginTop: 16,
  },
  toolsBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  toolButton: {
    backgroundColor: "#FF8A65",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  toolText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Editor;