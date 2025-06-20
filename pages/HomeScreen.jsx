import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';

import TextComponent from '../components/Text';
import { BottomNav } from '../components/BottomNav';
import { DesafioCard } from '../components/DesafioCard';
import { apiService } from '../services/apiMooks';

const { width, height } = Dimensions.get('window');

export function HomeScreen() {
  const navigation = useNavigation();

  const [offensiveDays, setOffensiveDays] = useState(50);
  const [totalPoints, setTotalPoints] = useState(1089);
  const [weeklyProgress, setWeeklyProgress] = useState({
    Seg: true,
    Ter: true,
    Qua: true,
    Qui: false,
    Sex: false,
    Sab: true,
    Dom: false,
  });

  const [myChallenges, setMyChallenges] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const allChallenges = await apiService.getDesafios();
        setMyChallenges(allChallenges.slice(0, 2));
        setRecommendedChallenges(allChallenges.slice(2, 6));
      } catch (error) {
        console.error('Erro ao carregar desafios:', error);
      } finally {
        setLoadingChallenges(false);
      }
    };

    loadChallenges();
  }, []);

  const handleChallengePress = (desafio) => {
    navigation.navigate('DetalhesDesafios', { desafioId: desafio.id });
  };

  const handleExploreChallengesPress = () => {
    navigation.navigate('DesafiosScreen');
  };

  const handleCheckIn = () => {
    navigation.navigate('CheckInFlow');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <TextComponent style={styles.welcomeText}>
              Bem Vindo, Manuel
            </TextComponent>
            <TextComponent style={styles.subtitleText}>
              Pronto para Um Próximo Desafio?
            </TextComponent>
          </View>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={() => console.log('Notificações')}>
              <Feather name="bell" size={width * 0.06} color="#FFF" style={styles.notificationIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Abrir Perfil')}>
              <Image
                source={{ uri: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHwwfHx8fDE2OTY1MjQ0NjA&auto=format&fit=crop&w=3000&q=60' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de Constância (Check-in) */}
        <View style={styles.checkinSection}>
          <View style={styles.offensiveCard}>
            <Image
              source={require('../assets/imagens/fire_icon.png')}
              style={styles.offensiveIcon}
            />
            <Text style={styles.offensiveDaysText}>{offensiveDays} Dias</Text>
            <Text style={styles.offensiveLabel}>Ofensiva</Text>
          </View>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsText}>Pontos: {totalPoints}</Text>
            <View style={styles.weeklyProgressContainer}>
              {Object.keys(weeklyProgress).map((day) => (
                <View key={day} style={styles.dayIndicator}>
                  <Text style={styles.dayLabel}>{day.substring(0, 3)}</Text>
                  <View
                    style={[
                      styles.dayCircle,
                      weeklyProgress[day] ? styles.dayCircleChecked : styles.dayCircleEmpty,
                    ]}
                  >
                    {weeklyProgress[day] && (
                      <Feather name="check" size={width * 0.03} color="#000" />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Meus Desafios */}
        <View style={styles.sectionTitleContainer}>
          <TextComponent style={styles.sectionTitle}>Meus Desafios</TextComponent>
          <TouchableOpacity onPress={() => navigation.navigate('MeusDesafios')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {loadingChallenges ? (
          <TextComponent style={styles.loadingText}>Carregando Meus Desafios...</TextComponent>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.challengesContainer}>
            {myChallenges.map((desafio) => (
              <DesafioCard key={desafio.id} desafio={desafio} onPress={() => handleChallengePress(desafio)} />
            ))}
          </ScrollView>
        )}

        {/* Desafios Recomendados */}
        <View style={styles.sectionTitleContainer}>
          <TextComponent style={styles.sectionTitle}>Desafios Recomendados</TextComponent>
          <TouchableOpacity onPress={handleExploreChallengesPress}>
            <Text style={styles.seeAllText}>Explorar</Text>
          </TouchableOpacity>
        </View>
        {loadingChallenges ? (
          <TextComponent style={styles.loadingText}>Carregando Desafios Recomendados...</TextComponent>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.challengesContainer}>
            {recommendedChallenges.map((desafio) => (
              <DesafioCard key={desafio.id} desafio={desafio} onPress={() => handleExploreChallengesPress()} />
            ))}
          </ScrollView>
        )}
      </ScrollView>

      {/* Navegação Inferior */}
      <BottomNav active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Fundo igual à tela de desafios
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * 0.1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    paddingTop: height * 0.06,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subtitleText: {
    fontSize: width * 0.04,
    color: '#B3B3B3',
    textAlign: 'left',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: width * 0.03,
  },
  profileImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
  },
  checkinSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: width * 0.04,
    marginBottom: height * 0.02,
  },
  offensiveCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: width * 0.04,
    alignItems: 'center',
    width: '48%',
    height: height * 0.18,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  offensiveIcon: {
    width: width * 0.35, 
    height: width * 0.26, 
    marginBottom: height * 0.0001,
  },
  offensiveDaysText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#00D95F',
  },
  offensiveLabel: {
    fontSize: width * 0.04,
    color: '#B3B3B3',
  },
  pointsCard: {
    backgroundColor: '#1DB954',
    borderRadius: 15,
    padding: width * 0.04,
    alignItems: 'center',
    width: '48%',
    height: height * 0.18,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  pointsText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: height * 0.01,
  },
  weeklyProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayIndicator: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: width * 0.03,
    color: '#000000',
    marginBottom: height * 0.005,
  },
  dayCircle: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleChecked: {
    backgroundColor: '#000000',
  },
  dayCircleEmpty: {
    backgroundColor: '#666666',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  seeAllText: {
    color: '#00D95F',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  challengesContainer: {
    paddingHorizontal: width * 0.04,
    gap: width * 0.04,
  },
  loadingText: {
    textAlign: 'center',
    color: '#B3B3B3',
    marginTop: height * 0.02,
  },
});