/**
 * Renders the Tamagotchi buddy.
 *
 * Displays different mood states:
 * - calm
 * - overheated
 * - recovering
 * - proud
 *
 * Pure visual logic.
 */

import React from "react";
import {Image, View, StyleSheet} from "react-native";
import {BuddyMood} from "../../engine/game/buddyMood";

type Props = {
  mood: BuddyMood;
  size?: number;
};

export default function BuddyAvatar({ mood, size = 220}: Props) {
  const source = getBuddyImage(mood);

  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={{width: size, height: size}}
        resizeMode="contain"/>
    </View>
  );
}

function getBuddyImage(mood: BuddyMood) {
  switch (mood) {
    case "neutral":
      return require("../../../assets/images/char_design.png");
    case "encouraging":
      return require("../../../assets/images/calm.png");
    case "proud":
      return require("../../../assets/images/cool.png");
    case "concerned":
      return require("../../../assets/images/breathe.png");
    case "worried":
      return require("../../../assets/images/angry.png");
    default:
      return require("../../../assets/images/char_design.png");
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
});
