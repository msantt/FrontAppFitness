import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';

import { Header } from '../components/Header';
import { DesafioCard } from '../components/DesafioCard';
import { apiService } from '../services/apiMooks';
import { BottomNav } from '../components/BottomNav';

export const DesafiosScreen = ({ navigation }) => {
  const [meusDesafios, setMeusDesafios] = useState([]);
  const [desafiosPraVoce, setDesafiosPraVoce] = useState([]);
  const [explorarDesafios, setExplorarDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = 'u1';

  const loadAllDesafios = async () => {
    try {
      setLoading(true);

      const [meus, praVoce, explorar] = await Promise.all([
        apiService.getMeusDesafios(userId),
        apiService.getDesafiosPraVoce(userId),
        apiService.getDesafios(),
      ]);

      setMeusDesafios(meus);
      setDesafiosPraVoce(praVoce);
      setExplorarDesafios(explorar);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os desafios');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllDesafios();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllDesafios();
  }, []);

  const verificarMembroDoDesafio = async (usuarioId, desafioId) => {
    try {
      const membros = await apiService.getMembrosPorUsuario(usuarioId);
      const isMembro = membros.some((membro) => membro.desafio.id === desafioId);
      console.log(`Usuário ${usuarioId} é membro do desafio ${desafioId}: ${isMembro}`);
      return isMembro;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar participação no desafio.');
      return false;
    }
  };

  const handleDesafioPress = async (desafio) => {
    const isMembro = await verificarMembroDoDesafio(userId, desafio.id);

    if (isMembro) {
      navigation.navigate('DetalhesDesafios', { desafioId: desafio.id });
    } else {
      navigation.navigate('ParticiparDesafio', {
        desafioId: desafio.id,
        nomeDesafio: desafio.nome,
      });
    }
  };

  const handleCreateDesafio = () => {
    navigation.navigate('CriarDesafios');
  };

  const renderDesafiosSection = (title, desafiosList) => {
    if (desafiosList.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {desafiosList.map((desafio, index) => (
            <View
              key={desafio.id}
              style={{
                marginRight: index === desafiosList.length - 1 ? 0 : 16,
              }}
            >
              <DesafioCard
                desafio={desafio}
                onPress={() => handleDesafioPress(desafio)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Desafios" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando desafios...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Bem-vindo aos Desafios"
        subtitle="Clique em um desafio para conhecer mais"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderDesafiosSection('Meus Desafios', meusDesafios)}
        {renderDesafiosSection('Pra Você', desafiosPraVoce)}
        {renderDesafiosSection('Explorar', explorarDesafios)}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleCreateDesafio}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <BottomNav active="DesafiosScreen" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default DesafiosScreen;
