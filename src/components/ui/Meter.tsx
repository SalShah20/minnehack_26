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

import React, {useRef, useEffect} from "react";
import {View, Text, StyleSheet, Animated} from "react-native";

type MeterProps = {
  label: string;
  value: number; // 0–100
  barWidth?: number;
};

// Type cast fixes TS issue
const AnimatedView = Animated.createAnimatedComponent(View as any);

export const Meter: React.FC<MeterProps> = ({ label, value, barWidth = 320 }) => {
  const clamped = Math.max(0, Math.min(100, value));

  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: clamped,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [clamped, animated]);

  const width = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, barWidth],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>

      <View style={[styles.frame, { width: barWidth }]}>
        <View style={[styles.bar, { width: barWidth }]} />
        <AnimatedView style={[styles.fill, { width }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 327,
    height: 48,
    backgroundColor: "#fff",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  frame: {
    height: 39,
    position: "relative",
  },
  bar: {
    position: "absolute",
    height: 14,
    top: 22,
    backgroundColor: "#E5E5E5",
    borderRadius: 999,
  },
  fill: {
    position: "absolute",
    height: 14,
    top: 22,
    backgroundColor: "#FF8A65",
    borderRadius: 999,
  },
});

export default Meter;
