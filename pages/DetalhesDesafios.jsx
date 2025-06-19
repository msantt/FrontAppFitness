import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "../components/Header";
import ButtonDesafios from "../components/ButtonDesafios";
import { apiService } from "../services/apiMooks";
import { BottomNav } from "../components/BottomNav";

const { width } = Dimensions.get("window");

export const DetalhesDesafios = ({ navigation, route }) => {
  const { desafioId } = route.params;
  const [desafio, setDesafio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [userId, setUserId] = useState("u1");

  const loadDesafioDetalhes = async () => {
    try {
      const data = await apiService.getDesafioById(desafioId);
      setDesafio(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes do desafio");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadTimeline = async () => {
    try {
      const checkins = await apiService.getCheckInsByDesafioId(desafioId);
      setTimeline(checkins);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a timeline");
    }
  };

  const loadRankingUsuario = async () => {
    try {
      const ranking = await apiService.getRankingByDesafioId(desafioId);

      const meuRanking = ranking.find((item) => item.usuarioId === userId);

      if (meuRanking) {
        setDesafio((prev) => ({
          ...prev,
          pontosGanhos: meuRanking.pontos,
          posicao: meuRanking.posicao,
        }));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o ranking do usuário");
    }
  };

  const confirmarDesistencia = () => {
    Alert.alert(
      "Confirmação de Desistência",
      "Você tem certeza que deseja desistir deste desafio?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desistir",
          style: "destructive",
          onPress: () => handleDesistir(),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDesistir = async () => {
    try {
      await apiService.desistirDoDesafio(desafio.id, userId);
      Alert.alert(
        "Sucesso",
        "Você desistiu do desafio e seu saldo foi atualizado."
      );
      navigation.goBack();
    } catch (error) {
      const mensagemErro =
        error.message || "Não foi possível desistir do desafio.";
      Alert.alert("Erro", mensagemErro);
    }
  };
  useEffect(() => {
    const loadDados = async () => {
      try {
        setLoading(true);
        await loadDesafioDetalhes();
        await loadTimeline();
        await loadRankingUsuario();
        await loadCheckinsUsuario();
      } catch (error) {
        // opcional: lidar com erros gerais
      } finally {
        setLoading(false);
      }
    };
    loadDados();
  }, [desafioId]);

  const renderTimeline = () => {
    if (!timeline || timeline.length === 0) {
      return (
        <Text style={styles.noTimelineText}>
          Nenhum check-in registrado para este desafio.
        </Text>
      );
    }

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Timeline</Text>
        <View style={styles.timelineLine} />

        {timeline.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelinePoint}>
              <View
                style={[
                  styles.timelineDot,
                  item.status.toLowerCase() === "concluido" &&
                    styles.timelineDotCompleted,
                  item.status.toLowerCase() === "em_andamento" &&
                    styles.timelineDotActive,
                  item.status.toLowerCase() === "pendente" &&
                    styles.timelineDotPending,
                ]}
              />
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
                  style={styles.participanteAvatar}
                />
                <View style={styles.participanteTexto}>
                  <Text style={styles.participanteNome}>
                    {item.membroDesafio.usuario.nome}
                  </Text>
                  <Text style={styles.participanteStatus}>
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const handleCheckin = () => {
    navigation.navigate("CheckinDesafio", {
      desafioId: desafio.id,
      nomeDesafio: desafio.nome,
    });
  };

  const handleVerRanking = () => {
    navigation.navigate("Ranking", {
      desafioId: desafio.id,
      nomeDesafio: desafio.nome,
    });
  };

  function calcularProgresso(dataInicioStr, dataFimStr, dataAtualStr = null) {
    const parseDate = (str) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return new Date(str + "T00:00:00");
      }
      const [dia, mes, ano] = str.split("-");
      return new Date(`${ano}-${mes}-${dia}T00:00:00`);
    };

    const dataInicio = parseDate(dataInicioStr);
    const dataFim = parseDate(dataFimStr);
    const hoje = dataAtualStr ? parseDate(dataAtualStr) : new Date();

    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    if (hoje < dataInicio) return 0;
    if (hoje >= dataFim) return 100;

    const diffTotal = (dataFim - dataInicio) / (1000 * 60 * 60 * 24);
    const diffHoje = (hoje - dataInicio) / (1000 * 60 * 60 * 24);

    const progresso = (diffHoje / diffTotal) * 100;

    return Math.round(progresso);
  }

  const [cronograma, setCronograma] = useState({
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    dom: false,
  });

  const loadCheckinsUsuario = async () => {
    try {
      const checkins = await apiService.getCheckInsByUsuarioId(userId);

      const checkinsDesseDesafio = checkins.filter(
        (checkin) => checkin.membroDesafio.desafio.id === "1"
      );

      console.log("Check-ins do desafio:", checkinsDesseDesafio);
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
        const data = new Date(checkin.dataHoraCheckin);
        const diaSemana = data.getDay();

        switch (diaSemana) {
          case 0:
            novoCronograma.dom = true;
            break;
          case 1:
            novoCronograma.seg = true;
            break;
          case 2:
            novoCronograma.ter = true;
            break;
          case 3:
            novoCronograma.qua = true;
            break;
          case 4:
            novoCronograma.qui = true;
            break;
          case 5:
            novoCronograma.sex = true;
            break;
          case 6:
            novoCronograma.sab = true;
            break;
        }
      });

      setCronograma(novoCronograma);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o cronograma.");
    }
  };

  const renderCronograma = () => {
    const dias = [
      { key: "dom", label: "Dom" },
      { key: "seg", label: "Seg" },
      { key: "ter", label: "Ter" },
      { key: "qua", label: "Qua" },
      { key: "qui", label: "Qui" },
      { key: "sex", label: "Sex" },
      { key: "sab", label: "Sab" },
    ];

    return (
      <View style={styles.cronogramaContainer}>
        {dias.map((dia) => (
          <View key={dia.key} style={styles.diaContainer}>
            <Text style={styles.diaLabel}>{dia.label}</Text>
            <View
              style={[
                styles.diaIndicator,
                cronograma[dia.key] ? styles.diaCompleto : styles.diaPendente,
              ]}
            >
              {cronograma[dia.key] && <Text style={styles.checkIcon}>✓</Text>}
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading || !desafio) {
    return (
      <View style={styles.container}>
        <Header
          title="Carregando..."
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </View>
    );
  }

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Acompanhar Desafios"
        showBackButton
        showShareButton
        onBackPress={() => navigation.goBack()}
        onSharePress={confirmarDesistencia}
        shareIconName="exit-to-app"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.desafioHeader}>
          <Image source={{ uri: desafio.imagem }} style={styles.desafioImage} />
          <View style={styles.desafioInfo}>
            <Text style={styles.desafioNome}>{desafio.nome}</Text>
            <Text style={styles.desafioDescricao}>{desafio.descricao}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {calcularProgresso(desafio.dataInicio, desafio.dataFim)}%
            </Text>
            <View style={styles.posicaoContainer}>
              <Text style={styles.posicaoText}>Posição: {desafio.posicao}</Text>
              <Text style={styles.posicaoIcon}>🔥</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calcularProgresso(
                    desafio.dataInicio,
                    desafio.dataFim
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.ofensivaContainer}>
            <View style={styles.ofensivaIcon}>
              <Text style={styles.leafIcon}>🍃</Text>
            </View>
            <Text style={styles.ofensivaText}>Ofensiva</Text>
            <Text style={styles.ofensivaDias}>
              {desafio.diasRestantes} Dias
            </Text>
          </View>

          <View style={styles.pontosContainer}>
            <Text style={styles.pontosLabel}>
              Pontos: {desafio.pontosGanhos}
            </Text>
          </View>
        </View>

        {renderCronograma()}

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <MaterialIcons name="event" size={24} color="#1DB954" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Período</Text>
              <Text style={styles.infoValue}>
                {formatarData(desafio.dataInicio)} até{" "}
                {formatarData(desafio.dataFim)}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="groups" size={24} color="#1DB954" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Ativos</Text>
              <Text style={styles.infoValue}>{desafio.ativos}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="attach-money" size={24} color="#1DB954" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Valor da Aposta</Text>
              <Text style={styles.infoValue}>
                R$ {Number(desafio.valorAposta).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="card-giftcard" size={24} color="#1DB954" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Recompensa Total</Text>
              <Text style={styles.infoValue}>
                R${" "}
                {(Number(desafio.valorAposta) * Number(desafio.ativos)).toFixed(
                  2
                )}
              </Text>
            </View>
          </View>
        </View>

        {renderTimeline()}

        <View style={styles.buttonsContainer}>
          <ButtonDesafios
            title="Ver Ranking"
            onPress={handleVerRanking}
            variant="outline"
            style={styles.button}
          />
          <ButtonDesafios
            title="Fazer Check-in"
            onPress={handleCheckin}
            loading={checkinLoading}
            style={styles.button}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomNav active={"DesafiosScreen"} />
      </View>
    </View>
  );
};

const colors = {
  background: "#121212",
  cardBackground: "#1E1E1E",
  cardBackgroundAlt: "#333333",
  primary: "#1DB954", // verde destaque
  primaryDark: "#178C3F", // verde escuro para hover/borda
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#CCC",
  textMuted: "#7A7A7A",
  textLight: "#999999",
  danger: "#F44336",
  warning: "#FFD700",
  shadow: "#000000",
  border: "#444444",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // HEADER DO DESAFIO
  desafioHeader: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  desafioImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  desafioInfo: {
    flex: 1,
  },
  desafioNome: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
  desafioDescricao: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 4,
  },

  // PROGRESSO
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  posicaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  posicaoText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  posicaoIcon: {
    color: colors.primary,
  },
  progressBar: {
    height: 16,
    backgroundColor: colors.cardBackgroundAlt,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  // STATS
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  ofensivaContainer: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  ofensivaIcon: {
    backgroundColor: colors.cardBackgroundAlt,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  leafIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  ofensivaText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  ofensivaDias: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  pontosContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  pontosLabel: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "bold",
  },

  // CRONOGRAMA
  cronogramaContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  diaContainer: {
    alignItems: "center",
  },
  diaLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    marginBottom: 6,
  },
  diaIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  diaCompleto: {
    backgroundColor: colors.primary,
  },
  diaPendente: {
    backgroundColor: colors.border,
  },
  checkIcon: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },

  // INFO
  infoContainer: {
    marginVertical: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222222",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 2,
  },
  dataContainer: {
    marginBottom: 8,
  },
  dataLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  dataText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  ativosContainer: {
    marginBottom: 8,
  },
  ativosText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  valorApostaContainer: {
    marginBottom: 8,
  },
  valorRecompensaContainer: {
    marginBottom: 8,
  },
  valorApostaText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  valorRecompensaText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },

  // TIMELINE
  timelineContainer: {
    marginBottom: 24,
  },
  timelineTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  timelineLine: {
    position: "absolute",
    left: 24,
    top: 50,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border,
  },
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
  },
  timelineDotCompleted: {
    backgroundColor: colors.primary,
  },
  timelineDotActive: {
    backgroundColor: colors.warning,
  },
  timelineDotPending: {
    backgroundColor: colors.danger,
  },
  timelineTime: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  timelineContent: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
  },
  participanteInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  participanteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participanteTexto: {
    flex: 1,
  },
  participanteNome: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  participanteDistancia: {
    color: colors.primary,
    fontSize: 12,
  },
  participanteStatus: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  // BOTÕES
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
  },

  // BOTTOM NAV
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.cardBackground,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
