import { View, Text, StyleSheet } from "react-native";

export default function Home() {
  console.log("[MendQuest] Home screen mounted");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>MendQuest is running 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
