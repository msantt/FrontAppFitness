
import { View, StyleSheet } from 'react-native';

import Button from '../components/Button';

import BackgroundWelcome from '../components/BackgroundWelcome';


export function PrimeScreen() {
    return (
        <BackgroundWelcome>
                <Button title="Buttom" onPress={() => alert("Botao funciona")}/>
        </BackgroundWelcome>
    );
}