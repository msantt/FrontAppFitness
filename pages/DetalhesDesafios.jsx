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

  // Chamada única no topo, para carregar detalhes e timeline ao montar e ao mudar desafioId
  useEffect(() => {
    loadDesafioDetalhes();
    loadTimeline();
  }, [desafioId]);

  // Renderiza a timeline
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
              item.status.toLowerCase() === "concluido" && styles.timelineDotCompleted,
              item.status.toLowerCase() === "em_andamento" && styles.timelineDotActive,
              item.status.toLowerCase() === "pendente" && styles.timelineDotPending,
            ]}
          />
          {/* Formate a hora, pois no mock você tem dataHoraCheckin */}
          <Text style={styles.timelineTime}>
            {new Date(item.dataHoraCheckin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
              {/* Distância não está no mock, pode omitir ou substituir */}
              {/* <Text style={styles.participanteDistancia}>
                {item.membroDesafio.usuario.distancia} km
              </Text> */}
              <Text style={styles.participanteStatus}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    ))}
  </View>
);
  };

  const handleCheckin = async () => {
    navigation.navigate("CheckinDesafio", {
      desafioId: desafio.id,
      nomeDesafio: desafio.nome,
    });
  };

  const handleVerRanking = async () => {
    navigation.navigate("RankingDesafio", {
      desafioId: desafio.id,
      nomeDesafio: desafio.nome,
    });
  };

  const renderCronograma = () => {
    if (!desafio) return null;

    const dias = [
      { key: "seg", label: "Seg" },
      { key: "ter", label: "Ter" },
      { key: "qua", label: "Qua" },
      { key: "qui", label: "Qui" },
      { key: "sex", label: "Sex" },
      { key: "sab", label: "Sab" },
      { key: "dom", label: "Dom" },
    ];

    return (
      <View style={styles.cronogramaContainer}>
        {dias.map((dia) => (
          <View key={dia.key} style={styles.diaContainer}>
            <Text style={styles.diaLabel}>{dia.label}</Text>
            <View
              style={[
                styles.diaIndicator,
                desafio.cronograma[dia.key]
                  ? styles.diaCompleto
                  : styles.diaPendente,
              ]}
            >
              {desafio.cronograma[dia.key] && (
                <Text style={styles.checkIcon}>✓</Text>
              )}
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

  return (
    <View style={styles.container}>
      <Header
        title="Acompanhar Desafios"
        showBackButton
        showShareButton
        onBackPress={() => navigation.goBack()}
        onSharePress={() =>
          Alert.alert("Compartilhar", "Funcionalidade de compartilhamento")
        }
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
            <Text style={styles.progressText}>{desafio.progresso}%</Text>
            <View style={styles.posicaoContainer}>
              <Text style={styles.posicaoText}>Posição: {desafio.posicao}</Text>
              <Text style={styles.posicaoIcon}>🔥</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${desafio.progresso}%` }]}
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
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Data de Início e Fim:</Text>
            <Text style={styles.dataText}>
              {desafio.dataInicio} até {desafio.dataFim}
            </Text>
          </View>

          <View style={styles.ativosContainer}>
            <Text style={styles.ativosText}>Ativos: {desafio.ativos}</Text>
          </View>

          <View style={styles.valorApostaContainer}>
            <Text style={styles.dataLabel}>Valor da Aposta:</Text>
            <Text style={styles.dataText}>
              R$ {Number(desafio.valorAposta).toFixed(2)}
            </Text>
          </View>

          <View style={styles.valorRecompensaContainer}>
            <Text style={styles.dataLabel}>Recompensa Total:</Text>
            <Text style={styles.dataText}>
              R${" "}
              {(Number(desafio.valorAposta) * Number(desafio.ativos)).toFixed(2)}
            </Text>
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
        <BottomNav active={"Desafios"} />
      </View>
    </View>
  );
};

// Você provavelmente já tem seu styles definido, mas caso precise, me avise.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // HEADER DO DESAFIO
  desafioHeader: {
    backgroundColor: "#1E1E1E",
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
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  desafioDescricao: {
    color: "#1DB954",
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
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  posicaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  posicaoText: {
    color: "#FFF",
    fontSize: 14,
  },
  progressBar: {
    height: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1DB954",
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
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  ofensivaIcon: {
    backgroundColor: "#333",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  leafIcon: {
    fontSize: 24,
    color: "#1DB954",
  },
  ofensivaText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  ofensivaDias: {
    color: "#CCC",
    fontSize: 13,
  },

  pontosContainer: {
    flex: 1,
    backgroundColor: "#1DB954",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  pontosLabel: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },

  // CRONOGRAMA
  cronogramaContainer: {
    backgroundColor: "#1E1E1E",
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
    color: "#FFF",
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
    backgroundColor: "#1DB954",
  },
  diaPendente: {
    backgroundColor: "#444",
  },
  checkIcon: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  // INFO
   infoContainer: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  dataContainer: {
    marginBottom: 8,
  },
  dataLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  dataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ativosContainer: {
    marginBottom: 8,
  },
  ativosText: {
    color: '#fff',
    fontSize: 16,
  },
  valorApostaContainer: {
    marginBottom: 8,
  },
  valorRecompensaContainer: {
    marginBottom: 8,
  },
  valorApostaText: {
    color: '#fff',
    fontSize: 16,
  },
  valorRecompensaText: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // TIMELINE
  timelineContainer: {
    marginBottom: 24,
  },
  timelineTitle: {
    color: "#FFF",
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
    backgroundColor: "#444",
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
    backgroundColor: "#1DB954",
  },
  timelineDotActive: {
    backgroundColor: "#FFD700",
  },
  timelineDotPending: {
    backgroundColor: "#F44336",
  },
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
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  participanteDistancia: {
    color: "#1DB954",
    fontSize: 12,
  },
  participanteStatus: {
    color: "#CCC",
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
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
