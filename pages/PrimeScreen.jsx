
import { View, StyleSheet, Text } from 'react-native';

import Button from '../components/Button';
import TextComponent from '../components/Text';
import Links from '../components/Links';
import LoginScreen from './LoginScreen';

import BackgroundWelcome from '../components/BackgroundWelcome';


export function PrimeScreen() {
    return (
        <BackgroundWelcome>
            <View style={styles.screen}>
                <View style={styles.topText}>
                    <TextComponent style={{ fontSize: 40 }}>
                        Desafie seus limites{"\n"}
                        Ganhe mais que{"\n"}
                        resultados
                    </TextComponent>
                </View>

                <View style={styles.button}>
                    <Button title="Iniciar Jornada" onPress={() => alert("Botao funciona")} />
                </View>

                <View style={styles.tochLogin}>
                    <TextComponent>
                        Já tem uma conta? <Links styles={{ marginBottom: 1 }} >Login</Links>
                    </TextComponent>
                </View>
            </View>
        </BackgroundWelcome>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between', // distribui os itens verticalmente
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    topText: {
        alignItems: 'center',
        marginTop: 500,
    },
    button: {
        marginTop: 200,
        alignItems: 'center',
    },
    tochLogin: {
        alignItems: 'center',
        marginBottom: 20,
    },
});