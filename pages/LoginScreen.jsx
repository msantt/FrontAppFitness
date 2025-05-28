import { View, StyleSheet, Text } from 'react-native';

import TextComponent from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';

import BackgroundDefault from '../components/BackgroundDefault';
import TextLink from '../components/Links';

export function LoginScreen() {
    return (
        <BackgroundDefault>
            <View style={styles.screen}>

                <View style={styles.topText}>
                    <TextComponent style={{ fontSize: 45 }}>
                        Faça Login com{"\n"}
                        Sua Conta
                    </TextComponent>
                </View>

                <View style={styles.containerInput}>
                    <View>
                        <Input>email(Texto ainda)</Input>
                    </View>
                    <View>
                        <Input>Senha(Texto ainda)</Input>
                    </View>
                </View>

                <View style={{ marginBottom: 20, }}>
                    <Button title="Entrar"></Button>
                </View>

                <View>
                    <TextLink style={styles.link} url={"https://youtube.com"}>esqueceu a senha?</TextLink>
                </View>

                <View>
                </View>

            </View>
        </BackgroundDefault >
    );
};


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        justifyContent: 'cen', // distribui os itens verticalmente
        alignItems: 'center',
        paddingVertical: 200,
    },
    topText: {
        marginTop: 25,
    },
    containerInput: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100,
        marginTop: 120,
    },
    link: {
        color: '#1DB954',
    }
});