import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

const { width } = Dimensions.get('window');

export function ConfirmacaoCriacaoGrupoScreen({ route }) {
  const navigation = useNavigation();
  const { grupo } = route.params;

  const handleCopyCode = async () => {
    if (grupo.codigoAcesso) {
      await Clipboard.setStringAsync(grupo.codigoAcesso);
      Alert.alert('Copiado!', 'Código do grupo copiado para a área de transferência.');
    }
  };

  const handleShareGroup = async () => {
    try {
      const mensagem =
        `🚀 Participe do meu grupo "${grupo.nome}" no app de desafios!\n` +
        (grupo.tipoGrupo === 'PRIVADO'
          ? `🔒 Código de acesso: ${grupo.codigoAcesso}\n`
          : '') +
        `Baixe o app e encontre o grupo!`;

      const result = await Share.share({ message: mensagem });

      if (result.action === Share.sharedAction) {
        // Compartilhado com sucesso
      }
    } catch (error) {
      Alert.alert('Erro ao compartilhar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Grupo Criado!"
        showBackButton={true}
        onBackPress={() => navigation.navigate('EncontrarGruposScreen')}
      />

      <View style={styles.content}>
        <AntDesign name="checkcircleo" size={width * 0.2} color="#00D95F" />
        <Text style={styles.title}>Grupo criado com sucesso!</Text>
        <Text style={styles.subtitle}>
          Compartilhe com seus amigos para participarem do grupo.
        </Text>
        <View style={styles.detailsCard}>
          <Text style={styles.detailLabel}>Código do Grupo:</Text>
          <Text style={styles.detailValueCode}>
            {grupo.codigoAcesso || 'N/A'}
          </Text>
          <Text style={styles.detailLabel}>Nome do Grupo:</Text>
          <Text style={styles.detailValue}>{grupo.nome}</Text>
          <Text style={styles.detailLabel}>Administrador:</Text>
          <Text style={styles.detailValue}>
            {grupo.criador?.nome || 'Você'}
          </Text>

          <Text style={styles.detailLabel}>Tipo:</Text>
          <Text style={styles.detailValue}>
            {grupo.tipoGrupo === 'PUBLICO' ? 'Público' : 'Privado'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {grupo.tipoGrupo === 'PRIVADO' && grupo.codigoAcesso && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCopyCode}>
              <Feather name="copy" size={width * 0.05} color="#000" />
              <Text style={styles.actionButtonText}>Copiar código</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleShareGroup}>
            <Feather name="share-2" size={width * 0.05} color="#000" />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('EncontrarGruposScreen')}
        >
          <Text style={styles.doneButtonText}>Concluir</Text>
        </TouchableOpacity>
      </View>

      <BottomNav active="Grupos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.04,
    paddingBottom: 100,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#00D95F',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 30,
  },
  detailsCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  detailLabel: {
    color: '#B3B3B3',
    fontSize: width * 0.035,
    marginBottom: 5,
  },
  detailValue: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailValueCode: {
    color: '#00D95F',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#00D95F',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  doneButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    paddingVertical: 15,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D95F',
  },
  doneButtonText: {
    color: '#00D95F',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});
