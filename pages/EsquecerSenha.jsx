import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Header } from "../components/Header";
import Button from "../components/ButtonDesafios";
import { ModalFeedback } from "../components/ModalFeedback";
import { apiService } from "../services/api";

const { width, height } = Dimensions.get("window");

export const EsqueciSenha = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleEnviarRecuperacao = async () => {
    const emailTrim = email.trim();
    if (!emailTrim) {
      setFeedbackType("error");
      setFeedbackMessage("Por favor, insira seu e-mail.");
      setFeedbackVisible(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      setFeedbackType("error");
      setFeedbackMessage("E-mail inválido.");
      setFeedbackVisible(true);
      return;
    }

    setLoading(true);
    try {
      // Exemplo: chama o endpoint de recuperação. Adapte conforme API.
      // Supondo que apiService.requestPasswordReset retorne { success: boolean, message?: string }
      const response = await apiService.requestPasswordReset(emailTrim);

      if (response && response.success) {
        setFeedbackType("success");
        setFeedbackMessage(
          "Se as informações estiverem corretas, você receberá um e-mail com instruções para redefinir a senha."
        );
        setFeedbackVisible(true);
        // Opcional: navegar de volta ao login após mensagem
        // setTimeout(() => navigation.goBack(), 2000);
      } else {
        // Se a resposta indicar falha ou mensagem de erro
        const msg =
          (response && response.message) ||
          "Não foi possível enviar o e-mail de recuperação.";
        setFeedbackType("error");
        setFeedbackMessage(msg);
        setFeedbackVisible(true);
      }
    } catch (error) {
      console.error("Erro em requestPasswordReset:", error);
      setFeedbackType("error");
      setFeedbackMessage(
        "Erro ao conectar-se ao servidor. Tente novamente mais tarde."
      );
      setFeedbackVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Esqueci Senha"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* KeyboardAvoidingView para que o teclado não cubra o campo em iOS/Android */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.instructionText}>
              Informe o e-mail cadastrado para receber instruções de recuperação
              de senha.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.textInput}
                placeholder="exemplo@dominio.com"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={loading ? "Enviando..." : "Enviar Recuperação"}
                onPress={handleEnviarRecuperacao}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalFeedback
        visible={feedbackVisible}
        type={feedbackType}
        message={feedbackMessage}
        onClose={() => {
          setFeedbackVisible(false);
          // Opcional: se sucesso, volta para login
          // if (feedbackType === "success") navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  innerContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  instructionText: {
    color: "#EEE",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#CCC",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  textInput: {
    height: 48,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default EsqueciSenha;
