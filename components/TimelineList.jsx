import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TimelineItem } from "./TimelineItem";

export function TimelineList({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <Text style={styles.noTimelineText}>
        Nenhum check-in registrado para este desafio.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timeline</Text>
      <View style={styles.line} />
      {timeline.map((item) => (
        <TimelineItem key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  line: {
    position: "absolute",
    left: 24,
    top: 50,
    bottom: 0,
    width: 2,
    backgroundColor: "#444",
  },
  noTimelineText: {
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
  },
});
