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
import { Feather, AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
// REMOVIDA: import { MediaType } from 'expo-image-picker'; // Não é mais necessária, pois usamos ImagePicker.MediaTypeOptions
import { useNavigation } from "@react-navigation/native";

import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { apiService } from "../services/apiMooks";
import { uploadImagemParaCloudinary } from "../services/cloudinaryService";

const { width, height } = Dimensions.get("window");

export function CriarGrupoScreen() {
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupType, setGroupType] = useState("publico");
  const [customCode, setCustomCode] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
        console.error(error);
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
        if (result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          setLoading(true);
          const url = await uploadImagemParaCloudinary(imageUri);
          setGroupImage(url); // 🔥 Agora você tem a URL da imagem na nuvem
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

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !groupDescription.trim() || !selectedCategory) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha nome, descrição e categoria."
      );
      return;
    }
    if (groupType === "privado" && !customCode.trim()) {
      Alert.alert(
        "Código Obrigatório",
        "Grupos privados exigem um código de acesso."
      );
      return;
    }

    setLoading(true);
    try {
      const newGroupData = {
        nome: groupName.trim(),
        descricao: groupDescription.trim(),
        imagem:
          groupImage ||
          "https://via.placeholder.com/150/00FF88/FFFFFF?text=Grupo",
        categoria:
          categories.find((cat) => cat.id === selectedCategory)?.nome ||
          "Outros",
        tipo: groupType,
        codigoAcesso: groupType === "privado" ? customCode.trim() : null,
      };

      const result = await apiService.criarGrupo(newGroupData);
      if (result.success) {
        Alert.alert("Sucesso", "Grupo criado com sucesso!");
        navigation.replace("ConfirmacaoCriacaoGrupoScreen", {
          grupo: result.grupo,
        });
      } else {
        Alert.alert("Erro", result.message || "Erro ao criar grupo.");
      }
    } catch (error) {
      Alert.alert("Erro", error.message || "Ocorreu um erro ao criar o grupo.");
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
              <Text style={styles.imageUploadText}>Update de Foto</Text>
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

        {/* Tipo de Grupo (Público/Privado) */}
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

        {/* Código Personalizado (se Privado) */}
        {groupType === "privado" && (
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

        {/* Categoria do Grupo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Mensagem Informativa */}
        <Text style={styles.infoText}>
          Obs: Cada grupo possui um código de acesso gerado automaticamente para
          facilitar a localização.
        </Text>

        {/* Botão Criar Grupo */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGroup}
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
