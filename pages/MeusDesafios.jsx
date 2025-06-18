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
  const [desafios, setDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDesafios = async () => {
    try {
      const data = await apiService.getDesafios();
      setDesafios(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os desafios');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDesafios();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDesafios();
  }, []);

  const handleDesafioPress = (desafio) => {
    navigation.navigate('DetalhesDesafios', { desafioId: desafio.id });
  };

  const handleCreateDesafio = () => {
    navigation.navigate('CriarDesafios');
  };

  const renderDesafiosSection = (title, desafiosList) => {
    if (desafiosList.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.grid}>
          {desafiosList.map((desafio) => (
            <DesafioCard
              key={desafio.id}
              desafio={desafio}
              onPress={() => handleDesafioPress(desafio)}
            />
          ))}
        </View>
      </View>
    );
  };

  const desafiosGerais = desafios.filter(
    (d) => !['Caminhada', 'Artes Marciais', 'Musculação', 'Híbrido'].includes(d.categoria)
  );
  const desafiosPraVoce = desafios.filter(
    (d) => ['Caminhada', 'Artes Marciais', 'Musculação', 'Híbrido'].includes(d.categoria)
  );

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
        title="Bem Vindo aos Desafios"
        subtitle="Click em um dos desafios para conhecer mais"
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderDesafiosSection('Desafios', desafiosGerais)}
        {renderDesafiosSection('Pra Você', desafiosPraVoce)}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleCreateDesafio}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <View style={styles.bottomNav}>
      <BottomNav active="Desafios" />
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
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DB954', // novo tom de verde
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  navItemActive: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  navIcon: {
    fontSize: 20,
    color: '#FFF',
  },
});
export default DesafiosScreen;
