import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { DesafioCard } from '../components/DesafioCard';
import { BottomNav } from '../components/BottomNav';
import TextComponent from '../components/Text';
import { apiService } from '../services/apiMooks';
import { Cronograma } from '../components/Cronograma';

export function HomeScreen() {
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [ofensiva, setOfensiva] = useState('');
  const [ultimosCheckins, setUltimosCheckins] = useState([]);

  const [cronogramaUltimosCheckins, setCronogramaUltimosCheckins] = useState({
    dom: false,
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
  });

  const [myChallenges, setMyChallenges] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadUsuario = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) throw new Error('Usuário não encontrado no armazenamento local');

      const usuario = await apiService.getUsuarioByEmail(email);

      if (!usuario || !usuario.id) throw new Error('Usuário inválido retornado pela API');

      setUserId(usuario.id);
      setUserName(usuario.nome || '');
      setOfensiva(usuario.ofensiva || '');

      setErrorMsg(null);
    } catch (error) {
      setErrorMsg(`Erro ao carregar usuário: ${error.message}`);
      setUserId(null);
      setUserName('');
      setOfensiva('');
      setLoading(false);
    }
  };

  const loadUltimosCheckins = async (userId) => {
    try {
      const checkinsUsuario = await apiService.getCheckInsByUsuarioId(userId);

      setUltimosCheckins(checkinsUsuario || []);

      const novoCronograma = {
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
      };

      (checkinsUsuario || []).forEach((checkin) => {
        const dia = new Date(checkin.dataHoraCheckin).getDay();
        if (dia === 0) novoCronograma.dom = true;
        if (dia === 1) novoCronograma.seg = true;
        if (dia === 2) novoCronograma.ter = true;
        if (dia === 3) novoCronograma.qua = true;
        if (dia === 4) novoCronograma.qui = true;
        if (dia === 5) novoCronograma.sex = true;
        if (dia === 6) novoCronograma.sab = true;
      });

      setCronogramaUltimosCheckins(novoCronograma);
    } catch (error) {
      console.error('Erro ao carregar últimos check-ins:', error);
      setUltimosCheckins([]);
      setCronogramaUltimosCheckins({
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
      });
    }
  };

  // Carregar desafios com base no userId
  const loadChallenges = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const [meus, recomendar] = await Promise.all([
        apiService.getMeusDesafios(userId),
        apiService.getDesafios(),
      ]);

      setMyChallenges(meus ?? []);
      setRecommendedChallenges(recomendar ?? []);

      // Carregar os últimos check-ins ao mesmo tempo
      await loadUltimosCheckins(userId);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
      setErrorMsg('Erro ao carregar desafios. Tente novamente mais tarde.');
      setMyChallenges([]);
      setRecommendedChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh pull
  const onRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  // Carregar usuário na montagem
  useEffect(() => {
    loadUsuario();
  }, []);

  // Quando userId mudar, carrega os desafios e últimos checkins
  useEffect(() => {
    if (userId) {
      loadChallenges();
    }
  }, [userId]);

  const handleChallengePress = (desafio) => {
    navigation.navigate('DetalhesDesafios', { desafioId: desafio.id });
  };

  const handleExploreChallengesPress = () => {
    navigation.navigate('DesafiosScreen');
  };

  const renderDesafiosSection = (title, desafiosList, buttonLabel, onButtonPress) => {
    if (!desafiosList || desafiosList.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <TextComponent style={styles.sectionTitle}>{title}</TextComponent>
          {buttonLabel && onButtonPress && (
            <TouchableOpacity onPress={onButtonPress}>
              <Text style={styles.seeAllText}>{buttonLabel}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengesContainer}
        >
          {desafiosList.map((desafio, index) => (
            <View
              key={desafio.id}
              style={{ marginRight: index === desafiosList.length - 1 ? 0 : 16 }}
            >
              <DesafioCard desafio={desafio} onPress={() => handleChallengePress(desafio)} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title={`Bem Vindo, ${userName || 'Usuário'}`}
          subtitle="Pronto para Um Próximo Desafio?"
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{errorMsg ? errorMsg : 'Carregando desafios...'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Bem Vindo, ${userName || 'Usuário'}`}
        subtitle="Pronto para Um Próximo Desafio?"
      />

      {/* Exibir ofensiva do usuário */}
      {ofensiva ? (
        <View style={styles.ofensivaContainer}>
          <Text style={styles.ofensivaText}>Ofensiva: {ofensiva}</Text>
        </View>
      ) : null}

      {/* Cronograma dos últimos check-ins do usuário */}
      <View style={styles.cronogramaContainer}>
        <TextComponent style={styles.cronogramaTitle}>Seu Cronograma de Check-ins</TextComponent>
        <Cronograma schedule={cronogramaUltimosCheckins} />
      </View>

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
        {renderDesafiosSection('Meus Desafios', myChallenges, 'Ver todos', () => navigation.navigate('MeusDesafios'))}

        {renderDesafiosSection('Desafios Recomendados', recommendedChallenges, 'Explorar', handleExploreChallengesPress)}
      </ScrollView>

      <BottomNav active="Home" />
    </View>
  );
}

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
  section: {
    marginBottom: 32,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D95F',
  },
  challengesContainer: {
    paddingHorizontal: 8,
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
  ofensivaContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  ofensivaText: {
    color: '#00D95F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cronogramaContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  cronogramaTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
