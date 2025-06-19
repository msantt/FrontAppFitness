import { Background } from '@react-navigation/elements';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Dimensions } from 'react-native';

import BackgroundDefault from '../components/Background';
import TextComponent from '../components/Text';

export function SignUpScreen2({navigation}) {
  const { height } = Dimensions.get('window');
  
  const podeContinuar = true;
  
  const [objetivos, setObjetivos] = useState({
    condicionamentoFisico: false,
    hipertrofia: false,
    emagrecimento: false,
    definicaoMuscular: false,
    melhorarSaude: false,
  });
  
  const toggleSwitch = (key) => {
  setObjetivos({
    condicionamentoFisico: key === 'condicionamentoFisico',
    hipertrofia: key === 'hipertrofia',
    emagrecimento: key === 'emagrecimento',
    definicaoMuscular: key === 'definicaoMuscular',
    melhorarSaude: key === 'melhorarSaude',
  });
};
  
  return (
    <BackgroundDefault contentContainerStyle={styles.container}>
      
      {/* Título no topo */}
      <Text style={styles.titulo}>Cadastro</Text>

      <TextComponent style={{ fontSize: 22, textAlign: 'center', color: '#00D95F', }}>
        Antes de começar, precisamos de algumas informações para personalizar sua jornada fitness.
      </TextComponent>
      
      {/* Alternatives: múltipla escolha */}
      
      <View style={styles.sub}>
            <TextComponent style={{fontSize:26,fontWeight: 'bold',}}>Nivel</TextComponent>    
            </View>

      <View style={styles.alternativasContainer}>
        {Object.keys(objetivos).map((key) => (
          <View key={key} style={styles.alternativa}>
            <Text style={styles.alternativaTexto}>{getObjectiveLabel(key)}</Text>
            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: objetivos[key] ? '#00D95F' : '#A5A5A5' }
              ]}
              onPress={() => toggleSwitch(key)}
            >
              <Text style={styles.statusButtonText}>
                {objetivos[key] ? '✔' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      {/* Continue button */}
      <TouchableOpacity
        style={[
          styles.botao,
          { backgroundColor: podeContinuar ? '#00D95F' : '#A5A5A5' },
        ]}
        onPress={() => {
         if (podeContinuar) {
      navigation.navigate('SignUpScreen3');
          }
        }}
      >
        <Text style={styles.botaoTexto}>Continuar</Text>
      </TouchableOpacity>
      
      {/* Botão de voltar (seta) no canto superior esquerdo */}
      <Text style={styles.backArrow}>←</Text>
    </BackgroundDefault>
  );
}

// Função auxiliar para labels
const getObjectiveLabel = (key) => {
  switch (key) {
    case 'condicionamentoFisico':
      return 'Condicionamento físico';
    case 'hipertrofia':
      return 'Hipertrofia';
    case 'emagrecimento':
      return 'Emagrecimento';
    case 'definicaoMuscular':
      return 'Definição muscular';
    case 'melhorarSaude':
      return 'Melhorar a saúde';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  // Título no topo, centralizado
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: "10%",
    textAlign: 'center',
  },
  alternativasContainer: {
    marginBottom: "10%",
    marginTop: "2%",
    justifyContent: 'top',
    paddingHorizontal: 10,
  },
  alternativa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    padding: 30,
    marginBottom: "5%",
    marginHorizontal: 5,
    width: '95%',
    alignSelf: 'center',
  },
  alternativaTexto: {
    fontSize: 20,
    color: '#fff',
    flex: 1,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Botão na parte inferior
  botao: {
    position: 'absolute',
    bottom: "5%",
    left: '15%',
    width: '70%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Setinha superior esquerda
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 30,
    fontWeight: 'bold',
    zIndex: 9999,
  },
  
 sub: {
  alignSelf: 'flex-start',
  marginLeft: 20,
  marginTop: "10%", 
  marginBottom: "5%",
  paddingHorizontal: 20,
}
});