import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { apiService } from "../services/api";
import { ModalConfirmacao } from "../components/ModalConfirm";
import { ModalFeedback } from "../components/ModalFeedback";

const { width } = Dimensions.get("window");

export function EncontrarGruposScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [usuario, setUsuario] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [grupoSelecionadoConfirmacao, setGrupoSelecionadoConfirmacao] =
    useState(null);

  const [isPrivateModalVisible, setPrivateModalVisible] = useState(false);
  const [selectedPrivateGroup, setSelectedPrivateGroup] = useState(null);
  const [privateGroupCode, setPrivateGroupCode] = useState("");

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const carregarEmailEUsuario = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem("userEmail");
        if (emailSalvo) {
          const usuarioData = await apiService.getUsuarioByEmail(emailSalvo);
          setUsuario(usuarioData);
        } else {
          setFeedbackType("error");
          setFeedbackMessage("Email não encontrado. Faça login novamente.");
          setFeedbackVisible(true);
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        setFeedbackType("error");
        setFeedbackMessage("Erro ao carregar os dados do usuário.");
        setFeedbackVisible(true);
      } finally {
        setLoading(false);
      }
    };

    carregarEmailEUsuario();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      let data = await apiService.getGrupos();

      if (searchTerm.trim()) {
        const termo = searchTerm.toLowerCase();
        data = data.filter(
          (g) =>
            g.nome.toLowerCase().includes(termo) ||
            (g.criador && g.criador.nome.toLowerCase().includes(termo))
        );
      }
      if (filterType !== "todos") {
        data = data.filter((g) => g.tipoGrupo.toLowerCase() === filterType);
      }

      setGrupos(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os grupos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadGroups();
    }
  }, [isFocused, filterType]);

  const handleGroupPress = (grupo) => {
    const isMember = grupo.membros?.some((m) => m.usuario.id === usuario.id);

    if (isMember) {
      navigation.navigate("GroupDetails", { grupoId: grupo.id });
    } else {
      if (grupo.tipoGrupo.toLowerCase() === "publico") {
        setGrupoSelecionadoConfirmacao(grupo);
        setConfirmModalVisible(true);
      } else {
        setSelectedPrivateGroup(grupo);
        setPrivateGroupCode("");
        setPrivateModalVisible(true);
      }
    }
  };

  const confirmarEntradaGrupo = async () => {
    if (!grupoSelecionadoConfirmacao) return;

    try {
      if (!usuario?.id) throw new Error("Usuário não encontrado.");

      await apiService.entrarGrupo(
        grupoSelecionadoConfirmacao.id,
        usuario.id,
        null
      );

      setFeedbackType("success");
      setFeedbackMessage(
        `Você entrou no grupo "${grupoSelecionadoConfirmacao.nome}"!`
      );
      setFeedbackVisible(true);
      loadGroups();
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(error.message || "Não foi possível entrar no grupo.");
      setFeedbackVisible(true);
    } finally {
      setConfirmModalVisible(false);
      setGrupoSelecionadoConfirmacao(null);
    }
  };

  const handlePrivateGroupEntry = async () => {
    if (!selectedPrivateGroup || !privateGroupCode) {
      Alert.alert("Aviso", "Por favor, insira o código de acesso.");
      return;
    }
    try {
      if (!usuario?.id) throw new Error("Usuário não encontrado.");

      await apiService.entrarGrupo(
        selectedPrivateGroup.id,
        usuario.id,
        privateGroupCode
      );

      setFeedbackType("success");
      setFeedbackMessage(
        `Você entrou no grupo "${selectedPrivateGroup.nome}"!`
      );
      setFeedbackVisible(true);
      setPrivateModalVisible(false);
      loadGroups();
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(
        "Código inválido! Por favor, confira e tente novamente."
      );
      setFeedbackVisible(true);
    }
  };

  const renderGroupCard = (grupo) => {
    const nomeCriador = grupo.criador?.nome ?? "Desconhecido";
    const membrosCount = Array.isArray(grupo.membros)
      ? grupo.membros.length
      : grupo.membros?.count ?? 0;

    return (
      <TouchableOpacity
        key={grupo.id}
        style={styles.groupCard}
        onPress={() => handleGroupPress(grupo)}
      >
        <Image source={{ uri: grupo.urlFoto }} style={styles.groupImage} />
        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{grupo.nome}</Text>
            {grupo.tipoGrupo.toLowerCase() === "publico" ? (
              <MaterialIcons
                name="public"
                size={width * 0.04}
                color="#00D95F"
              />
            ) : (
              <Feather name="lock" size={width * 0.04} color="#FFD700" />
            )}
          </View>

          <Text style={styles.groupDescription}>
            {grupo.descricao?.length > 50
              ? grupo.descricao.substring(0, 50) + "..."
              : grupo.descricao}
          </Text>

          <Text style={styles.groupMembers}>
            {membrosCount}{" "}
            {membrosCount === 1 ? "Membro Ativo" : "Membros Ativos"}
          </Text>

          <Text style={styles.groupCategory}>Criador: {nomeCriador}</Text>
        </View>

        <View style={styles.enterButtonContainer}>
          <AntDesign name="rightcircle" size={width * 0.06} color="#00D95F" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Encontrar Grupos" showBackButton={false} />

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={width * 0.05}
          color="#B3B3B3"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar grupos ou criadores"
          placeholderTextColor="#B3B3B3"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={loadGroups}
        />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Carregando grupos...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {grupos.length === 0 ? (
            <Text style={styles.noGroupsText}>Nenhum grupo encontrado.</Text>
          ) : (
            grupos.map(renderGroupCard)
          )}
        </ScrollView>
      )}

      <ModalConfirmacao
        visible={confirmModalVisible}
        mensagem={`Deseja entrar no grupo "${grupoSelecionadoConfirmacao?.nome}"?`}
        onConfirm={confirmarEntradaGrupo}
        onCancel={() => {
          setConfirmModalVisible(false);
          setGrupoSelecionadoConfirmacao(null);
        }}
      />

      <ModalFeedback
        visible={feedbackVisible}
        type={feedbackType}
        message={feedbackMessage}
        onClose={() => setFeedbackVisible(false)}
      />

      <Modal
        visible={isPrivateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPrivateModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Entrar no Grupo Privado</Text>
            <Text style={styles.modalSubtitle}>
              Insira o código para entrar no grupo "{selectedPrivateGroup?.nome}
              "
            </Text>
            <TextInput
              style={styles.codeInput}
              placeholder="Código de Acesso"
              placeholderTextColor="#B3B3B3"
              value={privateGroupCode}
              onChangeText={setPrivateGroupCode}
            />

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={handlePrivateGroupEntry}
            >
              <Text style={styles.modalActionButtonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setPrivateModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CriarGrupoScreen")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <BottomNav active="EncontrarGruposScreen" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E" },
  scrollContent: { paddingHorizontal: width * 0.04, paddingBottom: 100 },
  loadingText: { color: "#FFF", textAlign: "center", marginTop: 20 },
  noGroupsText: { color: "#CCC", textAlign: "center", marginTop: 50 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    margin: width * 0.04,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: "#FFF", fontSize: width * 0.04 },

  groupCard: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    padding: 10,
    elevation: 5,
  },
  groupImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
    marginRight: 15,
  },
  groupInfo: { flex: 1 },
  groupHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  groupName: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginRight: 5,
  },
  groupDescription: {
    color: "#B3B3B3",
    fontSize: width * 0.035,
    marginBottom: 5,
  },
  groupMembers: { color: "#CCC", fontSize: width * 0.035 },
  groupCategory: { color: "#00D95F", fontSize: width * 0.03, marginTop: 2 },
  enterButtonContainer: { padding: 10 },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: width * 0.055,
    color: "#00D95F",
    marginBottom: 15,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: width * 0.04,
    color: "#FFF",
    marginBottom: 15,
    textAlign: "center",
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#00D95F",
    borderRadius: 10,
    padding: 10,
    fontSize: width * 0.045,
    color: "#FFF",
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
  },
  modalActionButton: {
    backgroundColor: "#00D95F",
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 10,
  },
  modalActionButtonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: width * 0.045,
  },
  closeModalButton: { marginTop: 10, padding: 10 },
  closeModalButtonText: { color: "#CCC", fontSize: width * 0.035 },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00D95F",
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: { color: "#000", fontSize: 24, fontWeight: "bold" },
});
