import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

// Importe suas telas
import { PrimeScreen } from "../pages/PrimeScreen";
import { LoginScreen } from "../pages/LoginScreen";
import { SignUpScreen1 } from "../pages/SignUpScreen1";
import { SignUpScreen2 } from "../pages/SignUpScreen2";
import { SignUpScreen3 } from "../pages/SignUpScreen3";
import { SignUpScreen4 } from "../pages/SignUpScreen4";
import DesafiosScreen from "../pages/MeusDesafios";
import { CriarDesafios } from "../pages/CriarDesafio";
import {DetalhesDesafios} from "../pages/DetalhesDesafios";
import { ParticiparDesafioScreen } from "../pages/DetalhesParticiparDesafio";
import { Perfil } from '../pages/Perfil';
import { Ranking } from "../pages/Ranking";
import { Notificacao } from  "../pages/Notificacao"


const Stack = createStackNavigator();

export default function AppNavegation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PrimeScreen"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid, // Fade suave
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 300, // Mais rápido
                useNativeDriver: true,
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 300,
                useNativeDriver: true,
              },
            },
          },
          cardStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PrimeScreen" component={PrimeScreen} />
        <Stack.Screen name="SignUpScreen1" component={SignUpScreen1} />
        <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
        <Stack.Screen name="SignUpScreen3" component={SignUpScreen3} />
        <Stack.Screen name="SignUpScreen4" component={SignUpScreen4} />
        <Stack.Screen name="DesafiosScreen" component={DesafiosScreen} />
        <Stack.Screen name="CriarDesafios" component={CriarDesafios} />
        <Stack.Screen name="DetalhesDesafios" component={DetalhesDesafios} />
        <Stack.Screen name="ParticiparDesafio" component={ParticiparDesafioScreen} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Ranking" component={Ranking} />
        <Stack.Screen name="Notificacao" component={Notificacao} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
