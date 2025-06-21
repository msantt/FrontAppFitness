import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar telas de autenticação
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

// Importar contexto de autenticação
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

// Navegação para usuários não autenticados
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Navegação para usuários autenticados
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Push-UP' }} />
    </Stack.Navigator>
  );
};

// Componente principal de navegação
export default function AppNavigation() {
  const { isAuthenticated, loading } = useAuth();

  // Exibir tela de carregamento se necessário
  if (loading) {
    return null; // Poderia ser substituído por um componente de loading
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
