import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Importe suas telas
import { PrimeScreen } from '../pages/PrimeScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { SignUpScreen1 } from '../pages/SignUpScreen1';
import { SignUpScreen2 } from '../pages/SignUpScreen2';
import { SignUpScreen3 } from '../pages/SignUpScreen3';
import { SignUpScreen4 } from '../pages/SignUpScreen4';

const Stack = createStackNavigator();

export default function AppNavegation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="PrimeScreen"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid, // Fade suave
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300, // Mais rápido
                useNativeDriver: true,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 300,
                useNativeDriver: true,
              },
            },
          },
          cardStyle: { backgroundColor: 'transparent' }, // Remove fundo branco
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PrimeScreen" component={PrimeScreen} />
        <Stack.Screen name="SignUpScreen1" component={SignUpScreen1} />
        <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
        <Stack.Screen name="SignUpScreen3" component={SignUpScreen3} />
        <Stack.Screen name="SignUpScreen4" component={SignUpScreen4} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}