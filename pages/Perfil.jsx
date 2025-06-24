import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  Modal,
} from "react-native";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import Button from "../components/ButtonDesafios";
import { apiService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalFeedback } from "../components/ModalFeedback";
import { MaterialIcons } from "@expo/vector-icons";
import DropdownModal from "../components/Modal";
import { ModalConfirmacao } from "../components/ModalConfirm"; // Import do modal de confirmação

const { width } = Dimensions.get("window");

const objetivosOptions = [
  { id: "EMAGRECIMENTO", nome: "Emagrecimento" },
  { id: "GANHO_DE_MASSA_MUSCULAR", nome: "Ganho de massa muscular" },
  { id: "MELHORA_DO_CONDICIONAMENTO", nome: "Melhora do condicionamento" },
  { id: "SAUDE_MENTAL_E_BEM_ESTAR", nome: "Saúde mental e bem-estar" },
  { id: "ESTILO_DE_VIDA_SAUDAVEL", nome: "Estilo de vida saudável" },
  { id: "CRIAR_HABITO", nome: "Criar hábito" },
  { id: "AUMENTO_DE_DISPOSICAO", nome: "Aumento de disposição" },
  { id: "PREPARACAO_PARA_COMPETICAO", nome: "Preparação para competição" },
  { id: "REDUCAO_DO_ESTRESSE", nome: "Redução do estresse" },
  { id: "DESEMPENHO_ESPORTIVO", nome: "Desempenho esportivo" },
  { id: "MANUTENCAO_DO_CORPO", nome: "Manutenção do corpo" },
  { id: "REEDUCACAO_ALIMENTAR_E_TREINO", nome: "Reeducação alimentar e treino" },
];

