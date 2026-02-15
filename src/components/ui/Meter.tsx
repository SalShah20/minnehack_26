/**
 * Animated meter component.
 *
 * Used for:
 * - Heat
 * - Repair
 * - Stability
 *
 * Accepts:
 * - value (0-100)
 * - color
 */

import React from "react";
import {View, Text, StyleSheet} from "react-native";

type MeterProps = {
  label?: string;
  value: number; // 0–100
  color?: string;
};

export default function Meter({label, value}: MeterProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={styles.barBg}>
      <View style={[styles.barFill, {width: `${pct}%`}]} />
    </View>
    <Text style={styles.value}>{pct}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 6,
    fontWeight: "700"
  },
  barBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
  },
  barFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(95, 100, 217, 0.9)",
  },
  value: {
    marginTop: 6,
    opacity: 0.8
  },
});
