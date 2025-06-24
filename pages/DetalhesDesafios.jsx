import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { Header } from "../components/Header";
import { ProgressBar } from "../components/ProgressBar";
import { StatsCard } from "../components/StatsCard";
import { Cronograma } from "../components/Cronograma";
import { InfoCard } from "../components/InfoCard";
import { TimelineList } from "../components/TimelineList";
import { ButtonsGroup } from "../components/ButtonsGroup";
import { BottomNav } from "../components/BottomNav";
import { ModalConfirmacao } from "../components/ModalConfirm";
import { ModalFeedback } from "../components/ModalFeedback";
import { ActivityIndicator } from "react-native";

import { apiService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DetalhesDesafios = ({ navigation, route }) => {
  const { desafioId } = route.params;

  const [desafio, setDesafio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membros, setMembros] = useState([]);
  const [meuMembro, setMeuMembro] = useState(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModalDesistencia, setShowModalDesistencia] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [cronograma, setCronograma] = useState({
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    dom: false,
  });

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

  // Carregar detalhes do desafio
  useEffect(() => {
    const loadDesafio = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDesafioById(desafioId);
        setDesafio(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os detalhes do desafio");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadDesafio();
  }, [desafioId]);

  // Carregar membros do desafio
  useEffect(() => {
    const loadMembros = async () => {
      try {
        const data = await apiService.getMembrosByDesafio(desafioId);
        setMembros(data);
      } catch (error) {
        console.log("Erro ao buscar membros:", error);
      }
    };

    loadMembros();
  }, [desafioId]);

  // Encontrar o membro logado no desafio
  useEffect(() => {
    if (membros.length > 0 && userId) {
      const membroEncontrado = membros.find(
        (membro) => membro.usuario?.id === userId
      );
      setMeuMembro(membroEncontrado || null);
    }
  }, [membros, userId]);

  // Carregar ranking, timeline e cronograma
  useEffect(() => {
    if (!userId) return;

    const loadDados = async () => {
      try {
        const [checkinsDesafio, ranking, checkinsUsuario] = await Promise.all([
          apiService.getCheckInsByDesafioId(desafioId),
          apiService.getRankingByDesafioId(desafioId),
          apiService.getCheckInsByUsuarioId(userId),
        ]);

        // FILTRAR CHECK-INS DO DIA
        const hoje = new Date();
        const checkinsHoje = (checkinsDesafio || []).filter((checkin) => {
          if (!checkin.dataHoraCheckin) return false;
          const dataCheckin = new Date(checkin.dataHoraCheckin);
          return (
            dataCheckin.getDate() === hoje.getDate() &&
            dataCheckin.getMonth() === hoje.getMonth() &&
            dataCheckin.getFullYear() === hoje.getFullYear()
          );
        });
        setTimeline(checkinsHoje);

        // ORDENAR RANKING POR PONTUAÇÃO (do maior para o menor)
        const rankingOrdenado = (ranking || []).sort((a, b) => {
          const pontosA = a.pontuacao?.pontuacao || 0;
          const pontosB = b.pontuacao?.pontuacao || 0;
          return pontosB - pontosA;
        });
        setRankingData(rankingOrdenado);

        // DEFINIR POSIÇÃO DO USUÁRIO NO RANKING
        if (rankingOrdenado.length > 0) {
          const index = rankingOrdenado.findIndex(
            (item) => item.usuarioId === userId || item.usuario?.id === userId
          );

          if (index !== -1) {
            setMinhaPosicao(index + 1);
          } else {
            setMinhaPosicao("-");
          }
        }

        // CRONOGRAMA DA SEMANA
        const checkinsDesseDesafio = (checkinsUsuario || []).filter(
          (checkin) => checkin.membroDesafio?.desafio?.id === desafioId
        );

        const novoCronograma = {
          dom: false,
          seg: false,
          ter: false,
          qua: false,
          qui: false,
          sex: false,
          sab: false,
        };

        checkinsDesseDesafio.forEach((checkin) => {
          const dia = new Date(checkin.dataHoraCheckin).getDay();
          if (dia === 0) novoCronograma.dom = true;
          if (dia === 1) novoCronograma.seg = true;
          if (dia === 2) novoCronograma.ter = true;
          if (dia === 3) novoCronograma.qua = true;
          if (dia === 4) novoCronograma.qui = true;
          if (dia === 5) novoCronograma.sex = true;
          if (dia === 6) novoCronograma.sab = true;
        });

        setCronograma(novoCronograma);
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
        setTimeline([]);
      }
    };

    loadDados();
  }, [userId, desafioId]);

  // Desistir do desafio
  const handleDesistir = async () => {
    try {
      await apiService.desistirDoDesafio(desafio.id, userId);
      setFeedbackType("success");
      setFeedbackMessage("Você desistiu do desafio.");
      setShowFeedback(true);
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(error.message || "Erro ao desistir do desafio.");
      setShowFeedback(true);
    }
  };

  const calcularProgresso = (inicio, fim) => {
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);
    const hoje = new Date();

    if (hoje < dataInicio) return 0;
    if (hoje >= dataFim) return 100;

    const total = dataFim - dataInicio;
    const atual = hoje - dataInicio;

    return Math.round((atual / total) * 100);
  };

  const formatarData = (data) => {
    if (!data) return "";
    const parts = data.split ? data.split("-") : null;
    if (parts && parts.length === 3) {
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      return dateObj.toLocaleDateString("pt-BR");
    }
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const handleCheckin = () => {
    if (!meuMembro) {
      Alert.alert("Erro", "Membro não encontrado.");
      return;
    }

    navigation.navigate("CheckInFlow", {
      membroId: meuMembro.id,
    });
  };

  const handleVerRanking = () => {
    navigation.navigate("Ranking", { desafioId: desafio.id });
  };

  if (loading || !desafio || !meuMembro) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#1DB954"
          style={{ marginTop: 20 }}
        />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Acompanhar Desafio"
        showBackButton
        showShareButton
        onBackPress={() => navigation.goBack()}
        onSharePress={() => setShowModalDesistencia(true)}
        shareIconName="logout"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.desafioHeader}>
          {desafio.urlFoto ? (
            <View style={styles.imagemContainer}>
              <Image
                source={{ uri: desafio.urlFoto }}
                style={styles.imagemDesafio}
                resizeMode="cover"
              />
            </View>
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
        <ProgressBar
          progresso={calcularProgresso(desafio.dataInicio, desafio.dataFim)}
          posicao={minhaPosicao || "-"}
        />

        <View style={styles.statsRow}>
          <StatsCard
            icon={
              <MaterialIcons name="sports-handball" size={24} color="#1DB954" />
            }
            title="Ofensiva"
            value={meuMembro?.pontuacao?.diasConsecutivos || 0}
          />
          <StatsCard
            icon={
              <MaterialIcons name="emoji-events" size={24} color="#1DB954" />
            }
            title="Pontos"
            value={meuMembro?.pontuacao?.pontuacao || 0}
            style={{ marginLeft: 12 }}
          />
        </View>

        <Cronograma schedule={cronograma} />

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
          icon={<MaterialIcons name="category" size={24} color="#1DB954" />}
          label="Categoria"
          value={desafio.categoria?.nome || "Sem categoria"}
        />

        <InfoCard
          icon={<MaterialIcons name="groups" size={24} color="#1DB954" />}
          label="Grupo"
          value={desafio.grupos?.nome || "Sem grupo"}
        />
        <InfoCard
          icon={<MaterialIcons name="attach-money" size={24} color="#1DB954" />}
          label="Valor Aposta"
          value={`R$ ${Number(desafio.valorAposta)?.toFixed(2) || "0,00"}`}
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
          label="Recompensa"
          value={
            desafio.valorAposta && membros?.length > 0
              ? `R$ ${(Number(desafio.valorAposta) * membros.length).toFixed(
                  2
                )}`
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

        <TimelineList timeline={timeline} />

        {timeline.length === 0 && (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 8 }}>
            Nenhuma movimentação até agora.
          </Text>
        )}

        <ButtonsGroup
          onVerRanking={handleVerRanking}
          onCheckin={handleCheckin}
          loadingCheckin={checkinLoading}
        />
      </ScrollView>

      <BottomNav active="desafios" />

      <ModalConfirmacao
        visible={showModalDesistencia}
        mensagem="Tem certeza que deseja desistir do desafio?"
        onCancel={() => setShowModalDesistencia(false)}
        onConfirm={() => {
          setShowModalDesistencia(false);
          handleDesistir();
        }}
      />

      <ModalFeedback
        visible={showFeedback}
        type={feedbackType}
        message={feedbackMessage}
        onClose={() => {
          setShowFeedback(false);
          if (feedbackType === "success") {
            navigation.navigate("Home");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 24,
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
  desafioHeader: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },

  imagemContainer: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },

  imagemDesafio: {
    width: "100%",
    height: "100%",
  },

  imagemPlaceholder: {
    width: "100%",
    height: 180,
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
});
