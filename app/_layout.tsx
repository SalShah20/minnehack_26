/**
 * Root navigation layout.
 *
 * Defines bottom tab navigation:
 * - Play (Game Mode)
 * - Repair (Real-Life Helper)
 * - Buddy (Progress + Tamagotchi)
 *
 * This file sets up the app’s primary navigation structure.
 * Do NOT put business logic here.
 */
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: "#6B5DD2"},
        headerTintColor: "#fff",
        headerTitleStyle: {fontWeight: "600"},
      }}
      />
  );
}
