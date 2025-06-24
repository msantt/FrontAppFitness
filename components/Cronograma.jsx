import React from "react";
import { View, Text, StyleSheet } from "react-native";

const days = [
  { key: "dom", label: "Dom" },
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sab" },
];

export function Cronograma({ schedule }) {
  return (
    <View style={styles.container}>
      {days.map(({ key, label }) => (
        <View key={key} style={styles.dayContainer}>
          <Text style={styles.dayLabel}>{label}</Text>
          <View
            style={[
              styles.dayIndicator,
              schedule[key] ? styles.dayCompleted : styles.dayPending,
            ]}
          >
            {schedule[key] && <Text style={styles.checkIcon}>✓</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayLabel: {
    color: "#CCC",
    marginBottom: 6,
  },
  dayIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCompleted: {
    backgroundColor: "#1DB954",
  },
  dayPending: {
    backgroundColor: "#444444",
  },
  checkIcon: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
});
