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
import {TouchableOpacity, View, StyleSheet} from "react-native";


export default function Button ({onPress}){
    return(
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.outerSquare} />
        <View style={styles.innerCircle} />
        <Text style={styles.label}>SEND</Text>
    </TouchableOpacity>
     );
}

const styles = StyleSheet.create({
    container: {
        width:100,
        height: 110,
        positions: "relative",
    },
    outerSquare: {
        position: "absolute", 
        width: 100,
        height: 110,
        backgroundColor: "#B4B7F3",
        borderRadius: 15, left: 0, top: 0,
  }

  innerCircle: {
    position: "absolute",
    width: 71,
    height: 71,
    left: 19,
    top: 19,
    backgroundColor: "#D9D9D9",
    borderRadius: 71 / 2,
    shadowColor: "rgba(243, 240, 180, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  label: {
    position: "absolute",
    left: 35,
    top: 43,
    fontFamily: "Modak",
    fontSize: 16,
    lineHeight: 24,
    color: "black",
  },
});
