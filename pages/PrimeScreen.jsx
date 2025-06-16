
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/Button';
import TextComponent from '../components/Text';
import Links from '../components/Links';

import BackgroundWelcome from '../components/BackgroundWelcome';
import { Row } from 'native-base';
import { LoginScreen } from './LoginScreen';


export function PrimeScreen({navegate}) {

    const navigation = useNavigation();

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
                <View>
                    <TextComponent style={{ fontSize: 20, marginTop: 20 }}>
                        Faça check-ins, acumule pontos e conquiste prêmios de verdade.
                    </TextComponent>
                </View>

                <View style={styles.button}>
                    <Button title="Iniciar Jornada" onPress={() => navigation.navigate('LoginScreen')}
                    />
                </View>

                <View style={styles.tochLogin}>
                    <TextComponent style={{ flexDirection: 'row' }}>
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
        justifyContent: 'flex-start',
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: -20,
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
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
});

