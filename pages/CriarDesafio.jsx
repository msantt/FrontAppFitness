import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import Button from "../components/ButtonDesafios";
import { apiService } from "../services/apiMooks";
import { MaskedTextInput } from "react-native-mask-text";
import CurrencyInput from "react-native-currency-input";
import * as ImagePicker from "expo-image-picker";
import { uploadImagemParaCloudinary } from "../services/cloudinaryService";
import DropdownModal from "../components/Modal";
import { Image } from "react-native";
import { ModalConfirmacao } from "../components/ModalConfirm";
import { ModalFeedback } from "../components/ModalFeedback";

export const CriarDesafios = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipoDesafio: "COMUM",
    recompensa: "",
    valorAposta: 0,
    dataInicio: "",
    dataFim: "",
    status: "ATIVO",
    isPublico: true,
    categoriaId: "",
    grupoId: "",
    criadorId: "",
  });

  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState("success"); // "success" ou "error"
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const userId = "u1";

  useEffect(() => {
    console.log("Fetching categorias e grupos");
    const fetchData = async () => {
      try {
        const categoriasResponse = await apiService.listarCategorias();
        setCategorias(categoriasResponse);

        const gruposResponse = await apiService.listarGruposDoUsuario(userId);
        setGrupos(gruposResponse);
      } catch (error) {
        Alert.alert("Erro", "Erro ao carregar categorias ou grupos");
      }
    };
    fetchData();
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          setLoading(true);
          const url = await uploadImagemParaCloudinary(imageUri);
          updateFormData("imagem", url);
          setLoading(false);
        } else {
          Alert.alert("Erro", "Nenhuma imagem foi selecionada.");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao selecionar ou enviar imagem:", error);
      Alert.alert("Erro", "Não foi possível enviar a imagem.");
    }
  };

  const validarFormulario = () => {
    const obrigatorios = [
      { campo: "nome", label: "Nome do desafio" },
      { campo: "descricao", label: "Descrição" },
      { campo: "recompensa", label: "Recompensa" },
      { campo: "valorAposta", label: "Valor da aposta" },
      { campo: "dataInicio", label: "Data de início" },
      { campo: "dataFim", label: "Data de término" },
      { campo: "categoriaId", label: "Categoria" },
      { campo: "grupoId", label: "Grupo" },
    ];

    for (let item of obrigatorios) {
      if (
        formData[item.campo] === "" ||
        formData[item.campo] === null ||
        formData[item.campo]?.toString().trim() === ""
      ) {
        Alert.alert("Erro", `${item.label} é obrigatório`);
        return false;
      }
    }

    if (parseFloat(formData.valorAposta) <= 0) {
      Alert.alert("Erro", "O valor da aposta deve ser maior que zero.");
      return false;
    }

    const dataInicioISO = formatDateToISO(formData.dataInicio);
    const dataFimISO = formatDateToISO(formData.dataFim);
    if (new Date(dataInicioISO) < new Date()) {
      Alert.alert("Erro", "A data de início deve ser no futuro.");
      return false;
    }
    if (new Date(dataFimISO) < new Date(dataInicioISO)) {
      Alert.alert("Erro", "A data de término deve ser após a data de início.");
      return false;
    }

    return true;
  };

  const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const confirmarCriacao = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    criarDesafio();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const criarDesafio = async () => {
    if (!validarFormulario()) return;

    const body = {
      nome: formData.nome,
      descricao: formData.descricao,
      categoria: { id: formData.categoriaId },
      grupos: { id: formData.grupoId },
      dataInicio: `${formatDateToISO(formData.dataInicio)}T06:00:00`,
      dataFim: `${formatDateToISO(formData.dataFim)}T23:59:59`,
      status: formData.status,
      recompensa: formData.recompensa,
      isPublico: formData.isPublico,
      valorAposta: parseFloat(formData.valorAposta).toFixed(2).toString(),
      tipoDesafio: formData.tipoDesafio,
      criador: { id: userId },
      urlFoto:
        formData.imagem ||
        "https://totalpass.com/wp-content/uploads/2024/09/desafio-fitness-1.png",
    };

    setLoading(true);
    try {
      await apiService.criarDesafio(body);
      setFeedbackType("success");
      setFeedbackMessage(
        `Desafio criado com sucesso! O valor da aposta de R$ ${parseFloat(
          formData.valorAposta
        ).toFixed(2)} foi debitado do seu saldo.`
      );
      setShowFeedback(true);
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(
        `Não foi possível criar o desafio. O valor da aposta de R$ ${parseFloat(
          formData.valorAposta
        ).toFixed(2)} foi estornado para o seu saldo.`
      );
      setShowFeedback(true);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label,
    value,
    onChange,
    placeholder,
    keyboardType = "default",
    maxLength = 100,
    mask = null
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {mask ? (
        <MaskedTextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#888"
          keyboardType={keyboardType}
          maxLength={maxLength}
          mask={mask}
        />
      ) : (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#888"
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Criar Desafio"
        subtitle="Preencha os campos abaixo"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Imagem do Desafio</Text>
          <TouchableOpacity
            style={styles.imageUploadContainer}
            onPress={pickImage}
          >
            {formData.imagem ? (
              <Image
                source={{ uri: formData.imagem }}
                style={styles.uploadedImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageUploadText}>Selecionar Imagem</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {renderInput(
          "Nome",
          formData.nome,
          (text) => updateFormData("nome", text),
          "Digite o nome do desafio",
          "default",
          50
        )}
        {renderInput(
          "Descrição",
          formData.descricao,
          (text) => updateFormData("descricao", text),
          "Digite a descrição",
          "default",
          200
        )}
        {renderInput(
          "Recompensa",
          formData.recompensa,
          (text) => updateFormData("recompensa", text),
          "Ex.: Medalha + Pontos",
          "default",
          50
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor da Aposta (R$)</Text>
          <CurrencyInput
            style={styles.textInput}
            value={formData.valorAposta}
            onChangeValue={(value) => updateFormData("valorAposta", value)}
            prefix="R$ "
            delimiter="."
            separator=","
            precision={2}
            placeholder="R$ 0,00"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>
        {renderInput(
          "Data de Início",
          formData.dataInicio,
          (text) => updateFormData("dataInicio", text),
          "DD-MM-YYYY",
          "numeric",
          10,
          "99-99-9999"
        )}
        {renderInput(
          "Data de Término",
          formData.dataFim,
          (text) => updateFormData("dataFim", text),
          "DD-MM-YYYY",
          "numeric",
          10,
          "99-99-9999"
        )}

        <DropdownModal
          label="Categoria"
          value={formData.categoriaId}
          options={categorias}
          onSelect={(value) => updateFormData("categoriaId", value)}
        />

        <DropdownModal
          label="Grupo"
          value={formData.grupoId}
          options={grupos}
          onSelect={(value) => updateFormData("grupoId", value)}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Visibilidade do Desafio:</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                formData.isPublico && styles.optionButtonSelected,
              ]}
              onPress={() => updateFormData("isPublico", true)}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.isPublico && styles.optionTextSelected,
                ]}
              >
                Público
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                !formData.isPublico && styles.optionButtonSelected,
              ]}
              onPress={() => updateFormData("isPublico", false)}
            >
              <Text
                style={[
                  styles.optionText,
                  !formData.isPublico && styles.optionTextSelected,
                ]}
              >
                Privado
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.createButtonContainer}>
          <Button
            title={loading ? "Criando..." : "Criar Desafio"}
            onPress={confirmarCriacao}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomNav active={"DesafiosScreen"} />
      </View>
      <ModalConfirmacao
        visible={showConfirmModal}
        mensagem={`Você deseja criar o desafio e debitar o valor da aposta de R$ ${parseFloat(
          formData.valorAposta
        ).toFixed(2)} do seu saldo?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ModalFeedback
        visible={showFeedback}
        type={feedbackType}
        message={feedbackMessage}
        onClose={() => {
          setShowFeedback(false);
          if (feedbackType === "success") {
            navigation.goBack();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#DDD",
  },
  textInput: {
    height: 45,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#EEE",
    backgroundColor: "#1E1E1E",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 17,
    color: "#EEE",
    flexShrink: 1,
  },
  dropdownIcon: {
    fontSize: 18,
    color: "#888",
    marginLeft: 10,
  },
  placeholder: {
    color: "#888",
  },
  switchContainer: {
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#444",
  },
  optionButtonSelected: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  optionText: {
    color: "#CCC",
    fontSize: 16,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  createButtonContainer: {
    marginTop: 20,
  },
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
  imageUploadContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imageUploadText: {
    color: "#888",
    fontSize: 16,
  },
});
