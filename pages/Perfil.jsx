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
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from "react-native";

import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import Button from "../components/ButtonDesafios";
import { apiService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalFeedback } from "../components/ModalFeedback";
import { MaterialIcons } from "@expo/vector-icons";
import DropdownModal from "../components/Modal";
import { ModalConfirmacao } from "../components/ModalConfirm";
import { getEnderecoFromLatLng } from "../services/geolocationService";
const SPACING = 2;

const { width, height } = Dimensions.get("window");
const BORDER_WIDTH = 1;

const screenWidth = Dimensions.get("window").width;
const imageSize = (screenWidth - 12 * 4) / 2;

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
  {
    id: "REEDUCACAO_ALIMENTAR_E_TREINO",
    nome: "Reeducação alimentar e treino",
  },
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
  const [email, setEmail] = useState("");

  const [modalDeposito, setModalDeposito] = useState(false);
  const [modalSaque, setModalSaque] = useState(false);
  const [valorTransacao, setValorTransacao] = useState("");
  const [processandoTransacao, setProcessandoTransacao] = useState(false);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [feedFotos, setFeedFotos] = useState([]);
  const [modalZoomVisible, setModalZoomVisible] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);
  const [pendingPrivateValue, setPendingPrivateValue] = useState(null);
  const [showPrivateConfirm, setShowPrivateConfirm] = useState(false);

  useEffect(() => {
    async function carregarEndereco() {
      if (fotoSelecionada?.local) {
        setLoadingModal(true);
        try {
          const [lat, lon] = fotoSelecionada.local
            .split(",")
            .map((s) => s.trim());
          const res = await getEnderecoFromLatLng(lat, lon);
          if (res) setEndereco(res);
        } catch (error) {
          console.error("Erro ao carregar endereço:", error);
        } finally {
          setLoadingModal(false);
        }
      }
    }

    carregarEndereco();
  }, [fotoSelecionada]);

function somarTresHoras(dataHoraStr) {
  const dataOriginal = new Date(dataHoraStr);

  // Soma 3 horas (em milissegundos)
  const dataAjustada = new Date(dataOriginal.getTime() + 3 * 60 * 60 * 1000);

  const dia = String(dataAjustada.getDate()).padStart(2, "0");
  const mes = String(dataAjustada.getMonth() + 1).padStart(2, "0");
  const ano = dataAjustada.getFullYear();

  const horas = String(dataAjustada.getHours()).padStart(2, "0");
  const minutos = String(dataAjustada.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}


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
      const usuarioAtualizado = await apiService.atualizarUsuario(
        usuario,
        dadosEditados
      );
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

  useEffect(() => {
    const carregarFeedFotos = async () => {
      try {
        const checkins = await apiService.getCheckInsByUsuarioId(usuario.id);

        const checkinsOrdenados = checkins.sort(
          (a, b) => new Date(b.dataHoraCheckin) - new Date(a.dataHoraCheckin)
        );

        setFeedFotos(checkinsOrdenados);
      } catch (error) {
        console.log("Erro ao carregar feed de fotos:", error);
      }
    };

    if (usuario) carregarFeedFotos();
  }, [usuario]);

  const abrirModalZoom = (foto) => {
    setFotoSelecionada(foto);
    setModalZoomVisible(true);
  };

  const fecharModalZoom = () => {
    setModalZoomVisible(false);
    setFotoSelecionada(null);
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

  const handleTogglePrivate = async () => {
    try {
      setLoading(true);
      const novosDados = { ...usuario, exibirHistorico: pendingPrivateValue };
      const usuarioAtualizado = await apiService.atualizarUsuario(
        usuario,
        novosDados
      );
      setUsuario(usuarioAtualizado);
      setDadosEditados(usuarioAtualizado);
      mostrarFeedback(
        "success",
        `Seu perfil agora está ${pendingPrivateValue ? "público" : "privado"}.`
      );
    } catch (error) {
      mostrarFeedback(
        "error",
        "Não foi possível atualizar a visibilidade do perfil."
      );
    } finally {
      setLoading(false);
      setShowPrivateConfirm(false);
      setPendingPrivateValue(null);
    }
  };

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
          <View style={styles.toggleContainer}>
            <View style={styles.toggleLabelContainer}>
              <MaterialIcons
                name={usuario.exibirHistorico ? "public" : "lock"}
                size={20}
                color={usuario.exibirHistorico ? "#1DB954" : "#FF5555"}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.toggleLabel}>
                {usuario.exibirHistorico ? "Público" : "Privado"}
              </Text>
            </View>
            <Switch
              value={!usuario.exibirHistorico}
              onValueChange={(newValue) => {
                setPendingPrivateValue(!newValue ? true : false);
                setShowPrivateConfirm(true);
              }}
              thumbColor={usuario.exibirHistorico ? "#1DB954" : "#FF5555"}
              trackColor={{ false: "#888", true: "#1DB95455" }}
            />
          </View>
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
        <View style={styles.feedSection}>
          <Text style={styles.feedTitle}>Feed de Check-ins</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedScrollContent}
          >
            <View style={styles.feedGrid}>
              {feedFotos.map((item, index) => (
                <TouchableOpacity
                  key={item.id.toString()}
                  onPress={() => abrirModalZoom(item)}
                  activeOpacity={0.8}
                  style={styles.feedImageWrapper}
                >
                  <Image
                    source={{ uri: item.urlFoto }}
                    style={styles.feedImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <Modal visible={modalZoomVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.zoomContent}>
              {loadingModal ? (
                <ActivityIndicator size="large" color="#1DB954" />
              ) : fotoSelecionada ? (
                <>
                  {/* Localização */}
                  {endereco ? (
                    <View style={styles.locationContainer}>
                      <MaterialIcons
                        name="location-on"
                        size={20}
                        color="#FF5555"
                      />
                      <Text style={styles.locationText}>{endereco}</Text>
                    </View>
                  ) : (
                    <Text style={styles.locationText}>Local não informado</Text>
                  )}

                  {/* Imagem */}
                  <Image
                    source={{ uri: fotoSelecionada.urlFoto }}
                    style={styles.zoomImage}
                    resizeMode="contain"
                  />

                  {/* Data/Hora */}
                  <Text style={styles.dateText}>
                    {somarTresHoras(fotoSelecionada.dataHoraCheckin)}
                  </Text>

                  {/* Botão Fechar */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={fecharModalZoom}
                  >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        </Modal>
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

      <ModalConfirmacao
        visible={showPrivateConfirm}
        mensagem={`Tem certeza que deseja ${
          pendingPrivateValue
            ? "deixar o perfil público"
            : "deixar o perfil privado"
        }?`}
        onConfirm={handleTogglePrivate}
        onCancel={() => {
          setShowPrivateConfirm(false);
          setPendingPrivateValue(null);
        }}
      />

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

export const styles = StyleSheet.create({
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 12,
  },
  toggleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
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
    position: "absolute",
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
  },

  feedSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 12,
    marginBottom: 8,
  },
  feedScrollContent: {
    paddingHorizontal: 4,
  },
  feedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feedImageWrapper: {
    width: imageSize,
    height: imageSize,
    marginBottom: 10,
    backgroundColor: "#222",
    borderRadius: 4,
    overflow: "hidden",
  },
  feedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomContent: {
    width: width,
    height: height,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  locationContainer: {
    position: "absolute",
    top: 100,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: "#fff",
  },
  locationText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  zoomImage: {
    width: width,
    height: width * (16 / 9),
    resizeMode: "cover",
  },
  dateText: {
    position: "absolute",
    bottom: 100,
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* Modal (geral) */
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
