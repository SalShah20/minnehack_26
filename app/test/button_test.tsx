import React from "react";
import { View } from "react-native";
import Button from "./Button";

export default function ButtonTestScreen() {
  return (
    <View style={{ padding: 40 }}>
      <Button onPress={() => console.log("Button pressed")} />
    </View>
  );
}