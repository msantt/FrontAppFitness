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
import  {BottomNav} from "../components/BottomNav";
import Button from "../components/ButtonDesafios";
import { apiService } from "../services/apiMooks";
import { MaskedTextInput } from "react-native-mask-text";
import CurrencyInput from "react-native-currency-input";

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
    Alert.alert(
      "Confirmação",
      `Você deseja criar o desafio e debitar o valor da aposta de R$ ${parseFloat(
        formData.valorAposta
      ).toFixed(2)} do seu saldo?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: criarDesafio,
        },
      ]
    );
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
    };

    setLoading(true);
    try {
      await apiService.criarDesafio(body);
      Alert.alert(
        "Sucesso!",
        `Desafio criado com sucesso! O valor da aposta de R$ ${parseFloat(
          formData.valorAposta
        ).toFixed(2)} foi debitado do seu saldo.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível criar o desafio. O valor da aposta de R$ ${parseFloat(
          formData.valorAposta
        ).toFixed(2)} foi extornado para o seu saldo.`
      );
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
            onPress={confirmarCriacao}
            disabled={loading}
          />
        </View>
      </ScrollView>

      
      <View style={styles.bottomNav}>
        <BottomNav active={"DesafiosScreen"} />
      </View>

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
    height: 45,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#1E1E1E",
    position: "relative",
  },
  dropdownText: {
    fontSize: 16,
    color: "#EEE",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 16,
    color: "#888",
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
});
