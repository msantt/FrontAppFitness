import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import { PrimeScreen } from "../pages/PrimeScreen";
import { LoginScreen } from "../pages/LoginScreen";
import { SignUpScreen1 } from "../pages/SignUpScreen1";
import { SignUpScreen2 } from "../pages/SignUpScreen2";
import { SignUpScreen3 } from "../pages/SignUpScreen3";
import { SignUpScreen4 } from "../pages/SignUpScreen4";
import DesafiosScreen from "../pages/MeusDesafios";
import { CriarDesafios } from "../pages/CriarDesafio";
import { DetalhesDesafios } from "../pages/DetalhesDesafios";
import { ParticiparDesafioScreen } from "../pages/DetalhesParticiparDesafio";
import { Perfil } from "../pages/Perfil";
import { Ranking } from "../pages/Ranking";
import { Notificacao } from "../pages/Notificacao";
import CheckInFlow from "../pages/CheckInFlow";
import { HomeScreen } from "../pages/HomeScreen";
import { EncontrarGruposScreen } from "../pages/EncontrarGruposScreen";
import { CriarGrupoScreen } from "../pages/CriarGrupoScreen";
import { ConfirmacaoCriacaoGrupoScreen } from "../pages/ConfirmacaoCriacaoGrupoScreen";
import  GroupDetails  from "../pages/GroupDetailsScreen";

const Stack = createStackNavigator();

export default function AppNavegation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PrimeScreen"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 300,
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
        <Stack.Screen name="PrimeScreen" component={PrimeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen1" component={SignUpScreen1} />
        <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
        <Stack.Screen name="SignUpScreen3" component={SignUpScreen3} />
        <Stack.Screen name="SignUpScreen4" component={SignUpScreen4} />
        <Stack.Screen name="DesafiosScreen" component={DesafiosScreen} />
        <Stack.Screen name="CriarDesafios" component={CriarDesafios} />
        <Stack.Screen name="DetalhesDesafios" component={DetalhesDesafios} />
        <Stack.Screen
          name="ParticiparDesafio"
          component={ParticiparDesafioScreen}
        />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Ranking" component={Ranking} />
        <Stack.Screen name="Notificacao" component={Notificacao} />
        <Stack.Screen name="CheckInFlow" component={CheckInFlow} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="EncontrarGruposScreen"
          component={EncontrarGruposScreen}
        />
        <Stack.Screen name="CriarGrupoScreen" component={CriarGrupoScreen} />
        <Stack.Screen
          name="ConfirmacaoCriacaoGrupoScreen"
          component={ConfirmacaoCriacaoGrupoScreen}
        />
        <Stack.Screen
          name="GroupDetails"
          component={GroupDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
