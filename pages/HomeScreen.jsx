import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { DesafioCard } from "../components/DesafioCard";
import { BottomNav } from "../components/BottomNav";
import TextComponent from "../components/Text";
import { apiService } from "../services/api";
import { Cronograma } from "../components/Cronograma";

export function HomeScreen() {
  const navigation = useNavigation();

  // Estados do usuário
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [pontos, setPontos] = useState(0);
  const [ofensiva, setOfensiva] = useState(0);
  const [ultimosCheckins, setUltimosCheckins] = useState([]);

  // Estado do cronograma
  const [cronogramaUltimosCheckins, setCronogramaUltimosCheckins] = useState({
    dom: false,
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
  });

  const [myChallenges, setMyChallenges] = useState([]); // array de objetos de desafio
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // controla exibição de loading inicial

  // Função para carregar dados do usuário e retornar o ID
  const loadUsuario = useCallback(async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        throw new Error("Usuário não encontrado no armazenamento local");
      }

      const usuario = await apiService.getUsuarioByEmail(email);
      if (!usuario || !usuario.id) {
        throw new Error("Usuário inválido retornado pela API");
      }

      setUserId(usuario.id);
      setUserName(usuario.nome);
      setUserPhoto(usuario.urlFoto);
      setErrorMsg(null);
      return usuario.id;
    } catch (error) {
      setErrorMsg(`Erro ao carregar usuário: ${error.message}`);
      setUserId(null);
      setUserName("");
      setUserPhoto("");
      setPontos(0);
      setOfensiva(0);
      return null;
    }
  }, []);

  async function getMembrosDesafioPorIds(ids) {
    const membros = [];
    for (const id of ids) {
      try {
        const membro = await apiService.getMembroDesafioPorId(id);
        membros.push(membro);
      } catch {}
    }
    return membros;
  }

  const loadUltimosCheckins = useCallback(async (uid) => {
    try {
      const checkinsUsuario = await apiService.getCheckInsByUsuarioId(uid);
      const checkins = checkinsUsuario || [];

      setUltimosCheckins(checkins);

      const novoCronograma = {
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
      };
      const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

      const membroDesafioIds = Array.from(
        new Set(
          checkins
            .map((checkin) => checkin.membroDesafio?.id)
            .filter((id) => id != null)
        )
      );
      const membrosDesafios = await getMembrosDesafioPorIds(membroDesafioIds);

      let totalPontos = 0;
      membrosDesafios.forEach((membro) => {
        totalPontos += membro.pontuacao?.pontuacao || 0;
      });

      checkins.forEach((checkin) => {
        const dia = new Date(checkin.dataHoraCheckin).getDay();
        novoCronograma[diasSemana[dia]] = true;
      });
      const datasUnicas = Array.from(
        new Set(
          checkins.map((c) => {
            const d = new Date(c.dataHoraCheckin);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          })
        )
      )
        .map((time) => new Date(time))
        .sort((a, b) => a - b);

      let sequenciaAtual = 1;
      let maiorSequencia = 1;
      for (let i = 1; i < datasUnicas.length; i++) {
        const anterior = datasUnicas[i - 1];
        const atual = datasUnicas[i];
        const diffDias = Math.round((atual - anterior) / (1000 * 60 * 60 * 24));
        if (diffDias === 1) {
          sequenciaAtual++;
        } else {
          sequenciaAtual = 1;
        }
        if (sequenciaAtual > maiorSequencia) {
          maiorSequencia = sequenciaAtual;
        }
      }

      setPontos(totalPontos);
      setOfensiva(maiorSequencia);
      setCronogramaUltimosCheckins(novoCronograma);
    } catch {
      setUltimosCheckins([]);
      setCronogramaUltimosCheckins({
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
      });
      setOfensiva(0);
    }
  }, []);
  const loadChallenges = useCallback(
    async (uidParam) => {
      const uid = uidParam ?? userId;
      if (!uid) return;
      try {
        setLoading(true);
        setErrorMsg(null);
        const meus = await apiService.getDesafiosByUsuario(uid);
        let meusArrayRaw = Array.isArray(meus) ? meus : meus?.data || [];
        const meusArrayAtivos = meusArrayRaw.filter(
          (m) => m.status === "ATIVO"
        );
        const meusDesafiosExtraidos = meusArrayAtivos
          .map((m) => m.desafio)
          .filter((d) => d != null && d.status === "ATIVO");

        setMyChallenges(meusDesafiosExtraidos);
        const recomendar = await apiService.getDesafios();
        console.log("Desafios Recomendados (API raw):", recomendar);
        const recArrayRaw = Array.isArray(recomendar)
          ? recomendar
          : recomendar?.data || [];
        setRecommendedChallenges(recArrayRaw);
        await loadUltimosCheckins(uid);
      } catch (error) {
        console.error("Erro loadChallenges:", error);
        setErrorMsg("Erro ao carregar desafios. Tente novamente mais tarde.");
        setMyChallenges([]);
        setRecommendedChallenges([]);
      } finally {
        setLoading(false);
        setIsDataLoaded(true);
      }
    },
    [userId, loadUltimosCheckins]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsDataLoaded(false);
    try {
      const id = await loadUsuario();
      if (id) {
        await loadChallenges(id);
      }
    } catch (e) {
      console.warn("Erro no refresh:", e);
    }
    setRefreshing(false);
  }, [loadUsuario, loadChallenges]);

  useEffect(() => {
    (async () => {
      setIsDataLoaded(false);
      const id = await loadUsuario();
      if (id) {
        await loadChallenges(id);
      } else {
        setIsDataLoaded(true);
      }
    })();
  }, [loadUsuario, loadChallenges]);

  const handleChallengePress = useCallback(
    (desafio) => {
      navigation.navigate("DetalhesDesafios", { desafioId: desafio.id });
    },
    [navigation]
  );
  const handleExploreChallengesPress = useCallback(() => {
    navigation.navigate("DesafiosScreen");
  }, [navigation]);
  const handleMeusDesafiosPress = useCallback(() => {
    navigation.navigate("DesafiosScreen");
  }, [navigation]);

  const renderDesafiosSection = useCallback(
    (title, desafiosList, buttonLabel, onButtonPress) => {
      if (!desafiosList || desafiosList.length === 0) {
        return null;
      }
      return (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <TextComponent style={styles.sectionTitle}>{title}</TextComponent>
            {buttonLabel && onButtonPress && (
              <TouchableOpacity
                onPress={onButtonPress}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>{buttonLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengesContainer}
          >
            {desafiosList.map((desafio, index) => (
              <View
                key={`${desafio.id}-${index}`}
                style={[
                  styles.challengeCardContainer,
                  { marginRight: index === desafiosList.length - 1 ? 0 : 16 },
                ]}
              >
                <DesafioCard
                  desafio={desafio}
                  onPress={() => handleChallengePress(desafio)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      );
    },
    [handleChallengePress]
  );

  if (!isDataLoaded) {
    return (
      <View style={styles.container}>
        <Header title="Bem Vindo" subtitle="Pronto para um Próximo Desafio?" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D95F" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
        <BottomNav active="Home" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Bem Vindo, ${userName || "Usuário"}`}
        subtitle="Pronto para um Próximo Desafio?"
        userPhoto={userPhoto}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00D95F"
            colors={["#00D95F"]}
          />
        }
      >
        {/* Container de ofensiva e pontos lado a lado */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ofensiva</Text>
            <Text style={styles.statValue}>{ofensiva} Dias</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pontos</Text>
            <Text style={styles.statValue}>{pontos}</Text>
          </View>
        </View>

        {/* Cronograma dos últimos check-ins */}
        <View style={styles.cronogramaContainer}>
          <Cronograma schedule={cronogramaUltimosCheckins} />
        </View>

        {/* Mensagem de erro, se houver */}
        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Seção “Meus Desafios” */}
        {renderDesafiosSection(
          "Meus Desafios",
          myChallenges,
          "Ver todos",
          handleMeusDesafiosPress
        )}

        {/* Seção “Descobrir” / recomendados */}
        {renderDesafiosSection(
          "Descobrir",
          recommendedChallenges,
          "Explorar",
          handleExploreChallengesPress
        )}
      </ScrollView>

      <BottomNav active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  // Estatísticas lado a lado
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 24,
    gap: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00D95F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  statLabel: {
    color: "#8F8F8F",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statValue: {
    color: "#00D95F",
    fontSize: 28,
    fontWeight: "bold",
  },

  // Cronograma
  cronogramaContainer: {
    marginHorizontal: 5,
    marginBottom: 32,
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Seções de desafios
  section: {
    marginBottom: 36,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  seeAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#00D95F",
  },
  challengesContainer: {
    paddingHorizontal: 8,
  },
  challengeCardContainer: {},

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loadingText: {
    color: "#00D95F",
    fontSize: 18,
    fontWeight: "600",
  },

  // Erro
  errorContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.12)",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.4)",
    shadowColor: "rgba(220, 38, 38, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 4,
  },
  errorText: {
    color: "#F87171",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
});
