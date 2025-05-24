import { Text, StyleSheet, View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigation } from './navigation/AppNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  return(
<AppNavigation />
  )
};