const colors = {
  background: "#121212",
  cardBackground: "#1E1E1E",
  cardBackgroundAlt: "#333333",
  primary: "#1DB954",
  textPrimary: "#FFFFFF",
  textSecondary: "#CCC",
  textMuted: "#7A7A7A",
  border: "#444444",
  shadow: "#000000",
};

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
  Modal,
  Switch,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '../components/Header';
import { apiService } from '../services/apiMooks';

const { width } = Dimensions.get('window');

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

const tipoNotificacaoParaIcone = {
  CHECK_IN: { name: 'check-circle-outline', color: colors.primary },
  NOVO_DESAFIO: { name: 'trophy-outline', color: '#ffc107' },
  NOVO_MEMBRO: { name: 'account-plus-outline', color: '#17a2b8' },
  NOVO_COMENTARIO: { name: 'comment-outline', color: '#fd7e14' },
  ALERTA_TEMPO: { name: 'alarm-light-outline', color: '#dc3545' },
  DESAFIO_ENCERRADO: { name: 'flag-checkered', color: '#6f42c1' },
  PREMIO_DESAFIO: { name: 'gift-outline', color: '#e83e8c' },
  DESAFIO_CANCELADO: { name: 'close-circle-outline', color: '#dc3545' },
  CONVITE_GRUPO: { name: 'account-multiple-plus-outline', color: '#007bff' },
  CONVITE_DESAFIO: { name: 'account-star-outline', color: '#6610f2' },
  NOVO_MEMBRO_DESAFIO: { name: 'account-group-outline', color: '#20c997' },
};

const NotificacaoItem = ({ notificacao, onPress }) => {
  const tipo = notificacao.tipo ?? 'NOVO_DESAFIO';
  const { name, color } = tipoNotificacaoParaIcone[tipo] || {
    name: 'bell-outline',
    color: colors.textMuted,
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.85}
      onPress={() => onPress(notificacao)}
    >
      <View style={[styles.iconWrapper, { backgroundColor: color + '33' }]}>
        <Icon name={name} size={28} color={color} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.message}>{notificacao.mensagem ?? 'Sem mensagem'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificacaoGrupo = ({ grupo, onPress }) => (
  <View style={styles.groupContainer}>
    <Text style={styles.groupDate}>{formatDateTime(grupo.data_criacao)}</Text>
    {grupo.notificacoes.map((notificacao) => (
      <NotificacaoItem
        key={notificacao.uuid}
        notificacao={notificacao}
        onPress={onPress}
      />
    ))}
  </View>
);

export const Notificacao = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalConfiguracoes, setModalConfiguracoes] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({ desafios: true });

  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);

  const loadDados = async () => {
    try {
      setLoading(true);
      const [gruposData, , configuracoesData] = await Promise.all([
        apiService.getNotificacoes(),
        apiService.getEstatisticas(),
        apiService.getConfiguracoes(),
      ]);
      setGrupos(gruposData ?? []);
      setConfiguracoes(configuracoesData ?? { desafios: true });
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as notificações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDados();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDados();
    setRefreshing(false);
  };

  const abrirNotificacao = (notificacao) => {
    setNotificacaoSelecionada(notificacao);
    setModalDetalhesVisible(true);
  };

  const getIcone = (tipo) => {
    return tipoNotificacaoParaIcone[tipo] || {
      name: 'bell-outline',
      color: colors.textMuted,
    };
  };

  return (
    <View style={styles.container}>
      <Header title="Notificações" darkMode />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : grupos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma notificação disponível</Text>
        </View>
      ) : (
        <FlatList
          data={grupos}
          keyExtractor={(item) => item.data_criacao}
          renderItem={({ item }) => (
            <NotificacaoGrupo grupo={item} onPress={abrirNotificacao} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.textSecondary}
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: colors.textSecondary },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: colors.textMuted },

  groupContainer: {
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  groupDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },

  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textWrapper: { flex: 1 },
  message: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default Notificacao;
