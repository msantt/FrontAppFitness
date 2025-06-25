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
import TextComponent from "../components/Text"; // Assuming this is a custom text component for styling
import { apiService } from "../services/api";
import { Cronograma } from "../components/Cronograma";

export function HomeScreen() {
  const navigation = useNavigation();

  // User States
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [pontos, setPontos] = useState(0);
  const [ofensiva, setOfensiva] = useState(0);
  const [ultimosCheckins, setUltimosCheckins] = useState([]);

  // Schedule State
  const [cronogramaUltimosCheckins, setCronogramaUltimosCheckins] = useState({
    dom: false,
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
  });

  const [myChallenges, setMyChallenges] = useState([]); // array of challenge objects
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);

  // Control States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // controls initial loading display

  // Function to load user data and return ID
  const loadUsuario = useCallback(async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        throw new Error("User not found in local storage");
      }

      const usuario = await apiService.getUsuarioByEmail(email);
      if (!usuario || !usuario.id) {
        throw new Error("Invalid user returned by API");
      }

      setUserId(usuario.id);
      setUserName(usuario.nome);
      setUserPhoto(usuario.urlFoto);
      setErrorMsg(null);
      return usuario.id;
    } catch (error) {
      setErrorMsg(`Error loading user: ${error.message}`);
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
      } catch (e) {
        // console.warn(`Failed to get membroDesafio for ID ${id}:`, e);
        // Continue to the next ID even if one fails
      }
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

      let maiorSequencia = 0;

      if (datasUnicas.length > 0) {
        let sequenciaAtual = 1;
        maiorSequencia = 1;

        for (let i = 1; i < datasUnicas.length; i++) {
          const anterior = datasUnicas[i - 1];
          const atual = datasUnicas[i];
          const diffDias = Math.round(
            (atual - anterior) / (1000 * 60 * 60 * 24)
          );

          if (diffDias === 1) {
            sequenciaAtual++;
          } else {
            sequenciaAtual = 1;
          }

          if (sequenciaAtual > maiorSequencia) {
            maiorSequencia = sequenciaAtual;
          }
        }
      } else {
        maiorSequencia = 0;
      }

      setOfensiva(maiorSequencia);
      setPontos(totalPontos);
      setCronogramaUltimosCheckins(novoCronograma);
    } catch (error) {
      console.error("Error loading last check-ins:", error);
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
      setPontos(0);
      setErrorMsg("Error loading check-in data.");
    }
  }, []);

  const loadChallenges = useCallback(
    async (uidParam) => {
      const uid = uidParam ?? userId;
      if (!uid) return; // Ensure userId is available

      setLoading(true);
      setErrorMsg(null);
      try {
        // Load "My Challenges"
        const meus = await apiService.getDesafiosByUsuario(uid);
        const meusArrayRaw = Array.isArray(meus) ? meus : meus?.data || [];
        const meusArrayAtivos = meusArrayRaw.filter(
          (m) => m.status === "ATIVO"
        );
        const meusDesafiosExtraidos = meusArrayAtivos
          .map((m) => m.desafio)
          .filter((d) => d != null && d.status === "ATIVO");

        setMyChallenges(meusDesafiosExtraidos);

        // Load "Recommended Challenges"
        const recomendar = await apiService.getDesafios();
        const recArrayRaw = Array.isArray(recomendar)
          ? recomendar
          : recomendar?.data || [];
        setRecommendedChallenges(recArrayRaw);

        // Load latest check-ins (which also updates points and offensive)
        await loadUltimosCheckins(uid);
      } catch (error) {
        console.error("Error loading challenges:", error);
        setErrorMsg("Error loading challenges. Please try again later.");
        setMyChallenges([]);
        setRecommendedChallenges([]);
        setPontos(0);
        setOfensiva(0);
        setCronogramaUltimosCheckins({
          dom: false,
          seg: false,
          ter: false,
          qua: false,
          qui: false,
          sex: false,
          sab: false,
        });
      } finally {
        setLoading(false);
        setIsDataLoaded(true);
      }
    },
    [userId, loadUltimosCheckins] // Depend on userId and loadUltimosCheckins
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Reset dataLoaded state to show loading indicator if desired during refresh
    setIsDataLoaded(false);
    try {
      const id = await loadUsuario();
      if (id) {
        await loadChallenges(id);
      } else {
        // If user ID not found after refresh, still set data loaded to false
        setIsDataLoaded(true);
      }
    } catch (e) {
      console.warn("Error during refresh:", e);
      setErrorMsg("Failed to refresh data.");
      setIsDataLoaded(true);
    }
    setRefreshing(false);
  }, [loadUsuario, loadChallenges]); // Dependencies for onRefresh

  // Initial data load effect
  useEffect(() => {
    const initializeData = async () => {
      setIsDataLoaded(false); // Start with loading indicator
      const id = await loadUsuario();
      if (id) {
        await loadChallenges(id);
      } else {
        setIsDataLoaded(true); // If no user, stop loading and show empty state/error
      }
    };
    initializeData();
  }, [loadUsuario, loadChallenges]); // Dependencies for initial data load

  const handleChallengePress = useCallback(
    (desafio) => {
      // Check if user is a member of the challenge
      const isMember = myChallenges.some((d) => d.id === desafio.id);

      if (isMember) {
        navigation.navigate("DetalhesDesafios", { desafioId: desafio.id });
      } else {
        navigation.navigate("ParticiparDesafio", { desafioId: desafio.id });
      }
    },
    [navigation, myChallenges]
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
        return null; // Don't render section if no challenges
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

  // Show a full-screen loading indicator initially
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
            colors={["#00D95F"]} // For Android
          />
        }
      >
        {/* Offensive and Points Container */}
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

        {/* Latest Check-ins Schedule */}
        <View style={styles.cronogramaContainer}>
          <Cronograma schedule={cronogramaUltimosCheckins} />
        </View>

        {/* Error Message, if any */}
        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* "My Challenges" Section */}
        {renderDesafiosSection(
          "Meus Desafios",
          myChallenges,
          "Ver todos",
          handleMeusDesafiosPress
        )}

        {/* "Discover" / Recommended Challenges Section */}
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
    backgroundColor: "#121212", // Dark background for minimalist feel
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24, // Added vertical padding
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for BottomNav
  },

  // Side-by-side Statistics
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -5, // Compensate for inner padding if needed, or adjust padding directly
    marginBottom: 32, // More space below stats
    gap: 16, // Space between stat boxes
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Slightly lighter dark for contrast
    borderRadius: 12, // Slightly less rounded for a cleaner look
    paddingVertical: 18, // Reduced padding
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00D95F", // Green glow
    shadowOffset: { width: 0, height: 4 }, // Subtle shadow downwards
    shadowOpacity: 0.3, // Softer shadow
    shadowRadius: 8,
    elevation: 6, // Android shadow
  },
  statLabel: {
    color: "#8F8F8F", // Muted grey for labels
    fontSize: 14, // Slightly smaller font
    fontWeight: "600",
    marginBottom: 6, // Reduced margin
    letterSpacing: 0.8, // Reduced letter spacing
    textTransform: "uppercase",
  },
  statValue: {
    color: "#00D95F", // Bright green for values
    fontSize: 30, // Larger for emphasis
    fontWeight: "bold",
  },

  // Cronograma
  cronogramaContainer: {
    marginHorizontal: 0, // Align with other content
    marginBottom: 32,
    backgroundColor: "#1E1E1E",
    padding: 18, // Slightly reduced padding
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // Softer shadow
    shadowRadius: 6,
    elevation: 4,
  },

  // Challenge Sections
  section: {
    marginBottom: 36, // Increased spacing between sections
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16, // Reduced margin
    paddingHorizontal: 0, // Align with content
  },
  sectionTitle: {
    fontSize: 20, // Slightly smaller
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5, // Reduced letter spacing
  },
  seeAllButton: {
    paddingVertical: 4, // Smaller touch area
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14, // Slightly smaller
    fontWeight: "600",
    color: "#00D95F",
  },
  challengesContainer: {
    paddingHorizontal: 0, // Align with content
  },
  challengeCardContainer: {
    // Keep existing margin between cards if defined by index logic
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#121212", // Ensure background matches
  },
  loadingText: {
    color: "#00D95F",
    fontSize: 18,
    fontWeight: "600",
  },

  // Error
  errorContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.15)", // Slightly darker error background
    marginHorizontal: 0, // Align with other content
    padding: 16, // Reduced padding
    borderRadius: 12, // Consistent border radius
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.5)", // Stronger error border
    shadowColor: "rgba(220, 38, 38, 0.3)", // More prominent error shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    color: "#F87171",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});