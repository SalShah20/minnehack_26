/**
 * ResponseBox Component
 *
 * Text input area for user responses.
 *
 * Used in:
 * - Game Mode (Play)
 * - Repair Mode (Helper)
 *
 * Features:
 * - Controlled input
 * - Character count (optional)
 * - Debounced scoring trigger
 *
 * Does NOT compute scoring directly.
 */

import React, {useState} from "react";
import {View,TextInput} from "react-native";
import Button from "../ui/Button"; // get button methods
export default function ResponseBox({onSubmit}){ // funtion to read in user input
    const [text, setText] = userState(""); // state to hold user input?
    
    function handleSend() {
    onSubmit(text);
    setText(""); // holds user input, once submitted it will reset for new input
  }

  return (
    <View style={{ gap: 10 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="How would you respond to this senario?"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
        }}
      />

      <Button onPress={handleSend} />
    </View>
  );
}
