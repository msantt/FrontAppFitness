import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './navigation/AppNavigation';
import { PrimeScreen } from './pages/PrimeScreen';
import { LoginScreen } from './pages/LoginScreen';
import { SignUpScreen1 } from './pages/SignUpScreen1';
import { SignUpScreen2 } from './pages/SignUpScreen2';
import { SignUpScreen3 } from './pages/SignUpScreen3';

export default function App() {
  return (
  <AppNavigation/>
  )
}
