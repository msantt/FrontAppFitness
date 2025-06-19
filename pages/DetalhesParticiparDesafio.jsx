import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "../components/Header";
import ButtonDesafios from "../components/ButtonDesafios";
import { apiService } from "../services/apiMooks";
import { BottomNav } from "../components/BottomNav";

export const ParticiparDesafioScreen = ({ navigation, route }) => {
  const { desafioId } = route.params;
  const userId = "u1";

  const [desafio, setDesafio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participando, setParticipando] = useState(false);

  useEffect(() => {
    const loadDesafio = async () => {
      try {
        const data = await apiService.getDesafioById(desafioId);
        setDesafio(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o desafio");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadDesafio();
  }, [desafioId]);

  const confirmarParticipacao = () => {
    Alert.alert(
      "Confirmação de Participação",
      `Você tem certeza que deseja participar deste desafio?\n\nValor da aposta: R$ ${Number(
        desafio.valorAposta
      ).toFixed(2)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => handleParticipar(),
        },
      ],
      { cancelable: false }
    );
  };

  const handleParticipar = async () => {
    setParticipando(true);

    // Função para formatar a data no padrão YYYY-MM-DD
    const formatarDataAtual = () => {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const dia = String(hoje.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    };

    try {
      const body = {
        usuario: { id: userId },
        desafio: { id: desafioId },
        status: "ATIVO",
        dataConclusao: formatarDataAtual(),
      };

      await apiService.participarDesafio(body);

      Alert.alert(
        "Sucesso",
        `Agora você faz parte do desafio!\n\nO valor da aposta de R$ ${Number(
          desafio.valorAposta
        ).toFixed(2)} foi descontado do seu saldo.`,
        [{ text: "Ok" }]
      );
      navigation.replace("DetalhesDesafios", { desafioId });
    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível participar do desafio.\n\nO valor da aposta de R$ ${Number(
          desafio.valorAposta
        ).toFixed(2)} não foi descontado.`,
        [{ text: "OK" }]
      );
    } finally {
      setParticipando(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
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
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
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
              <Text style={styles.infoLabel}>Participantes</Text>
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

        <View style={styles.buttonsContainer}>
          <ButtonDesafios
            title={participando ? "Participando..." : "Participar do Desafio"}
            onPress={confirmarParticipacao}
            loading={participando}
            disabled={participando}
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
  primary: "#1DB954",
  textPrimary: "#FFFFFF",
  textSecondary: "#CCC",
  textMuted: "#7A7A7A",
  border: "#444444",
  shadow: "#000000",
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
  infoContainer: {
    marginVertical: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  buttonsContainer: {
    marginTop: 24,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
