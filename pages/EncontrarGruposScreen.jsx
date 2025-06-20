import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { apiService } from '../services/apiMooks';

const { width } = Dimensions.get('window');

export function EncontrarGruposScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const [isPrivateModalVisible, setPrivateModalVisible] = useState(null); // Alterado para null quando não visível
  const [selectedPrivateGroup, setSelectedPrivateGroup] = useState(null);
  const [privateGroupCode, setPrivateGroupCode] = useState('');

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await apiService.getGrupos({ termo: searchTerm, tipo: filterType });
      setGrupos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os grupos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadGroups();
    }
  }, [isFocused, searchTerm, filterType]);

  const handleGroupPress = (grupo) => {
    if (grupo.tipo === 'publico') {
      Alert.alert(
        'Entrar no Grupo',
        `Deseja realmente entrar no grupo "${grupo.nome}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sim',
            onPress: async () => {
              try {
                await apiService.entrarGrupo(grupo.id, null);
                Alert.alert('Sucesso', `Você entrou no grupo "${grupo.nome}"!`);
                loadGroups();
              } catch (error) {
                Alert.alert('Erro', error.message || 'Não foi possível entrar no grupo.');
              }
            },
          },
        ]
      );
    } else {
      setSelectedPrivateGroup(grupo);
      setPrivateModalVisible(true);
      setPrivateGroupCode('');
    }
  };

  const handlePrivateGroupEntry = async () => {
    if (!selectedPrivateGroup || !privateGroupCode) {
      Alert.alert('Aviso', 'Por favor, insira o código de acesso.');
      return;
    }
    try {
      await apiService.entrarGrupo(selectedPrivateGroup.id, privateGroupCode);
      Alert.alert('Sucesso', `Você entrou no grupo "${selectedPrivateGroup.nome}"!`);
      setPrivateModalVisible(false);
      loadGroups();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível entrar no grupo privado.');
    }
  };

  const renderGroupCard = (grupo) => (
    <TouchableOpacity
      key={grupo.id}
      style={styles.groupCard}
      onPress={() => handleGroupPress(grupo)}
    >
      <Image source={{ uri: grupo.imagem }} style={styles.groupImage} />
      <View style={styles.groupInfo}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{grupo.nome}</Text>
          {grupo.tipo === 'publico' ? (
            <MaterialIcons name="public" size={width * 0.04} color="#00D95F" />
          ) : (
            <Feather name="lock" size={width * 0.04} color="#FFD700" />
          )}
        </View>
        {grupo.tipo === 'publico' && (
          <Text style={styles.groupDescription}>{grupo.descricao.substring(0, 50)}...</Text>
        )}
        <Text style={styles.groupMembers}>
          Membros: {grupo.membros} / {grupo.limiteMembros}
        </Text>
        <Text style={styles.groupCategory}>Categoria: {grupo.categoria}</Text>
      </View>
      {grupo.tipo === 'publico' && (
        <View style={styles.enterButtonContainer}>
          <AntDesign name="rightcircle" size={width * 0.06} color="#00D95F" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Encontrar Grupos"
        showBackButton={false}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Feather name="filter" size={width * 0.06} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CriarGrupoScreen')}
            >
              <Feather name="plus" size={width * 0.08} color="#000" />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.searchContainer}>
        <Feather name="search" size={width * 0.05} color="#B3B3B3" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar grupos ou categorias"
          placeholderTextColor="#B3B3B3"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={loadGroups}
        />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Carregando grupos...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {grupos.length === 0 ? (
            <Text style={styles.noGroupsText}>Nenhum grupo encontrado.</Text>
          ) : (
            grupos.map(renderGroupCard)
          )}
        </ScrollView>
      )}

      {/* Modal de Filtro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Filtrar por Tipo</Text>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === 'todos' && styles.filterOptionSelected,
              ]}
              onPress={() => { setFilterType('todos'); setFilterModalVisible(false); }}
            >
              <Text style={styles.filterOptionText}>Todos os Grupos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === 'publico' && styles.filterOptionSelected,
              ]}
              onPress={() => { setFilterType('publico'); setFilterModalVisible(false); }}
            >
              <Text style={styles.filterOptionText}>Grupos Públicos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === 'privado' && styles.filterOptionSelected,
              ]}
              onPress={() => { setFilterType('privado'); setFilterModalVisible(false); }}
            >
              <Text style={styles.filterOptionText}>Grupos Privados</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Grupo Privado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPrivateModalVisible}
        onRequestClose={() => setPrivateModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Entrar em Grupo Privado</Text>
            <Text style={styles.modalSubtitle}>
              Insira o código de acesso para "{selectedPrivateGroup?.nome}":
            </Text>
            <TextInput
              style={styles.codeInput}
              placeholder="Código do grupo"
              placeholderTextColor="#999"
              value={privateGroupCode}
              onChangeText={setPrivateGroupCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={handlePrivateGroupEntry}
            >
              <Text style={styles.modalActionButtonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setPrivateModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav active="Grupos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 100,
  },
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: width * 0.04,
  },
  noGroupsText: {
    color: '#CCC',
    textAlign: 'center',
    marginTop: 50,
    fontSize: width * 0.045,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: width * 0.03,
    padding: width * 0.02,
  },
  addButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: '#00D95F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    marginHorizontal: width * 0.04,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: width * 0.04,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupName: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginRight: 5,
  },
  groupDescription: {
    color: '#B3B3B3',
    fontSize: width * 0.035,
    marginBottom: 5,
  },
  groupMembers: {
    color: '#CCC',
    fontSize: width * 0.035,
  },
  groupCategory: {
    color: '#00D95F',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  enterButtonContainer: {
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#00D95F',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: width * 0.04,
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#00D95F',
    borderRadius: 10,
    padding: 10,
    fontSize: width * 0.045,
    color: '#FFF',
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActionButton: {
    backgroundColor: '#00D95F',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    width: '100%',
    marginBottom: 10,
  },
  modalActionButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.045,
  },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
  },
  closeModalButtonText: {
    color: '#CCC',
    fontSize: width * 0.035,
  },
});