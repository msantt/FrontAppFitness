import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Header } from '../components/Header';
import { DesafioCard } from '../components/DesafioCard';
import { apiService } from '../services/api';
import { BottomNav } from '../components/BottomNav';

export const DesafiosScreen = ({ navigation }) => {
  const [meusDesafios, setMeusDesafios] = useState([]);
  const [desafiosPraVoce, setDesafiosPraVoce] = useState([]);
  const [explorarDesafios, setExplorarDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadUsuario = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) throw new Error('Usuário não encontrado no armazenamento local');

      const usuario = await apiService.getUsuarioByEmail(email);

      if (!usuario || !usuario.id) throw new Error('Usuário inválido retornado pela API');

      setUserId(usuario.id);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg(`Erro ao carregar usuário: ${error.message}`);
      setUserId(null);
      setLoading(false);
    }
  };

  const loadAllDesafios = async () => {
    if (!userId) {
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const [meus, praVoce, explorar] = await Promise.all([
        apiService.getMeusDesafios(userId),
        apiService.getDesafiosPraVoce(userId),
        apiService.getDesafios(),
      ]);

      setMeusDesafios(meus ?? []);
      setDesafiosPraVoce(praVoce ?? []);
      setExplorarDesafios(explorar ?? []);
    } catch (error) {
      console.error("Erro ao carregar desafios:", error);
      setErrorMsg('Erro ao carregar desafios. Tente novamente mais tarde.');
      setMeusDesafios([]);
      setDesafiosPraVoce([]);
      setExplorarDesafios([]);
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
    loadUsuario();
  }, []);

  useEffect(() => {
    loadAllDesafios();
  }, [userId]);

  const verificarMembroDoDesafio = async (usuarioId, desafioId) => {
    try {
      const membros = await apiService.getMembrosPorUsuario(usuarioId);

      const membroDoDesafio = membros.find(
        (membro) => membro.desafio?.id === desafioId
      );

      if (!membroDoDesafio) {
        return { isMembro: false };
      }

      if (membroDoDesafio.status === "INATIVO") {
        return { isMembro: false };
      }

      return { isMembro: true };
    } catch (error) {
      console.error("Erro ao verificar membro do desafio:", error);
      return { isMembro: false };
    }
  };

  const handleDesafioPress = async (desafio) => {
    if (!userId) {
      setErrorMsg('Usuário não carregado ainda.');
      return;
    }

    const { isMembro } = await verificarMembroDoDesafio(userId, desafio.id);

    if (isMembro) {
      navigation.navigate('DetalhesDesafios', { desafioId: desafio.id });
    } else {
      navigation.navigate('ParticiparDesafio', {
        desafioId: desafio.id
      });
    }
  };

  const handleCreateDesafio = () => {
    navigation.navigate('CriarDesafios');
  };

  const renderDesafiosSection = (title, desafiosList, isMeusDesafios = false) => {
    if (desafiosList.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {desafiosList.map((item, index) => {
            const desafio = isMeusDesafios ? item.desafio : item;
            const key = isMeusDesafios ? item.desafioId || desafio.id : desafio.id;

            return (
              <View
                key={key}
                style={{ marginRight: index === desafiosList.length - 1 ? 0 : 16 }}
              >
                <DesafioCard desafio={desafio} onPress={() => handleDesafioPress(desafio)} />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Filtro para mostrar apenas meus desafios com status diferente de INATIVO
  const meusDesafiosAtivos = meusDesafios.filter(
    (m) => m.status && m.status !== "INATIVO"
  );

  if (loading && !userId) {
    return (
      <View style={styles.container}>
        <Header title="Desafios" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando usuário...</Text>
        </View>
      </View>
    );
  }

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

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {meusDesafiosAtivos.length > 0 &&
          renderDesafiosSection('Meus Desafios', meusDesafiosAtivos, true)}

        {desafiosPraVoce.length > 0 &&
          renderDesafiosSection('Pra Você', desafiosPraVoce)}

        {explorarDesafios.length > 0 &&
          renderDesafiosSection('Explorar', explorarDesafios)}
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
  errorContainer: {
    backgroundColor: '#800000AA',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
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
