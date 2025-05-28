import { Text, StyleSheet, View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrimeScreen } from './pages/PrimeScreen';
import { LoginScreen } from './pages/LoginScreen';

export default function App() {
  return(
    <LoginScreen/>
  )
};