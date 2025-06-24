import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { Header } from "../components/Header";
import { apiService } from "../services/api";
import { BottomNav } from "../components/BottomNav";

export const Ranking = ({ navigation, route }) => {
  const { desafioId } = route.params;
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const defaultAvatar = "https://via.placeholder.com/80?text=Sem+Foto";

  const loadRanking = async () => {
    try {
      console.log("Desafio ID:", desafioId);
      const data = await apiService.getRankingByDesafioId(desafioId);
      console.log("Ranking Data:", data);
      setRankingData(data || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o ranking");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRanking();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRanking();
  }, [desafioId]);

  const renderPodiumItem = (item, posicao, isFirst = false) => {
    if (!item) return null;

    const usuario = item.usuario || {};
    const pontuacao = item.pontuacao || {};

    return (
      <View
        style={[styles.podiumPosition, isFirst && styles.podiumFirst]}
        key={item.id || posicao}
      >
        <View style={styles.podiumImageContainer}>
          <Image
            source={{ uri: usuario.urlFoto || defaultAvatar }}
            style={[styles.podiumAvatar, isFirst && styles.podiumAvatarFirst]}
          />
          <View
            style={[
              styles.podiumBadge,
              posicao === 1
                ? styles.podiumBadgeFirst
                : posicao === 2
                ? styles.podiumBadgeSecond
                : styles.podiumBadgeThird,
            ]}
          >
            <Text style={styles.podiumBadgeText}>{posicao}</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{usuario.nome || "-"}</Text>
        <Text style={styles.podiumPoints}>
          {pontuacao.pontuacao != null ? `${pontuacao.pontuacao} pts` : "- pts"}
        </Text>
        <Text style={styles.podiumConsecutivos}>
          🔥 {pontuacao.diasConsecutivos || 0} dias
        </Text>
      </View>
    );
  };

  const renderRankingItem = (item, index) => {
    if (!item) return null;

    const usuario = item.usuario || {};
    const pontuacao = item.pontuacao || {};

    return (
      <View key={item.id} style={styles.rankingItem}>
        <View style={styles.rankingPosition}>
          <Text style={styles.rankingPositionText}>{index + 4}</Text>
        </View>

        <Image
          source={{ uri: usuario.urlFoto || defaultAvatar }}
          style={styles.rankingAvatar}
        />

        <View style={styles.rankingInfo}>
          <Text style={styles.rankingName}>{usuario.nome || "-"}</Text>
          <Text style={styles.rankingPoints}>
            {pontuacao.pontuacao != null ? `${pontuacao.pontuacao} pts` : "- pts"}
          </Text>
          <View style={styles.rankingConsecutivos}>
            <Text style={styles.rankingConsecutivosText}>
              🔥 {pontuacao.diasConsecutivos || 0} dias
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Classificação"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando ranking...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Classificação"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {rankingData.length > 0 ? (
          <>
            <View style={styles.podiumContainer}>
              {renderPodiumItem(rankingData[1], 2)}
              {renderPodiumItem(rankingData[0], 1, true)}
              {renderPodiumItem(rankingData[2], 3)}
            </View>

            <View style={styles.rankingSection}>
              <Text style={styles.rankingTitle}>Ranking Geral</Text>

              {rankingData.length > 3 ? (
                rankingData.slice(3).map((item, index) =>
                  renderRankingItem(item, index)
                )
              ) : (
                <Text style={{ color: "#FFF", textAlign: "center" }}>
                  Nenhum dado além do pódio.
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text style={{ color: "#FFF", textAlign: "center" }}>
            Nenhum dado no ranking.
          </Text>
        )}
      </ScrollView>
      <BottomNav active={"DesafiosScreen"} />
    </View>
  );
};

const verde = "#1DB954";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1A" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#FFF", fontSize: 16 },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  podiumPosition: { alignItems: "center", flex: 1 },
  podiumFirst: { marginBottom: 20 },
  podiumImageContainer: { position: "relative", marginBottom: 8 },
  podiumAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: verde,
  },
  podiumAvatarFirst: { width: 100, height: 100, borderRadius: 50 },
  podiumBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  podiumBadgeFirst: { backgroundColor: "#FFD700" },
  podiumBadgeSecond: { backgroundColor: "#C0C0C0" },
  podiumBadgeThird: { backgroundColor: "#CD7F32" },
  podiumBadgeText: { color: "#000", fontSize: 14, fontWeight: "bold" },
  podiumName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  podiumPoints: {
    color: verde,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  podiumConsecutivos: {
    color: "#CCC",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  rankingSection: { marginTop: 20 },
  rankingTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rankingPosition: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A4A4A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rankingPositionText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  rankingAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  rankingInfo: { flex: 1 },
  rankingName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  rankingPoints: {
    color: verde,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  rankingConsecutivos: { flexDirection: "row", alignItems: "center" },
  rankingConsecutivosText: { color: "#CCC", fontSize: 12, marginRight: 4 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#2A2A2A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  navItemActive: {
    backgroundColor: verde,
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  navIcon: { fontSize: 20 },
});
