import React from "react";
import { View, StyleSheet } from "react-native";
import ButtonDesafios from "./ButtonDesafios";

export function ButtonsGroup({ onVerRanking, onCheckin, loadingCheckin }) {
  return (
    <View style={styles.container}>
      <ButtonDesafios
        title="Ver Ranking"
        onPress={onVerRanking}
        variant="outline"
        style={styles.button}
      />
      <ButtonDesafios
        title="Fazer Check-in"
        onPress={onCheckin}
        loading={loadingCheckin}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 100,
  },
  button: {
    flex: 1,
  },
});
