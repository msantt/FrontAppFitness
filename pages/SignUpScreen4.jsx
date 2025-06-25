import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { TextInputMask } from "react-native-masked-text";
import  DropdownModal  from "../components/Modal";

import { apiService } from "../services/api";
import { uploadImagemParaCloudinary } from "../services/cloudinaryService";
import { Header } from "../components/Header";
import { ModalFeedback } from "../components/ModalFeedback";

const { width, height } = Dimensions.get("window");
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

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

export function SignUpScreen4({ navigation, route }) {
  const {
    dataNascimento: dataNascimentoRoute = "",
    chavePix: chavePixRoute = "",
    objetivo: objetivoRoute = "",
    role = "USER",
    tipoUsuario = "MEMBRO",
    exibirHistorico = true,
    status = "ATIVO",
    saldoInicial = 0.0,
  } = route.params || {};

  const [dataNascimento, setDataNascimento] = useState(dataNascimentoRoute);
  const [chavePix, setChavePix] = useState(chavePixRoute);
  const [objetivo, setObjetivo] = useState(objetivoRoute);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [profileImageUri, setProfileImageUri] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loadingSignUp, setLoadingSignUp] = useState(false);

  // Estado para modal feedback
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success"); // "success" ou "error"
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const selectImage = async () => {
    try {
      const { status: permStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permStatus !== "granted") {
        showModal(
          "error",
          "Permita o acesso à galeria para selecionar imagem de perfil."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        const localUri = result.assets[0].uri;
        setUploadingImage(true);
        try {
          const uploadedUrl = await uploadImagemParaCloudinary(localUri);
          setProfileImageUri(uploadedUrl);
        } catch (err) {
          console.error("Erro ao enviar imagem:", err);
          showModal("error", "Não foi possível enviar a imagem de perfil.");
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      showModal("error", "Não foi possível selecionar imagem.");
      setUploadingImage(false);
    }
  };

  const validarCampos = () => {
    if (!nomeCompleto.trim()) {
      showModal("error", "Por favor, preencha o nome completo.");
      return false;
    }
    if (!email.trim()) {
      showModal("error", "Por favor, preencha o email.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showModal("error", "E-mail inválido.");
      return false;
    }
    if (!senha) {
      showModal("error", "Por favor, preencha a senha.");
      return false;
    }
    if (senha.length < 6) {
      showModal("error", "A senha deve ter ao menos 6 caracteres.");
      return false;
    }
    if (!dataNascimento.trim()) {
      showModal("error", "Por favor, preencha a data de nascimento.");
      return false;
    }
    if (dataNascimento.length !== 10) {
      showModal("error", "Data de nascimento inválida.");
      return false;
    }
    if (!chavePix.trim()) {
      showModal("error", "Por favor, preencha a chave Pix.");
      return false;
    }
    if (chavePix.length < 5) {
      showModal("error", "Chave Pix muito curta.");
      return false;
    }
    if (!objetivo) {
      showModal("error", "Por favor, selecione um objetivo.");
      return false;
    }
    return true;
  };

  const formatDateToISO = (dateBR) => {
    const [day, month, year] = dateBR.split("/");
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleSignUp = async () => {
    if (!validarCampos()) return;

    setLoadingSignUp(true);
    try {
      const payload = {
        nome: nomeCompleto.trim(),
        email: email.trim(),
        senha,
        role,
        dataNascimento: formatDateToISO(dataNascimento),
        objetivo,
        urlFoto: profileImageUri || "https://via.placeholder.com/150",
        status,
        exibirHistorico,
        tipoUsuario,
        saldo: saldoInicial,
        chavePix,
      };

      const response = await apiService.cadastroUsuario(payload);
      if (response && response.success) {
        showModal("success", "Cadastro realizado com sucesso!");
      } else {
        const msg =
          (response && response.message) ||
          "Não foi possível concluir o cadastro.";
        showModal("error", msg);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      showModal(
        "error",
        error.message ||
          "Ocorreu um erro ao cadastrar. Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoadingSignUp(false);
    }
  };

  // Fecha modal e navega para login se sucesso
  const handleModalClose = () => {
    hideModal();
    if (modalType === "success") {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a2a2a" />

      <Header
        title="Cadastro"
        subtitle="Complete seus dados"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Imagem de perfil */}
          <View style={styles.profileContainer}>
            <TouchableOpacity
              onPress={selectImage}
              disabled={uploadingImage}
              activeOpacity={0.7}
            >
              <View style={styles.profileImageContainer}>
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImage}>
                    <Icon name="person" size={moderateScale(50)} color="#ccc" />
                  </View>
                )}
                {uploadingImage && (
                  <View style={styles.uploadOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
                <View style={styles.greenDot} />
              </View>
            </TouchableOpacity>
            <Text style={styles.profileHint}>
              Toque para alterar imagem de perfil
            </Text>
          </View>

          {/* Campos de entrada */}
          <View style={styles.formContainer}>
            {/* Nome Completo */}
            <View style={styles.inputContainer}>
              <Icon
                name="person"
                size={moderateScale(20)}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#888"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Icon
                name="email"
                size={moderateScale(20)}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={moderateScale(20)}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#888"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={moderateScale(20)}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Data de Nascimento com máscara */}
            <View style={styles.inputContainer}>
              <Icon
                name="calendar-today"
                size={moderateScale(20)}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInputMask
                type={"datetime"}
                options={{
                  format: "DD/MM/YYYY",
                }}
                value={dataNascimento}
                onChangeText={setDataNascimento}
                style={[styles.input, { color: "#fff" }]}
                placeholder="Data de Nascimento (DD/MM/YYYY)"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
            </View>

            {/* Chave Pix */}
            <View style={styles.inputContainer}>
              <Icon
                name="account-balance-wallet"
                size={moderateScale(20)}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Chave Pix"
                placeholderTextColor="#888"
                value={chavePix}
                onChangeText={setChavePix}
                autoCapitalize="none"
              />
            </View>
            <View>
              {/* Objetivo como Dropdown */}
              <DropdownModal
                label="Objetivo"
                value={objetivo}
                options={objetivosOptions}
                onSelect={(selectedId) => setObjetivo(selectedId)}
              />
            </View>
          </View>

          {/* Botão Cadastrar */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSignUp}
              disabled={loadingSignUp}
            >
              {loadingSignUp ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Feedback */}
      <ModalFeedback
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#2a2a2a",
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(40),
    paddingTop: verticalScale(20),
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  profileImageContainer: {
    position: "relative",
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    overflow: "hidden",
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: scale(60),
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  greenDot: {
    position: "absolute",
    bottom: scale(8),
    right: scale(8),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: "#4CAF50",
    borderWidth: scale(3),
    borderColor: "#2a2a2a",
  },
  profileHint: {
    color: "#aaa",
    fontSize: moderateScale(12),
    marginTop: verticalScale(8),
  },
  formContainer: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: scale(12),
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(15),
    height: verticalScale(55),
    minHeight: 50,
  },
  inputIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: moderateScale(16),
  },
  eyeIcon: {
    padding: scale(8),
  },
  buttonContainer: {
    marginTop: verticalScale(10),
    paddingBottom:
      Platform.OS === "ios" ? verticalScale(20) : verticalScale(10),
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    borderRadius: scale(25),
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  picker: {
    color: "#fff",
  },
});
