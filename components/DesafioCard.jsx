import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const DesafioCard = ({ desafio, onPress }) => {
  const [membrosAtivos, setMembrosAtivos] = useState(0);

  const calcularDiasRestantes = (dataFim) => {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diffMs = fim - hoje;
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDias > 0 ? diffDias : 0;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const carregarMembros = async () => {
    try {
      const membros = await apiService.getMembrosByDesafio(desafio.id);
      const ativos = membros.filter((m) => m.status === 'ATIVO');
      setMembrosAtivos(ativos.length);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      setMembrosAtivos(0);
    }
  };

  useEffect(() => {
    carregarMembros();
  }, [desafio.id]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: desafio.urlFoto }} style={styles.cardImage} />
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
          <Text style={styles.cardTitle} numberOfLines={2}>
            {desafio.nome}
          </Text>
          <Text style={styles.participantesText}>
            {membrosAtivos} membros ativos
          </Text>
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
    backgroundColor: '#333',
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
});
