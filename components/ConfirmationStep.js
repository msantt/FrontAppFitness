import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "./CustomButton";
import { ModalFeedback } from "../components/ModalFeedback";
import { uploadImagemParaCloudinary } from "../services/cloudinaryService";
import { apiService } from "../services/api";
import { getEnderecoFromLatLng } from "../services/geolocationService";

import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../styles/theme";

const ConfirmationStep = ({
  onConfirm,
  capturedPhoto,
  location,
  membroDesafio = null,
}) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    const carregarEmailEUsuario = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem("userEmail");
        if (emailSalvo) {
          setEmail(emailSalvo);
          const usuarioData = await apiService.getUsuarioByEmail(emailSalvo);
          setUsuario(usuarioData);
        } else {
          setModalMessage("Email não encontrado. Faça login novamente.");
          setModalType("error");
          setModalVisible(true);
        }
      } catch (error) {
        setModalMessage("Não foi possível carregar os dados do perfil.");
        setModalType("error");
        setModalVisible(true);
      } finally {
        setLoading(false);
      }
    };

    carregarEmailEUsuario();
  }, []);

  useEffect(() => {
    const buscarEndereco = async () => {
      if (location?.coords) {
        const enderecoObtido = await getEnderecoFromLatLng(
          location.coords.latitude,
          location.coords.longitude
        );
        setEndereco(enderecoObtido || "Local não disponível");
      }
    };

    buscarEndereco();
  }, [location]);

  function filtrarCheckInsDoDia(checkIns) {
    const hoje = new Date();
    return checkIns.filter((checkIn) => {
      if (!checkIn.dataHoraCheckin) return false;
      const dataCheckIn = new Date(checkIn.dataHoraCheckin);
      return (
        dataCheckIn.getDate() === hoje.getDate() &&
        dataCheckIn.getMonth() === hoje.getMonth() &&
        dataCheckIn.getFullYear() === hoje.getFullYear()
      );
    });
  }

  function getDataHoraBrasil() {
    const now = new Date();
    const brasilDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const year = brasilDate.getFullYear();
    const month = String(brasilDate.getMonth() + 1).padStart(2, "0");
    const day = String(brasilDate.getDate()).padStart(2, "0");

    const hours = String(brasilDate.getHours()).padStart(2, "0");
    const minutes = String(brasilDate.getMinutes()).padStart(2, "0");
    const seconds = String(brasilDate.getSeconds()).padStart(2, "0");
    const milliseconds = String(brasilDate.getMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      if (!usuario || !usuario.id) {
        throw new Error("Usuário não carregado para buscar check-ins.");
      }

      const todosCheckIns = await apiService.getCheckInsByUsuarioId(usuario.id);
      const checkInsHoje = filtrarCheckInsDoDia(todosCheckIns);

      if (checkInsHoje.length > 0) {
        setModalMessage("Você já fez check-in hoje neste desafio.");
        setModalType("error");
        setModalVisible(true);
        setIsSubmitting(false);
        return;
      }

      let membroDesafioParaUsar = membroDesafio;

      if (!membroDesafioParaUsar) {
        const membrosDesafio = await apiService.getMembrosPorUsuario(
          usuario.id
        );
        if (!membrosDesafio || membrosDesafio.length === 0) {
          throw new Error(
            "Usuário não está cadastrado em nenhum desafio ativo."
          );
        }
        membroDesafioParaUsar = membrosDesafio[0].id;
      }

      if (!membroDesafioParaUsar) {
        throw new Error("Membro do desafio inválido.");
      }

      const urlFoto = await uploadImagemParaCloudinary(capturedPhoto.uri);

      const payload = {
        membroDesafio: { id: membroDesafioParaUsar },
        urlFoto,
        local: endereco || "Local não disponível",
        status: "ATIVO",
        dataHoraCheckin: getDataHoraBrasil(),
      };

      console.log("Payload enviado:", payload);

      await apiService.salvarCheckIn(payload);

      setModalMessage("Seu check-in foi realizado com sucesso.");
      setModalType("success");
      setModalVisible(true);
    } catch (error) {
      console.error("Erro no check-in:", error);
      setModalMessage(error.message || "Erro ao realizar check-in");
      setModalType("error");
      setModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === "success") {
      if (onConfirm) onConfirm();
      navigation.navigate("DesafiosScreen");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In</Text>
      <Text style={styles.subtitle}>Confirmação Completa</Text>

      <View style={styles.confirmationContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo do Check-in:</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>📷 Foto:</Text>
            <Text style={styles.summaryValue}>Capturada</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>📍 Localização:</Text>
            <Text style={styles.summaryValue}>
              {endereco || "Obtida"}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>⏰ Horário:</Text>
            <Text style={styles.summaryValue}>
              {new Date().toLocaleTimeString("pt-BR")}
            </Text>
          </View>
        </View>
      </View>

      {isSubmitting ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <CustomButton title="Confirmar" onPress={handleConfirm} />
      )}

      <ModalFeedback
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  confirmationContainer: {
    width: 280,
    minHeight: 280,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primaryTransparent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  successIconText: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  summaryContainer: {
    width: "100%",
  },
  summaryTitle: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
});

export default ConfirmationStep;
