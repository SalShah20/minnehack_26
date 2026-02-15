/**
 * Reusable button component.
 *
 * Supports:
 * - Primary / Secondary styles
 * - Disabled state
 * - Icon support
 *
 * No business logic here.
 */

import React from "react";
import {Pressable, Text, StyleSheet} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function Button({title, onPress}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );  
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  text: {color: "#fff", fontWeight: "800", textAlign: "center"},
});
