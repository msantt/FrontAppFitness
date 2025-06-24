import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiService } from "../services/api";
import { Header } from "../components/Header";

export default function GroupDetails({ route, navigation }) {
  const { grupoId } = route.params;

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [grupo, setGrupo] = useState(null);
  const [membros, setMembros] = useState([]);
  const [desafios, setDesafios] = useState([]);

  const loadUsuario = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) throw new Error("Usuário não encontrado");

      const usuario = await apiService.getUsuarioByEmail(email);
      if (!usuario?.id) throw new Error("Usuário inválido");

      setUserId(usuario.id);
    } catch (error) {
      setErrorMsg(`Erro: ${error.message}`);
      setLoading(false);
    }
  };

  const loadGrupoEMembros = async () => {
    try {
      const grupoData = await apiService.getGrupoById(grupoId);
      const membrosData = await apiService.getMembrosByGrupo(grupoId);
      setGrupo(grupoData);
      setMembros(membrosData);
    } catch (error) {
      setErrorMsg("Erro ao carregar dados do grupo");
    }
  };

  const loadDesafios = async () => {
    if (!grupoId) return;

    try {
      const desafiosDoGrupo = await apiService.getDesafiosByGrupoId(grupoId);
      setDesafios(desafiosDoGrupo || []);
    } catch (error) {
      console.error("Erro ao carregar desafios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuario();
  }, []);

  useEffect(() => {
    if (grupoId) {
      loadGrupoEMembros();
      loadDesafios();
    }
  }, [grupoId]);

  const handleDesafioPress = async (desafioId) => {
    try {
      const membrosDesafio = await apiService.getMembrosByDesafio(desafioId);
      const isMembro = membrosDesafio.some((m) => m.usuario?.id === userId);

      if (isMembro) {
        navigation.navigate("DetalhesDesafios", { desafioId });
      } else {
        Alert.alert(
          "Atenção",
          "Você não é membro deste desafio. Deseja participar?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Participar",
              onPress: () =>
                navigation.navigate("ParticiparDesafio", { desafioId }),
            },
          ]
        );
      }
    } catch (error) {
      console.log("Erro ao verificar membros do desafio:", error);
      Alert.alert("Erro", "Não foi possível verificar sua participação.");
    }
  };
  const getMembroDoUsuarioNoGrupo = () => {
    return membros.find((m) => m.usuario?.id === userId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Carregando dados do grupo...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  const renderMembro = ({ item }) => (
    <View style={styles.memberItem}>
      <Image
        source={{
          uri:
            item.usuario?.urlFoto ||
            "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        }}
        style={styles.memberAvatar}
      />
      <Text style={styles.memberName}>
        {item.usuario?.nome?.split(" ")[0] || "Usuário"}
      </Text>
    </View>
  );

  const renderDesafio = ({ item }) => (
    <TouchableOpacity onPress={() => handleDesafioPress(item.id)}>
      <View style={styles.timelineItem}>
        <View style={styles.timelineBullet} />
        <View style={styles.timelineContent}>
          <Text style={styles.timelineText}>{item.nome}</Text>
          <Text style={styles.timelineDate}>
            {item.dataInicio
              ? `Início: ${new Date(item.dataInicio).toLocaleDateString()}`
              : ""}
            {item.dataFim
              ? ` | Fim: ${new Date(item.dataFim).toLocaleDateString()}`
              : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={grupo?.nome || "Grupo"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Principal do Grupo */}
        <View style={styles.groupHeader}>
          <View style={styles.imagemContainer}>
            {grupo?.urlFoto ? (
              <Image
                source={{ uri: grupo.urlFoto }}
                style={styles.imagemGrupo}
              />
            ) : (
              <View style={styles.imagemPlaceholder}>
                <Text style={{ color: "#888" }}>Sem imagem</Text>
              </View>
            )}
          </View>
          <Text style={styles.nomeGrupo}>{grupo?.nome}</Text>
          <Text style={styles.descricaoGrupo}>{grupo?.descricao}</Text>
          <Text style={styles.groupPrivacy}>
            {grupo?.tipoGrupo === "PRIVADO" ? "🔒 Privado" : "🌎 Público"}
          </Text>
        </View>

        {/* Membros */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Membros</Text>
          <FlatList
            data={membros}
            keyExtractor={(item) => item.id}
            renderItem={renderMembro}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Desafios do Grupo */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Desafios do Grupo</Text>
          {desafios.length > 0 ? (
            <FlatList
              data={desafios}
              keyExtractor={(item) => item.id}
              renderItem={renderDesafio}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>
              Nenhum desafio cadastrado neste grupo.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 16,
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 17,
    textAlign: "center",
    paddingHorizontal: 30,
    fontWeight: "600",
  },

  // Header do Grupo
  groupHeader: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  imagemContainer: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  imagemGrupo: {
    width: "100%",
    height: "100%",
  },
  imagemPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  nomeGrupo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  descricaoGrupo: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 8,
    textAlign: "center",
  },
  groupPrivacy: {
    color: "#1DB954",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
  },

  // Cards
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#1DB954",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  // Membros
  memberItem: {
    alignItems: "center",
    marginRight: 20,
    width: 70,
  },
  memberAvatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#555",
  },
  memberName: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },

  // Desafios
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  timelineBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1DB954",
    marginTop: 8,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#E0E0E0",
    lineHeight: 20,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: "400",
    color: "#888",
    marginTop: 3,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },

  // Botão sair
  exitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  exitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
