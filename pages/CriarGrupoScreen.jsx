import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { apiService } from "../services/api";
import { uploadImagemParaCloudinary } from "../services/cloudinaryService";
import { ModalConfirmacao } from "../components/ModalConfirm";
import { ModalFeedback } from "../components/ModalFeedback";

const { width } = Dimensions.get("window");

export function CriarGrupoScreen() {
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupType, setGroupType] = useState("PUBLICO");
  const [customCode, setCustomCode] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [usuario, setUsuario] = useState(null);

  // Controle dos modais
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feedback, setFeedback] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  // Carregar usuário logado
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (email) {
          const userData = await apiService.getUsuarioByEmail(email);
          setUsuario(userData);
        } else {
          setFeedback({
            visible: true,
            type: "error",
            message: "Não foi possível obter o usuário. Faça login novamente.",
          });
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        setFeedback({
          visible: true,
          type: "error",
          message: "Falha ao obter os dados do usuário.",
        });
        console.error(error);
      }
    };
    carregarUsuario();
  }, []);

  // Carregar categorias e permissão de imagem
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso à galeria para selecionar imagens."
        );
      }
    })();
    const loadCategories = async () => {
      try {
        const cats = await apiService.listarCategorias();
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      } catch (error) {
        setFeedback({
          visible: true,
          type: "error",
          message: "Não foi possível carregar as categorias.",
        });
      }
    };
    loadCategories();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setLoading(true);
        const url = await uploadImagemParaCloudinary(imageUri);
        setGroupImage(url);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setFeedback({
        visible: true,
        type: "error",
        message: "Não foi possível selecionar ou enviar a imagem.",
      });
    }
  };

  const handleOpenConfirmModal = () => {
    if (!groupName.trim() || !groupDescription.trim()) {
      setFeedback({
        visible: true,
        type: "error",
        message: "Por favor, preencha nome e descrição.",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleCreateGroup = async () => {
    setShowConfirmModal(false);

    if (!usuario?.id) {
      setFeedback({
        visible: true,
        type: "error",
        message: "Usuário não identificado.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      nome: groupName.trim(),
      descricao: groupDescription.trim(),
      urlFoto:
        groupImage ||
        "https://media.istockphoto.com/id/1337511327/pt/foto/shot-of-a-group-of-sporty-young-people-doing-pushups-and-renegade-rows-together-in-a-gym.jpg",
      tipoGrupo: groupType,
      criador: { id: usuario.id },
    };

    try {
      const result = await apiService.criarGrupo(payload);

      if (result.success) {
        setFeedback({
          visible: true,
          type: "success",
          message: "Grupo criado com sucesso!",
        });

        setTimeout(() => {
          setFeedback({ visible: false, type: "", message: "" });
          navigation.replace("ConfirmacaoCriacaoGrupoScreen", {
            grupo: result.data,
          });
        }, 1500);
      } else {
        setFeedback({
          visible: true,
          type: "error",
          message: result.error || "Erro ao criar grupo.",
        });
      }
    } catch (error) {
      setFeedback({
        visible: true,
        type: "error",
        message: error.message || "Erro ao criar grupo.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Criar Grupos"
        subtitle="Preencha os campos abaixo para criar um novo grupo"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Upload de Imagem */}
        <TouchableOpacity
          style={styles.imageUploadContainer}
          onPress={pickImage}
        >
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="upload" size={width * 0.1} color="#B3B3B3" />
              <Text style={styles.imageUploadText}>Upload de Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Nome do Grupo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Grupo</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Digite o nome do seu grupo"
            placeholderTextColor="#666"
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Fale um pouco sobre o grupo"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={groupDescription}
            onChangeText={setGroupDescription}
          />
        </View>

        {/* Tipo de Grupo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de Grupo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={groupType}
              onValueChange={(itemValue) => setGroupType(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Público" value="PUBLICO" />
              <Picker.Item label="Privado" value="PRIVADO" />
            </Picker>
          </View>
        </View>

        {/* Código Personalizado */}
        {groupType === "PRIVADO" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código Personalizado (Opcional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: GRUPO123"
              placeholderTextColor="#666"
              value={customCode}
              onChangeText={setCustomCode}
              autoCapitalize="characters"
            />
          </View>
        )}

        {/* Informação */}
        <Text style={styles.infoText}>
          Obs: Cada grupo possui um código de acesso gerado automaticamente para
          facilitar a localização.
        </Text>

        {/* Botão Criar Grupo */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleOpenConfirmModal}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.createButtonText}>Criar Grupo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="Grupos" />

      {/* Modais */}
      <ModalConfirmacao
        visible={showConfirmModal}
        mensagem="Deseja realmente criar este grupo?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleCreateGroup}
      />

      <ModalFeedback
        visible={feedback.visible}
        type={feedback.type}
        message={feedback.message}
        onClose={() =>
          setFeedback({ visible: false, type: "", message: "" })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  scrollContent: {
    padding: width * 0.04,
    paddingBottom: 100,
  },
  imageUploadContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 10,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
  },
  uploadedImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imageUploadText: {
    color: "#B3B3B3",
    marginTop: 10,
    fontSize: width * 0.04,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#FFF",
    fontSize: width * 0.04,
    marginBottom: 5,
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: width * 0.045,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#FFF",
  },
  pickerItem: {
    color: "#FFF",
    fontSize: Math.round(width * 0.045),
    backgroundColor: "#2A2A2A",
  },
  infoText: {
    color: "#B3B3B3",
    fontSize: width * 0.035,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: "#00D95F",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "#000",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});
