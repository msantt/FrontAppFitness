import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { getEnderecoFromLatLng } from "../services/geolocationService";

export function TimelineItem({ item }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    if (item.local) {
      const [lat, lon] = item.local.split(",").map((s) => s.trim());
      getEnderecoFromLatLng(lat, lon).then((res) => {
        if (res) setEndereco(res);
      });
    }
  }, [item.local]);

  function somarTresHoras(dataHoraStr) {
  const dataOriginal = new Date(dataHoraStr);

  // Soma 3 horas (em milissegundos)
  const dataAjustada = new Date(dataOriginal.getTime() + 3 * 60 * 60 * 1000);

  const horas = String(dataAjustada.getHours()).padStart(2, "0");
  const minutos = String(dataAjustada.getMinutes()).padStart(2, "0");

  return `${horas}:${minutos}`;
}


  const statusLower = item.status.toLowerCase();
  const dotStyles = [
    styles.timelineDot,
    statusLower === "concluido" && styles.dotCompleted,
    statusLower === "em_andamento" && styles.dotActive,
    statusLower === "pendente" && styles.dotPending,
  ];

  let horaFormatada = "";
  if (item.dataHoraCheckin) {
    try {
      horaFormatada = somarTresHoras(item.dataHoraCheckin);
    } catch {
      horaFormatada = new Date(item.dataHoraCheckin).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelinePoint}>
        <View style={dotStyles} />
        <Text style={styles.timelineTime}>{horaFormatada}</Text>
      </View>

      <View style={styles.timelineContent}>
        <View style={styles.usuario}>
          <Image
            source={{ uri: item.membroDesafio?.usuario?.urlFoto }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.nome}>
              {item.membroDesafio?.usuario?.nome ?? "Usuário"}
            </Text>
            <Text style={styles.status}>
              {item.status.charAt(0).toUpperCase() +
                item.status.slice(1).toLowerCase()}
            </Text>
          </View>
        </View>

        {item.urlFoto && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.imageWrapper}
          >
            <Image source={{ uri: item.urlFoto }} style={styles.checkinImage} />
          </TouchableOpacity>
        )}

        {item.local && <Text style={styles.location}>📍 {endereco || item.local}</Text>}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: item.urlFoto }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#333",
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
  checkinImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 8,
  },
  imageWrapper: {
    overflow: "hidden",
  },
  location: {
    color: "#888",
    fontSize: 12,
    marginTop: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
});
