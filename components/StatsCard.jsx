import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function StatsCard({ icon, title, value, style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    color: "#1DB954",
    fontWeight: "bold",
  },
  value: {
    color: "#CCC",
    marginTop: 4,
    fontWeight: "bold",
  },
});
