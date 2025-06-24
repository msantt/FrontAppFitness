import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export function TimelineItem({ item }) {
  const statusLower = item.status.toLowerCase();
  const dotStyles = [
    styles.timelineDot,
    statusLower === "concluido" && styles.dotCompleted,
    statusLower === "em_andamento" && styles.dotActive,
    statusLower === "pendente" && styles.dotPending,
  ];

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelinePoint}>
        <View style={dotStyles} />
        <Text style={styles.timelineTime}>
          {new Date(item.dataHoraCheckin).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.usuario}>
          <Image
            source={{ uri: item.membroDesafio.usuario.avatar }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.nome}>{item.membroDesafio.usuario.nome}</Text>
            <Text style={styles.status}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  timelinePoint: {
    width: 50,
    alignItems: "center",
    marginRight: 12,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "#F44336",
  },
  dotCompleted: { backgroundColor: "#1DB954" },
  dotActive: { backgroundColor: "#FFD700" },
  dotPending: { backgroundColor: "#F44336" },
  timelineTime: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 12,
  },
  usuario: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: { justifyContent: "center" },
  nome: {
    color: "#FFF",
    fontWeight: "bold",
  },
  status: {
    color: "#CCC",
    fontSize: 11,
  },
});
