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
import {View,TextInput} from "react-Native";
import Button from "../ui/Button"; // get button methods
export default function ResponseBox({onSubmit}){ // funtion to read in user input
    const [text, setText] = userResponse("");

  function handleSend() {
    onSubmit(text);
    setText("");
  }

  return (
    <View style={{ gap: 12 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type your response..."
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
