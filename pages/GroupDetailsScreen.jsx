import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiService } from "../services/api";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { ModalConfirmacao } from "../components/ModalConfirm";

export default function GroupDetails({ route, navigation }) {
  const { grupoId } = route.params;

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [grupo, setGrupo] = useState(null);
  const [membros, setMembros] = useState([]);
  const [desafios, setDesafios] = useState([]);

  // modal desafio
  const [modalVisible, setModalVisible] = useState(false);
  const [desafioIdSelecionado, setDesafioIdSelecionado] = useState(null);
  const [mensagemModal, setMensagemModal] = useState("");

  // modal visita perfil
  const [modalVisitaVisible, setModalVisitaVisible] = useState(false);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [mensagemVisita, setMensagemVisita] = useState("");

  // modal foto ampliada
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  // ============ Carregamento ============

  useEffect(() => {
    async function loadUsuario() {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (!email) throw new Error("Usuário não encontrado");
        const usuario = await apiService.getUsuarioByEmail(email);
        if (!usuario?.id) throw new Error("Usuário inválido");
        setUserId(usuario.id);
      } catch (err) {
        setErrorMsg(err.message);
      }
    }
    loadUsuario();
  }, []);

  useEffect(() => {
    async function loadGrupoEMembros() {
      try {
        const g = await apiService.getGrupoById(grupoId);
        const m = await apiService.getMembrosByGrupo(grupoId);
        setGrupo(g);
        setMembros(m);
      } catch {
        setErrorMsg("Erro ao carregar dados do grupo");
      }
    }
    async function loadDesafios() {
      try {
        const d = await apiService.getDesafiosByGrupoId(grupoId);
        setDesafios(d || []);
      } catch {
        console.error("Erro ao carregar desafios");
      } finally {
        setLoading(false);
      }
    }
    if (grupoId) {
      loadGrupoEMembros();
      loadDesafios();
    }
  }, [grupoId]);

  // ============ Handlers ============

  const handleDesafioPress = async (id) => {
    try {
      const md = await apiService.getMembrosByDesafio(id);
      const isMembro = md.some((x) => x.usuario?.id === userId);
      if (isMembro) {
        navigation.navigate("DetalhesDesafios", { desafioId: id });
      } else {
        setMensagemModal("Você não é membro deste desafio. Deseja participar?");
        setDesafioIdSelecionado(id);
        setModalVisible(true);
      }
    } catch {
      setMensagemModal("Erro ao verificar sua participação. Tente novamente.");
      setModalVisible(true);
    }
  };
  const handleConfirmarParticipacao = () => {
    setModalVisible(false);
    if (desafioIdSelecionado) {
      navigation.navigate("ParticiparDesafio", {
        desafioId: desafioIdSelecionado,
      });
    }
  };
  const handleCancelar = () => {
    setModalVisible(false);
    setDesafioIdSelecionado(null);
  };

  const handleCreateDesafio = () => {
    navigation.navigate("CriarDesafios", { grupoId });
  };

  const handleMembroPress = (m) => {
    setMembroSelecionado(m);
    setMensagemVisita(
      `Deseja visitar o perfil de ${
        m.usuario?.nome?.split(" ")[0] ?? "este usuário"
      }?`
    );
    setModalVisitaVisible(true);
  };
  const handleConfirmarVisitaPerfil = () => {
    setModalVisitaVisible(false);
    const id = membroSelecionado?.id;
    setMembroSelecionado(null);
    console.log(id)
    if (id) navigation.navigate("PerfilVisitante", { membroId: id });
  };
  const handleCancelarVisitaPerfil = () => {
    setModalVisitaVisible(false);
    setMembroSelecionado(null);
  };

  // ============ Render ============

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Carregando dados do grupo...</Text>
      </View>
    );
  }
  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  const renderMembro = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      activeOpacity={0.7}
      onPress={() => handleMembroPress(item)}
    >
      <TouchableOpacity onPress={() => handleMembroPress(item)}>
        <Image
          source={{
            uri:
              item.usuario?.urlFoto ||
              "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
          }}
          style={styles.memberAvatar}
        />
      </TouchableOpacity>
      <Text style={styles.memberName}>
        {item.usuario?.nome?.split(" ")[0] ?? "Usuário"}
      </Text>
    </TouchableOpacity>
  );

  const renderDesafio = ({ item }) => (
    <TouchableOpacity onPress={() => handleDesafioPress(item.id)}>
      <View style={styles.timelineItem}>
        <View style={styles.timelineBullet} />
        <View style={styles.timelineContent}>
          <Text style={styles.timelineText}>{item.nome}</Text>
          <Text style={styles.timelineDate}>
            {item.dataInicio
              ? `Início: ${new Date(item.dataInicio).toLocaleDateString()}`
              : ""}
            {item.dataFim
              ? ` | Fim: ${new Date(item.dataFim).toLocaleDateString()}`
              : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={grupo?.nome || "Grupo"}
        showBackButton
        onBackPress={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Grupo header */}
        <View style={styles.groupHeader}>
          <View style={styles.imagemContainer}>
            {grupo?.urlFoto ? (
              <Image
                source={{ uri: grupo.urlFoto }}
                style={styles.imagemGrupo}
              />
            ) : (
              <View style={styles.imagemPlaceholder}>
                <Text style={{ color: "#888" }}>Sem imagem</Text>
              </View>
            )}
          </View>
          <Text style={styles.nomeGrupo}>{grupo?.nome}</Text>
          <Text style={styles.descricaoGrupo}>{grupo?.descricao}</Text>
          <Text style={styles.groupPrivacy}>
            {grupo?.tipoGrupo === "PRIVADO" ? "🔒 Privado" : "🌎 Público"}
          </Text>
        </View>

        {/* Membros */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Membros</Text>
          <FlatList
            data={membros}
            keyExtractor={(i) => i.id.toString()}
            renderItem={renderMembro}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Desafios */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Desafios do Grupo</Text>
          {desafios.length > 0 ? (
            <FlatList
              data={desafios}
              keyExtractor={(i) => i.id.toString()}
              renderItem={renderDesafio}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>
              Nenhum desafio cadastrado neste grupo.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateDesafio}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <View style={styles.bottomNav}>
        <BottomNav active="EncontrarGruposScreen" />
      </View>

      {/* Modal desafio */}
      <ModalConfirmacao
        visible={modalVisible}
        mensagem={mensagemModal}
        onConfirm={handleConfirmarParticipacao}
        onCancel={handleCancelar}
      />

      {/* Modal visita perfil */}
      <ModalConfirmacao
        visible={modalVisitaVisible}
        mensagem={mensagemVisita}
        onConfirm={handleConfirmarVisitaPerfil}
        onCancel={handleCancelarVisitaPerfil}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { padding: 20, paddingBottom: 140 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#CCC", marginTop: 12, fontSize: 16 },
  errorText: {
    color: "#FF6B6B",
    fontSize: 17,
    textAlign: "center",
    paddingHorizontal: 30,
    fontWeight: "600",
  },

  groupHeader: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  imagemContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#2a2a2a",
  },
  imagemGrupo: { width: "100%", height: "100%" },
  imagemPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nomeGrupo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  descricaoGrupo: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  groupPrivacy: {
    color: "#1DB954",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  sectionTitle: {
    color: "#1DB954",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  memberItem: { alignItems: "center", marginRight: 24, width: 80 },
  memberAvatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: "#555",
    borderWidth: 2,
    borderColor: "#1DB954",
  },
  memberName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },

  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  timelineBullet: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1DB954",
    marginTop: 6,
    marginRight: 20,
  },
  timelineContent: { flex: 1 },
  timelineText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#E0E0E0",
    lineHeight: 24,
  },
  timelineDate: {
    fontSize: 13,
    fontWeight: "400",
    color: "#aaa",
    marginTop: 4,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    marginTop: 16,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: { color: "#000", fontSize: 24, fontWeight: "bold" },

  bottomNav: { position: "absolute", left: 0, right: 0, bottom: 0 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: { width: "90%", height: "70%", borderRadius: 16 },
});
