import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const DesafioCard = ({ desafio, onPress }) => {
  const calcularDiasRestantes = (dataFim) => {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diffMs = fim - hoje;
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDias > 0 ? diffDias : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo':
        return '#1DB954';
      case 'patrocinado':
        return '#FFD700';
      case 'finalizado':
        return '#666';
      default:
        return '#1DB954';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ativo': {
        const dias = calcularDiasRestantes(desafio.dataFim);
        return dias > 0 ? `Acaba em ${dias} dia(s)` : 'Desafio encerrado';
      }
      case 'patrocinado':
        return 'Patrocinado';
      case 'finalizado':
        return 'Finalizado';
      default: {
        const dias = calcularDiasRestantes(desafio.dataFim);
        return dias > 0 ? `Acaba em ${dias} dia(s)` : 'Desafio encerrado';
      }
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: desafio.imagem }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(desafio.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(desafio.status)}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{desafio.nome}</Text>
          <Text style={styles.participantesText}>
            {desafio.participantes} Participantes
          </Text>
          {desafio.posicaoUsuario && (
            <Text style={styles.posicaoText}>
              Você está em {desafio.posicaoUsuario}º lugar
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  participantesText: {
    color: '#CCC',
    fontSize: 12,
  },
  posicaoText: {
    color: '#1DB954',
    fontSize: 11,
    marginTop: 2,
  },
});
