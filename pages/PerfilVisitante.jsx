import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { apiService } from "../services/api";
import { getEnderecoFromLatLng } from "../services/geolocationService";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";

const { width, height } = Dimensions.get("window");
const imageSize = (width - 12 * 4) / 2;

function converterHorarioVirginiaParaBrasil(dataHoraStr) {
  const offsetVirginia = 4 * 60;
  const offsetBrasil = 3 * 60;
  const dataUtc = new Date(dataHoraStr + "Z");
  const dataVirginia = new Date(dataUtc.getTime() - offsetVirginia * 60000);
  const dataBrasil = new Date(dataVirginia.getTime() + offsetBrasil * 60000);

  const dia = dataBrasil.getDate().toString().padStart(2, "0");
  const mes = (dataBrasil.getMonth() + 1).toString().padStart(2, "0");
  const ano = dataBrasil.getFullYear();
  const horas = dataBrasil.getHours().toString().padStart(2, "0");
  const minutos = dataBrasil.getMinutes().toString().padStart(2, "0");

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

export default function PerfilVisitante({ route, navigation }) {
  const { membroId } = route.params;

  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [feedFotos, setFeedFotos] = useState([]);
  const [modalZoomVisible, setModalZoomVisible] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const membro = await apiService.getMembroById(membroId);
        const usuarioCompleto = await apiService.getUsuarioByEmail(
          membro.usuario.email
        );
        setUsuario(usuarioCompleto);
      } catch (error) {
        console.error("Erro ao buscar membro/usuário:", error);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [membroId]);

  useEffect(() => {
    async function carregarFeedFotos() {
      if (usuario?.id && usuario.exibirHistorico) {
        try {
          const checkins = await apiService.getCheckInsByUsuarioId(usuario.id);
          const checkinsOrdenados = checkins.sort(
            (a, b) => new Date(b.dataHoraCheckin) - new Date(a.dataHoraCheckin)
          );
          setFeedFotos(checkinsOrdenados);
        } catch (error) {
          console.log("Erro ao carregar feed de fotos:", error);
        }
      } else {
        setFeedFotos([]);
      }
    }

    if (usuario) carregarFeedFotos();
  }, [usuario]);

  useEffect(() => {
    async function carregarEndereco() {
      if (fotoSelecionada?.local) {
        setLoadingModal(true);
        try {
          const [lat, lon] = fotoSelecionada.local
            .split(",")
            .map((s) => s.trim());
          const res = await getEnderecoFromLatLng(lat, lon);
          setEndereco(res || null);
        } catch (error) {
          console.error("Erro ao carregar endereço:", error);
          setEndereco(null);
        } finally {
          setLoadingModal(false);
        }
      } else {
        setEndereco(null);
      }
    }

    carregarEndereco();
  }, [fotoSelecionada]);

  function abrirModalZoom(item) {
    setFotoSelecionada(item);
    setModalZoomVisible(true);
  }

  function fecharModalZoom() {
    setModalZoomVisible(false);
    setEndereco(null);
    setFotoSelecionada(null);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff", fontSize: 18 }}>
          Usuário não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Perfil"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar e Nome */}
        <View style={styles.avatarSection}>
          <Image
            source={
              usuario.urlFoto
                ? { uri: usuario.urlFoto }
                : require("../assets/imagens/avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.username}>{usuario.nome}</Text>
        </View>

        {/* Objetivo */}
        <View style={styles.objetivoContainer}>
          <MaterialIcons
            name="star"
            size={20}
            color="#1DB954"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.objetivoText}>
            {usuario.objetivo
              ? usuario.objetivo.replace(/_/g, " ")
              : "Sem objetivo definido"}
          </Text>
        </View>

        {/* Feed de Check-ins ou Perfil Privado */}
        {usuario.exibirHistorico ? (
          <View style={styles.feedSection}>
            <Text style={styles.feedTitle}>Feed de Check-ins</Text>
            {feedFotos.length > 0 ? (
              <View style={styles.feedGrid}>
                {feedFotos.map((item) => (
                  <TouchableOpacity
                    key={item.id.toString()}
                    onPress={() => abrirModalZoom(item)}
                    activeOpacity={0.8}
                    style={styles.feedImageWrapper}
                  >
                    <Image
                      source={{ uri: item.urlFoto }}
                      style={styles.feedImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={{ color: "#888", textAlign: "center" }}>
                Nenhum check-in encontrado.
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.privateSection}>
            <MaterialIcons name="lock" size={24} color="#888" />
            <Text style={styles.privateText}>
              Perfil privado. O histórico de check-ins está oculto.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Zoom */}
      <Modal visible={modalZoomVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.zoomContent}>
            {loadingModal ? (
              <ActivityIndicator size="large" color="#1DB954" />
            ) : fotoSelecionada ? (
              <>
                {endereco ? (
                  <View style={styles.locationContainer}>
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color="#FF5555"
                    />
                    <Text style={styles.locationText}>{endereco}</Text>
                  </View>
                ) : (
                  <View style={styles.locationContainer}>  
                  <Text style={styles.locationText}>Local não informado</Text>
                  </View>
                )}

                <Image
                  source={{ uri: fotoSelecionada.urlFoto }}
                  style={styles.zoomImage}
                  resizeMode="contain"
                />

                <Text style={styles.dateText}>
                  {converterHorarioVirginiaParaBrasil(
                    fotoSelecionada.dataHoraCheckin
                  )}
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={fecharModalZoom}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>

      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#1DB954",
    marginBottom: 12,
  },
  username: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  objetivoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1DB95433",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  objetivoText: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  feedSection: {
    paddingHorizontal: 12,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  feedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feedImageWrapper: {
    width: imageSize,
    height: imageSize,
    marginBottom: 10,
    backgroundColor: "#222",
    borderRadius: 4,
    overflow: "hidden",
  },
  feedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  privateSection: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  privateText: {
    color: "#888",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomContent: {
    width: width,
    height: height,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  locationContainer: {
    position: "absolute",
    top: 100,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  locationText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  zoomImage: {
    width: width,
    height: width * (16 / 9),
    resizeMode: "cover",
  },
  dateText: {
    position: "absolute",
    bottom: 100,
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
