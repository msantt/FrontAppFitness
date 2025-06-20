import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import Button from "../components/ButtonDesafios";
import { apiService } from "../services/apiMooks";

const { width } = Dimensions.get("window");

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

  const loadDados = async () => {
    try {
      const usuarioData = await apiService.getUsuario();
      setUsuario(usuarioData);
      setDadosEditados(usuarioData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDados();
  }, []);

  const handleSalvarEdicao = async () => {
    try {
      setLoading(true);
      const usuarioAtualizado = await apiService.atualizarUsuario(
        dadosEditados
      );
      setUsuario(usuarioAtualizado);
      setEditando(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleDepositar = async () => {
    const valor = parseFloat((parseInt(valorTransacao) / 100).toFixed(2));
    if (!valor || valor <= 0) {
      Alert.alert("Erro", "Digite um valor válido");
      return;
    }

    setProcessandoTransacao(true);
    try {
      await apiService.depositar(valor);
      await loadDados();
      setModalDeposito(false);
      setValorTransacao("");
      Alert.alert(
        "Sucesso",
        `Depósito de R$ ${valor.toFixed(2)} realizado com sucesso!`
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o depósito");
    } finally {
      setProcessandoTransacao(false);
    }
  };

  const handleSacar = async () => {
    const valor = parseFloat((parseInt(valorTransacao) / 100).toFixed(2));
    if (!valor || valor <= 0) {
      Alert.alert("Erro", "Digite um valor válido");
      return;
    }

    if (valor > (usuario?.saldo || 0)) {
      Alert.alert("Erro", "Saldo insuficiente");
      return;
    }

    setProcessandoTransacao(true);
    try {
      await apiService.sacar(valor);
      await loadDados();
      setModalSaque(false);
      setValorTransacao("");
      Alert.alert(
        "Sucesso",
        `Saque de R$ ${valor.toFixed(2)} realizado com sucesso!`
      );
    } catch (error) {
      Alert.alert("Erro", error.message || "Não foi possível realizar o saque");
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
          <Image source={{ uri: usuario.urlFoto }} style={styles.avatar} />
          <Text style={styles.username}>{usuario.nome}</Text>
        </View>

        <View style={styles.saldoSection}>
          <Text style={styles.saldoLabel}>Saldo Atual</Text>
          <Text style={styles.saldoValor}>
            R$ {usuario.saldo.toFixed(2)}
          </Text>

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

        <View style={styles.infoSection}>
          <Text style={styles.inputLabel}>Email</Text>
          <Text style={styles.infoValue}>{usuario.email}</Text>

          <Text style={styles.inputLabel}>Data de Nascimento</Text>
          <Text style={styles.infoValue}>
            {new Date(usuario.dataNascimento).toLocaleDateString()}
          </Text>

          <Text style={styles.inputLabel}>Objetivo</Text>
          <Text style={styles.infoValue}>{usuario.objetivo.replace(/_/g, " ")}</Text>

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
            <Button
              title="Editar Chave Pix"
              onPress={() => setEditando(true)}
              variant="secondary"
            />
          )}
        </View>
      </ScrollView>

      <BottomNav active={"Perfil"} />
      {renderModalTransacao("deposito")}
      {renderModalTransacao("saque")}
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
    borderColor: "#00D4AA",
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
    color: "#00D4AA",
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

