import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CardDesafio from '../components/DesafioCard';

export default function ExplorarDesafiosScreen() {
  const desafios = [
    {
      id: '3',
      titulo: 'Pedalar 100km',
      status: 'Faltam 18D',
      patrocinado: true,
      participantes: 35,
      posicao: null,
      imagem: 'https://runplace.com.br/wp-content/uploads/2020/01/ajustes-na-corrida-1536x864.jpg',
    },
    {
      id: '4',
      titulo: '20 Dias Seguidos',
      status: 'Faltam 20D',
      patrocinado: false,
      participantes: 16,
      posicao: null,
      imagem: 'https://runplace.com.br/wp-content/uploads/2020/01/ajustes-na-corrida-1536x864.jpg',
    },
    {
      id: '7',
      titulo: 'Corrida + Força Total',
      status: 'Faltam 30D',
      patrocinado: true,
      participantes: 35,
      posicao: null,
      imagem: 'https://runplace.com.br/wp-content/uploads/2020/01/ajustes-na-corrida-1536x864.jpg',
    },
    {
      id: '8',
      titulo: 'Pernas em Dia',
      status: 'Faltam 28D',
      patrocinado: false,
      participantes: 16,
      posicao: null,
      imagem: 'https://runplace.com.br/wp-content/uploads/2020/01/ajustes-na-corrida-1536x864.jpg',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Explorar Desafios</Text>
      <View style={styles.grid}>
        {desafios.map((item) => (
          <CardDesafio key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E', paddingTop: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 10 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
