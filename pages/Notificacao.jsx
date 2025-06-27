import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Header } from "../components/Header";
import { apiService } from "../services/api";

const { width, height } = Dimensions.get("window");

// Usar percentual para responsividade
const modalWidth = width * 0.85;
const modalPadding = 24;

const colors = {
  background: "#121212",
  cardBackground: "#1E1E1E",
  primary: "#1DB954",
  textPrimary: "#FFFFFF",
  textSecondary: "#CCC",
  textMuted: "#7A7A7A",
  border: "#444444",
  shadow: "#000000",
};

const tipoNotificacaoParaIcone = {
  CHECK_IN: { name: "check-circle-outline", color: colors.primary },
  NOVO_DESAFIO: { name: "trophy-outline", color: "#ffc107" },
  NOVO_MEMBRO: { name: "account-plus-outline", color: "#17a2b8" },
  NOVO_COMENTARIO: { name: "comment-outline", color: "#fd7e14" },
  ALERTA_TEMPO: { name: "alarm-light-outline", color: "#dc3545" },
  DESAFIO_ENCERRADO: { name: "flag-checkered", color: "#6f42c1" },
  PREMIO_DESAFIO: { name: "gift-outline", color: "#e83e8c" },
  DESAFIO_CANCELADO: { name: "close-circle-outline", color: "#dc3545" },
  CONVITE_GRUPO: { name: "account-multiple-plus-outline", color: "#007bff" },
  CONVITE_DESAFIO: { name: "account-star-outline", color: "#6610f2" },
  NOVO_MEMBRO_DESAFIO: { name: "account-group-outline", color: "#20c997" },
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  d.setHours(d.getHours() - 3);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

const formatDateOnly = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.split("T")[0].split("-");
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
};

const NotificacaoItem = ({ notificacao, onPress }) => {
  const tipo = notificacao.tipo ?? "NOVO_DESAFIO";
  const { name, color } = tipoNotificacaoParaIcone[tipo] || {
    name: "bell-outline",
    color: colors.textMuted,
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.85}
      onPress={() => onPress(notificacao)}
    >
      <View style={[styles.iconWrapper, { backgroundColor: color + "33" }]}>
        <Icon name={name} size={28} color={color} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.message} numberOfLines={3} ellipsizeMode="tail">
          {notificacao.mensagem ?? "Sem mensagem"}
        </Text>
        <Text style={styles.dateText}>
          {formatDateTime(notificacao.dataCriacao)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificacaoGrupo = ({ grupo, onPress }) => (
  <View style={styles.groupContainer}>
    <Text style={styles.groupDate}>{formatDateOnly(grupo.data_criacao)}</Text>
    {(grupo.notificacoes ?? []).map((notificacao, index) => (
      <NotificacaoItem
        key={notificacao.uuid || index}
        notificacao={notificacao}
        onPress={onPress}
      />
    ))}
  </View>
);

const agruparPorData = (notificacoes) => {
  const gruposMap = {};

  notificacoes.forEach((notif) => {
    const dataSimples = notif.dataCriacao.split("T")[0]; // só a data sem hora
    if (!gruposMap[dataSimples]) gruposMap[dataSimples] = [];
    gruposMap[dataSimples].push(notif);
  });

  const gruposArray = Object.entries(gruposMap).map(
    ([data_criacao, notificacoes]) => ({
      data_criacao,
      notificacoes,
    })
  );

  gruposArray.sort((a, b) => (a.data_criacao < b.data_criacao ? 1 : -1));

  return gruposArray;
};

export const Notificacao = () => {
  const [userId, setUserId] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [notificacaoAberta, setNotificacaoAberta] = useState(null);

  const loadUsuario = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email)
        throw new Error("Usuário não encontrado no armazenamento local");

      const usuario = await apiService.getUsuarioByEmail(email);
      if (!usuario || !usuario.id)
        throw new Error("Usuário inválido retornado pela API");

      setUserId(usuario.id);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg(`Erro ao carregar usuário: ${error.message}`);
      setUserId(null);
      setLoading(false);
    }
  };

  const loadDados = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const notificacoes =
        (await apiService.getNotificacoesByUsuario(userId)) ?? [];
      const gruposAgrupados = agruparPorData(notificacoes);
      setGrupos(gruposAgrupados);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as notificações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuario();
  }, []);

  useEffect(() => {
    if (userId) {
      loadDados();
    }
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDados();
    setRefreshing(false);
  };

  const abrirNotificacao = (notificacao) => {
    setNotificacaoAberta(notificacao);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setNotificacaoAberta(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notificações"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.modalTitle}>Detalhes da Notificação</Text>
              <Text style={styles.modalMessage}>
                {notificacaoAberta?.mensagem ?? "Sem mensagem"}
              </Text>
              <Text style={styles.modalDate}>
                {formatDateTime(notificacaoAberta?.dataCriacao)}
              </Text>
              <Pressable style={styles.closeButton} onPress={fecharModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{errorMsg}</Text>
        </View>
      ) : grupos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma notificação disponível</Text>
        </View>
      ) : (
        <FlatList
          data={grupos}
          keyExtractor={(item) => item.data_criacao}
          renderItem={({ item }) => (
            <NotificacaoGrupo grupo={item} onPress={abrirNotificacao} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.textSecondary}
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: colors.textSecondary },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  groupContainer: {
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  groupDate: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },

  itemContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textWrapper: { flex: 1 },
  message: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: modalPadding,
    width: modalWidth,
    maxHeight: height * 0.7,
    shadowColor: colors.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Notificacao;
