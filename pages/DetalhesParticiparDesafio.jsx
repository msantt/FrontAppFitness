import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalConfirmacao } from "../components/ModalConfirm";
import { ModalFeedback } from "../components/ModalFeedback";

import { Header } from "../components/Header";
import { InfoCard } from "../components/InfoCard";
import { BottomNav } from "../components/BottomNav";
import ButtonDesafios from "../components/ButtonDesafios";
import { apiService } from "../services/api";

export const ParticiparDesafioScreen = ({ navigation, route }) => {
  const { desafioId } = route.params;

  const [desafio, setDesafio] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [participando, setParticipando] = useState(false);
  const [membros, setMembros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (email) {
          const usuario = await apiService.getUsuarioByEmail(email);
          setUserId(usuario.id);
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    };
    loadUsuario();
  }, []);

  useEffect(() => {
    const loadDesafio = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDesafioById(desafioId);
        setDesafio(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o desafio.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadDesafio();
  }, [desafioId]);

  useEffect(() => {
    const loadMembros = async () => {
      try {
        const data = await apiService.getMembrosByDesafio(desafioId);
        if (data && Array.isArray(data)) {
          setMembros(data);
        } else {
          setMembros([]);
        }
      } catch (error) {
        console.log("Erro ao buscar membros do desafio:", error.message);
        setMembros([]);
      }
    };

    if (desafioId) {
      loadMembros();
    }
  }, [desafioId]);

  const confirmarParticipacao = () => {
    setModalVisible(true);
  };

  const onConfirm = () => {
    setModalVisible(false);
    handleParticipar();
  };

  const onCancel = () => {
    setModalVisible(false);
  };

  const handleParticipar = async () => {
    if (!userId) {
      setFeedbackType("error");
      setFeedbackMessage("Usuário não encontrado.");
      setFeedbackVisible(true);
      return;
    }

    setParticipando(true);

    const dataAtual = new Date();
    const dataFormatada =
      dataAtual.getFullYear() +
      "-" +
      String(dataAtual.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(dataAtual.getDate()).padStart(2, "0");

    try {
      const body = {
        usuario: { id: userId },
        desafio: { id: desafioId },
        status: "ATIVO",
        dataConclusao: dataFormatada,
      };

      await apiService.participarDesafio(body);

      setFeedbackType("success");
      setFeedbackMessage(
        `Você agora faz parte deste desafio!\nO valor de R$ ${Number(
          desafio.valorAposta
        ).toFixed(2)} foi descontado do seu saldo.`
      );
      setFeedbackVisible(true);
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage("Não foi possível participar do desafio.Verifique o seu saldo!");
      setFeedbackVisible(true);
    } finally {
      setParticipando(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "";
    const date = new Date(data);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("pt-BR");
  };

  if (loading || !desafio) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Participar do Desafio"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.desafioHeader}>
          {desafio.urlFoto ? (
            <Image
              source={{ uri: desafio.urlFoto }}
              style={styles.imagemDesafio}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagemPlaceholder}>
              <MaterialIcons name="fitness-center" size={64} color="#1DB954" />
            </View>
          )}
          <Text style={styles.nomeDesafio}>{desafio.nome}</Text>
          <Text style={styles.descricaoDesafio}>
            {desafio.descricao || "Sem descrição cadastrada."}
          </Text>
        </View>

        <InfoCard
          icon={
            <MaterialIcons name="calendar-month" size={24} color="#1DB954" />
          }
          label="Início"
          value={formatarData(desafio.dataInicio)}
        />
        <InfoCard
          icon={
            <MaterialIcons name="calendar-month" size={24} color="#1DB954" />
          }
          label="Fim"
          value={formatarData(desafio.dataFim)}
        />
        <InfoCard
          icon={<MaterialIcons name="groups" size={24} color="#1DB954" />}
          label="Grupo"
          value={desafio.grupos?.nome || "Sem grupo"}
        />
        <InfoCard
          icon={<MaterialIcons name="attach-money" size={24} color="#1DB954" />}
          label="Valor Aposta"
          value={`R$ ${Number(desafio.valorAposta).toFixed(2)}`}
        />
        <InfoCard
          icon={<MaterialIcons name="groups" size={24} color="#1DB954" />}
          label="Membros Ativos"
          value={`${
            membros.filter((m) => m.status === "ATIVO").length
          } participantes`}
        />

        <InfoCard
          icon={<MaterialIcons name="attach-money" size={24} color="#1DB954" />}
          label="Valor Arrecadado"
          value={
            desafio.valorAposta
              ? `R$ ${(
                  Number(desafio.valorAposta) *
                  membros.filter((m) => m.status === "ATIVO").length
                ).toFixed(2)}`
              : "R$ 0,00"
          }
        />

        <InfoCard
          icon={<MaterialIcons name="person" size={24} color="#1DB954" />}
          label="Criador"
          value={desafio.criador?.nome || "Não informado"}
        />
        <InfoCard
          icon={
            <MaterialIcons name="business-center" size={24} color="#1DB954" />
          }
          label="Patrocinador"
          value={desafio.patrocinador?.nome || "Sem patrocinador"}
        />

        <View style={{ marginTop: 24 }}>
          <ButtonDesafios
            title={participando ? "Participando..." : "Participar do Desafio"}
            onPress={confirmarParticipacao}
            disabled={participando}
            loading={participando}
          />
        </View>
      </ScrollView>
      <ModalFeedback
        visible={feedbackVisible}
        type={feedbackType}
        message={feedbackMessage}
        onClose={() => {
          setFeedbackVisible(false);
          if (feedbackType === "success") {
            navigation.replace("DetalhesDesafios", { desafioId });
          }
        }}
      />

      {/* Modal de confirmação customizado */}
      <ModalConfirmacao
        visible={modalVisible}
        mensagem={`Deseja participar deste desafio?\n\nValor da aposta: R$ ${Number(
          desafio.valorAposta
        ).toFixed(2)}`}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <BottomNav active="DesafiosScreen" />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  desafioHeader: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  imagemDesafio: {
    width: width - 64,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagemPlaceholder: {
    width: width - 64,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  nomeDesafio: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  descricaoDesafio: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 8,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#CCC",
    marginTop: 12,
  },
});
