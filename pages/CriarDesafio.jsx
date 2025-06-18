import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { apiService } from "../services/apiMooks";
import Button from "../components/ButtonDesafios";
import { useEffect } from "react";

export const CriarDesafios = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipoDesafio: "COMUM",
    recompensa: "",
    valorAposta: "",
    dataInicio: "",
    dataFim: "",
    status: "ATIVO",
    isPublico: true,
    categoriaId: "",
    grupoId: "",
    criadorId: "",
  });

  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [categorias, setCategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const userId = "a2d41293-983e-49d4-b2de-7f2d405e4614";

  useEffect(() => {
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

  const renderDropdown = (label, value, options, onSelect) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          Alert.alert(
            label,
            "Selecione uma opção:",
            options.map((option) => ({
              text: option.nome,
              onPress: () => onSelect(option.id),
            }))
          );
        }}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {options.find((o) => o.id === value)?.nome ||
            `Selecione ${label.toLowerCase()}`}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
    </View>
  );

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      Alert.alert("Erro", "Nome do desafio é obrigatório");
      return false;
    }
    if (!formData.descricao.trim()) {
      Alert.alert("Erro", "Descrição é obrigatória");
      return false;
    }
    if (!formData.recompensa.trim()) {
      Alert.alert("Erro", "Recompensa é obrigatória");
      return false;
    }
    if (!formData.valorAposta) {
      Alert.alert("Erro", "Valor da aposta é obrigatório");
      return false;
    }
    if (!formData.dataInicio) {
      Alert.alert("Erro", "Data de início é obrigatória");
      return false;
    }
    if (!formData.dataFim) {
      Alert.alert("Erro", "Data de término é obrigatória");
      return false;
    }
    if (!formData.categoriaId.trim()) {
      Alert.alert("Erro", "Categoria é obrigatória");
      return false;
    }
    if (!formData.grupoId.trim()) {
      Alert.alert("Erro", "Grupo é obrigatório");
      return false;
    }
    if (!formData.criadorId.trim()) {
      Alert.alert("Erro", "ID do criador é obrigatório");
      return false;
    }
    return true;
  };

  const criarDesafio = async () => {
    if (!validarFormulario()) return;

    const body = {
      nome: formData.nome,
      descricao: formData.descricao,
      categoria: { id: formData.categoriaId },
      grupos: { id: formData.grupoId },
      dataInicio: `${formData.dataInicio}T06:00:00`,
      dataFim: `${formData.dataFim}T23:59:59`,
      status: formData.status,
      recompensa: formData.recompensa,
      isPublico: formData.isPublico,
      valorAposta: parseFloat(formData.valorAposta),
      tipoDesafio: formData.tipoDesafio,
      criador: { id: formData.criadorId },
    };

    setLoading(true);
    try {
      await apiService.criarDesafio(body);
      Alert.alert("Sucesso!", "Desafio criado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o desafio");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, onChange, placeholder, keyboardType) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#666"
        keyboardType={keyboardType || "default"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Criar Desafios"
        subtitle="Preencha os campos abaixo"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        {renderInput(
          "Nome",
          formData.nome,
          (text) => updateFormData("nome", text),
          "Digite o nome do desafio"
        )}
        {renderInput(
          "Descrição",
          formData.descricao,
          (text) => updateFormData("descricao", text),
          "Digite a descrição"
        )}
        {renderInput(
          "Recompensa",
          formData.recompensa,
          (text) => updateFormData("recompensa", text),
          "Ex.: Medalha + Pontos"
        )}
        {renderInput(
          "Valor da Aposta (R$)",
          formData.valorAposta,
          (text) => updateFormData("valorAposta", text),
          "Ex.: 50.00",
          "numeric"
        )}
        {renderInput(
          "Data de Início",
          formData.dataInicio,
          (text) => updateFormData("dataInicio", text),
          "YYYY-MM-DD"
        )}
        {renderInput(
          "Data de Término",
          formData.dataFim,
          (text) => updateFormData("dataFim", text),
          "YYYY-MM-DD"
        )}
        {renderDropdown(
          "Categoria",
          formData.categoriaId,
          categorias,
          (value) => updateFormData("categoriaId", value)
        )}

        {renderDropdown("Grupo", formData.grupoId, grupos, (value) =>
          updateFormData("grupoId", value)
        )}

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
            onPress={criarDesafio}
            loading={loading}
            style={styles.createButton}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomNav active={"Desafios"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  uploadContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  uploadButton: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    color: "#666",
  },
  uploadIcon: {
    fontSize: 50,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfWidth: {
    width: "48%",
  },
  dropdown: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 16,
    color: "#333",
  },
  regrasContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#1DB954",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 24,
  },
  regraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  regraText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  removeButton: {
    color: "red",
    fontSize: 18,
    marginLeft: 10,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moedaSymbol: {
    fontSize: 16,
    marginRight: 5,
  },
  valorInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  createButton: {
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
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  optionButtonSelected: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },

  optionText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },

  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
