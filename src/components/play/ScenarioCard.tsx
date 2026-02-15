/**
 * ScenarioCard Component
 *
 * Displays a practice scenario in Game Mode.
 *
 * Includes:
 * - Scenario text
 * - Emotion tag
 * - Difficulty level
 * - Realm (Friend, Family, etc.)
 *
 * Used in:
 * - Play mode scenario screen
 */

// now implement input to senario
import React, {useState} from "react";
import {View,TextInput} from "react-native";
import ResponseBox from "../play/ResponseBox"; // get resp. methods
  return (
    <View style={{ padding: 20 }}>
      <ResponseBox onSubmit={handleUserSubmit} />
    </View>
  );
}
