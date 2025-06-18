import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/Button';
import TextComponent from '../components/Text';
import Links from '../components/Links';
import BackgroundWelcome from '../components/BackgroundWelcome';

const { width, height } = Dimensions.get('window');

export function PrimeScreen() {
    const navigation = useNavigation();

    return (
        <BackgroundWelcome>
            <View style={styles.container}>
                <View style={styles.content}>
                    <TextComponent style={styles.title}>
                        Desafie seus limites{"\n"}
                        Ganhe mais que{"\n"}
                        resultados
                    </TextComponent>

                    <TextComponent style={styles.subtitle}>
                        Faça check-ins, acumule pontos e conquiste prêmios de verdade.
                    </TextComponent>

                    <View style={styles.buttonContainer}>
                        <Button 
                            title="Iniciar Jornada" 
                            onPress={() => navigation.navigate('LoginScreen')} 
                        />
                    </View>

                    <View style={styles.footer}>
                        <TextComponent style={styles.footerText}>já possui conta? </TextComponent>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                            <Text style={styles.footerLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BackgroundWelcome>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: height * 0.08,
    },
    content: {
        width: '100%',
        alignItems: 'center',
        gap: height * 0.04,
    },
    title: {
        fontSize: width * 0.09,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: width * 0.045,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '80%',
        alignItems: 'center',
    },
    loginContainer: {
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: width * 0.015,
    },
    footerText: {
    fontSize: width * 0.040,
    color: '#fff',
    },
    footerLink: {
        color: '#1DB954',
        fontSize: width * 0.040,
    },
});
