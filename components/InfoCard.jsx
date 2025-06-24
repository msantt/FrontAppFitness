import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function InfoCard({ icon, label, value }) {
  return (
    <View style={styles.card}>
      {icon}
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222222",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  textContainer: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 2,
  },
});