const formatCurrency = (value) => {
  const cleanValue = value.replace(/\D/g, "");
  const intValue = parseInt(cleanValue, 10);
  if (isNaN(intValue)) return "0,00";

  const formatted = (intValue / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatted;
};

export const Perfil = ({ navigation }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({});

  const [modalDeposito, setModalDeposito] = useState(false);
  const [modalSaque, setModalSaque] = useState(false);
  const [valorTransacao, setValorTransacao] = useState("");
  const [processandoTransacao, setProcessandoTransacao] = useState(false);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [email, setEmail] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // controla modal de confirmação de saída

  useEffect(() => {
    const carregarEmailEUsuario = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem("userEmail");
        if (emailSalvo) {
          setEmail(emailSalvo);
          const usuarioData = await apiService.getUsuarioByEmail(emailSalvo);
          setUsuario(usuarioData);
          setDadosEditados(usuarioData);
        } else {
          setFeedbackType("error");
          setFeedbackMessage("Email não encontrado. Faça login novamente.");
          setFeedbackVisible(true);
          // Redireciona para login, limpando pilha
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        }
      } catch (error) {
        setFeedbackType("error");
        setFeedbackMessage("Não foi possível carregar os dados do perfil");
        setFeedbackVisible(true);
      } finally {
        setLoading(false);
      }
    };

    carregarEmailEUsuario();
  }, []);

  const handleSalvarEdicao = async () => {
    try {
      setLoading(true);
      const usuarioAtualizado = await apiService.atualizarUsuario(usuario, dadosEditados);
      setUsuario(usuarioAtualizado);
      setEditando(false);

      // Atualizar email no AsyncStorage caso tenha mudado
      if (dadosEditados.email && dadosEditados.email !== email) {
        await AsyncStorage.setItem("userEmail", dadosEditados.email);
        setEmail(dadosEditados.email);
      }

      setFeedbackType("success");
      setFeedbackMessage("Perfil atualizado com sucesso!");
      setFeedbackVisible(true);
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage("Não foi possível atualizar o perfil");
      setFeedbackVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const mostrarFeedback = (tipo, mensagem) => {
    setFeedbackType(tipo);
    setFeedbackMessage(mensagem);
    setFeedbackVisible(true);
  };

  const handleDepositar = async () => {
    const valor = parseFloat((parseInt(valorTransacao) / 100).toFixed(2));
    if (!valor || valor <= 0) {
      mostrarFeedback("error", "Digite um valor válido");
      return;
    }

    if (!usuario?.id) {
      mostrarFeedback("error", "Usuário não identificado");
      return;
    }

    setProcessandoTransacao(true);
    try {
      await apiService.depositar(usuario.id, valor);
      const usuarioAtualizado = await apiService.getUsuarioByEmail(email);
      setUsuario(usuarioAtualizado);
      setModalDeposito(false);
      setValorTransacao("");
      mostrarFeedback(
        "success",
        `Depósito de R$ ${valor.toFixed(2)} realizado com sucesso!`
      );
    } catch (error) {
      mostrarFeedback("error", "Não foi possível realizar o depósito");
    } finally {
      setProcessandoTransacao(false);
    }
  };

  const handleSacar = async () => {
    const valor = parseFloat((parseInt(valorTransacao) / 100).toFixed(2));
    if (!valor || valor <= 0) {
      mostrarFeedback("error", "Digite um valor válido");
      return;
    }

    if (!usuario?.id) {
      mostrarFeedback("error", "Usuário não identificado");
      return;
    }

    if (valor > (usuario?.saldo || 0)) {
      mostrarFeedback("error", "Saldo insuficiente");
      return;
    }

    setProcessandoTransacao(true);
    try {
      await apiService.sacar(usuario.id, valor);
      const usuarioAtualizado = await apiService.getUsuarioByEmail(email);
      setUsuario(usuarioAtualizado);
      setModalSaque(false);
      setValorTransacao("");
      mostrarFeedback(
        "success",
        `Saque de R$ ${valor.toFixed(2)} realizado com sucesso!`
      );
    } catch (error) {
      mostrarFeedback(
        "error",
        error.message || "Não foi possível realizar o saque"
      );
    } finally {
      setProcessandoTransacao(false);
    }
  };

  const renderModalTransacao = (tipo) => {
    const isDeposito = tipo === "deposito";
    const modal = isDeposito ? modalDeposito : modalSaque;
    const setModal = isDeposito ? setModalDeposito : setModalSaque;
    const handleTransacao = isDeposito ? handleDepositar : handleSacar;

    return (
      <Modal
        visible={modal}
        transparent
        animationType="slide"
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isDeposito ? "Depositar" : "Sacar"}
            </Text>

            <Text style={styles.modalLabel}>Valor (R$):</Text>
            <TextInput
              style={styles.modalInput}
              value={formatCurrency(valorTransacao)}
              onChangeText={(text) => {
                const clean = text.replace(/\D/g, "");
                setValorTransacao(clean);
              }}
              placeholder="0,00"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />

            {!isDeposito && usuario && (
              <Text style={styles.saldoDisponivel}>
                Saldo disponível: R$ {usuario.saldo.toFixed(2)}
              </Text>
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setModal(false);
                  setValorTransacao("");
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={isDeposito ? "Depositar" : "Sacar"}
                onPress={handleTransacao}
                loading={processandoTransacao}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleLogout = async () => {
    // Limpa o AsyncStorage e redireciona para LoginScreen, limpando pilha
    try {
      await AsyncStorage.removeItem("userEmail");
    } catch (e) {
      console.warn("Erro ao remover userEmail do AsyncStorage:", e);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  if (loading || !usuario) {
    return (
      <View style={styles.container}>
        <Header
          title="Perfil"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Perfil"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarSection}>
          <Image
            source={
              usuario.urlFoto
                ? { uri: usuario.urlFoto }
                : require("../assets/imagens/avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.username}>{usuario.nome}</Text>
        </View>

        <View style={styles.saldoSection}>
          <Text style={styles.saldoLabel}>Saldo Atual</Text>
          <Text style={styles.saldoValor}>R$ {usuario.saldo.toFixed(2)}</Text>

          <View style={styles.botoesTransacao}>
            <Button
              title="Depositar"
              onPress={() => setModalDeposito(true)}
              variant="primary"
              style={styles.botaoTransacao}
            />
            <Button
              title="Sacar"
              onPress={() => setModalSaque(true)}
              variant="outline"
              style={styles.botaoTransacao}
            />
          </View>
        </View>

        <View style={styles.objetivoContainer}>
          <MaterialIcons
            name="star"
            size={20}
            color="#1DB954"
            style={{ marginRight: 8 }}
          />
          {editando ? (
            <DropdownModal
              label="Objetivo"
              value={dadosEditados.objetivo}
              options={objetivosOptions}
              onSelect={(id) =>
                setDadosEditados((prev) => ({
                  ...prev,
                  objetivo: id,
                }))
              }
            />
          ) : (
            <Text style={styles.objetivoText}>
              {usuario.objetivo
                ? usuario.objetivo.replace(/_/g, " ")
                : "Sem objetivo definido"}
            </Text>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.inputLabel}>Email</Text>
          {editando ? (
            <TextInput
              style={styles.textInput}
              value={dadosEditados.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) =>
                setDadosEditados((prev) => ({ ...prev, email: text }))
              }
            />
          ) : (
            <Text style={styles.infoValue}>{usuario.email}</Text>
          )}

          <Text style={styles.inputLabel}>Data de Nascimento</Text>
          <Text style={styles.infoValue}>
            {new Date(usuario.dataNascimento).toLocaleDateString()}
          </Text>

          <Text style={styles.inputLabel}>Chave Pix</Text>
          {editando ? (
            <TextInput
              style={styles.textInput}
              value={dadosEditados.chavePix}
              onChangeText={(text) =>
                setDadosEditados((prev) => ({ ...prev, chavePix: text }))
              }
            />
          ) : (
            <Text style={styles.infoValue}>{usuario.chavePix}</Text>
          )}
        </View>

        <View style={styles.actionSection}>
          {editando ? (
            <View style={styles.editButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setEditando(false);
                  setDadosEditados(usuario);
                }}
                variant="outline"
                style={styles.editButton}
              />
              <Button
                title="Salvar"
                onPress={handleSalvarEdicao}
                loading={loading}
                style={styles.editButton}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                title="Editar Perfil"
                onPress={() => setEditando(true)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title="Sair"
                onPress={() => setShowLogoutConfirm(true)}
                variant="outline"
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav active={"Perfil"} />
      {renderModalTransacao("deposito")}
      {renderModalTransacao("saque")}

      {/* Modal de confirmação de saída */}
      <ModalConfirmacao
        visible={showLogoutConfirm}
        mensagem="Tem certeza que deseja sair?"
        onConfirm={() => {
          setShowLogoutConfirm(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ModalFeedback
        visible={feedbackVisible}
        type={feedbackType}
        message={feedbackMessage}
        onClose={() => setFeedbackVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#1DB954",
    marginBottom: 12,
  },
  username: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  saldoSection: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  saldoLabel: {
    color: "#CCC",
    fontSize: 14,
    marginBottom: 8,
  },
  saldoValor: {
    color: "#1DB954",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  botoesTransacao: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  botaoTransacao: {
    flex: 1,
  },
  objetivoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1DB95433",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  objetivoText: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  infoSection: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  inputLabel: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  infoValue: {
    color: "#CCC",
    fontSize: 16,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#4A4A4A",
    borderRadius: 8,
    padding: 12,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 12,
  },
  actionSection: {
    marginBottom: 24,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 24,
    width: width - 48,
    maxWidth: 400,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalLabel: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#4A4A4A",
    borderRadius: 8,
    padding: 16,
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  saldoDisponivel: {
    color: "#CCC",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
