import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons';

import MeusDesafiosScreen from '../pages/MeusDesafios';
import ExplorarDesafiosScreen from '../pages/ExplorarDesafios';
import CriarDesafioScreen from '../pages/CriarDesafio';
import DetalhesDesafio from '../pages/DetalhesDesasfios';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { justifyContent: "center" , alignItems: "center" ,marginBottom: 20 , paddingHorizontal: 20 ,marginTop: 20}]}>
        <View style={{ alignItems: "flex-start", flex: 1 }}>
          <Text style={styles.title}>Desafios</Text>
          <Text style={styles.subtitle}>Acompanhe e crie novos desafios</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => navigation.navigate('CriarDesafioScreen')}
        >
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: "#1C1C1E" },
            tabBarLabelStyle: { color: "#fff", fontWeight: "bold" },
            tabBarIndicatorStyle: { backgroundColor: "#00FF57" },
          }}
        >
          <Tab.Screen name="Meus" component={MeusDesafiosScreen} />
          <Tab.Screen name="Explorar" component={ExplorarDesafiosScreen} />
        </Tab.Navigator>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Entypo name="home" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="globe" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="check" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton}>
          <Entypo name="camera" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="user" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DesafiosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsScreen} />
      <Stack.Screen name="CriarDesafioScreen" component={CriarDesafioScreen} />
      <Stack.Screen name="DetalhesDesafio" component={DetalhesDesafio} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C1C1E", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#aaa", fontSize: 13 },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#00FF57",
    borderRadius: 50,
    padding: 6,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#2A2A2C",
    width: "48%",
    borderRadius: 15,
    marginBottom: 15,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#00FF57",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: { color: "#000", fontSize: 10, fontWeight: "bold" },
  patrocinadoBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  patrocinadoText: { color: "#000", fontSize: 10, fontWeight: "bold" },
  cardContent: { padding: 8 },
  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  cardSub: { color: "#ccc", fontSize: 11 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#2A2A2C",
  },
  scanButton: {
    backgroundColor: "#00FF57",
    padding: 6,
    borderRadius: 50,
  },
});