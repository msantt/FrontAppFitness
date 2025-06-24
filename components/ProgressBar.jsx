import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export function ProgressBar({ progresso, posicao }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.percent}>{progresso}%</Text>
        <View style={styles.posicaoContainer}>
          <Text style={styles.posicao}>Posição: {posicao}<Text style={styles.icon}>🔥</Text></Text>
        </View>
      </View>
      <View style={[styles.bar, { maxWidth: width * 0.9 }]}>
        <View style={[styles.fill, { width: `${progresso}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  percent: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  posicaoContainer: { flexDirection: "row", alignItems: "center" },
  posicao: { color: "#1DB954", marginRight: 6, fontWeight: "bold", fontSize: 14 },
  icon: { fontSize: 18 },
  bar: {
    height: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#1DB954",
  },
});
