import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

import TextComponent from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import BackgroundDefault from '../components/BackgroundDefault';
import TextLink from '../components/Links';

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [lembrar, setLembrar] = useState(false);
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('loginData').then(data => {
            if (data) {
                const { email, senha } = JSON.parse(data);
                setEmail(email);
                setSenha(senha);
                setLembrar(true);
            }
        });
    }, []);

    const usuariosFake = [
        { email: 'teste1@email.com', senha: 'TesteSenha123@' },
        { email: 'teste2@email.com', senha: 'TesteSenha321@' }
    ];

    const handleLogin = () => {
        const usuarioEncontrado = usuariosFake.find((u) => u.email === email && u.senha === senha);
        alert(usuarioEncontrado ? 'Login realizado com Sucesso' : 'Usuário não foi encontrado.');
    };

    return (
        <BackgroundDefault>
            <View style={styles.screen}>
                <View style={styles.topText}>
                    <TextComponent style={{ fontSize: height * 0.05 }}>
                        Faça Login com{"\n"}Sua Conta
                    </TextComponent>
                </View>

                <View style={styles.containerInput}>
                    <Input
                        leftIcon={
                            <Image
                                source={require('../assets/imagens/perfil_icon.png')}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        }
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Input
                        leftIcon={
                            <Image
                                source={require('../assets/imagens/senha_icon.png')}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        }
                        placeholder="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={!senhaVisivel}
                        rightIcon={
                            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                                <Image
                                    source={
                                        senhaVisivel
                                            ? require('../assets/imagens/ver_senha_icon.png')
                                            : require('../assets/imagens/ocultar_senha_icon.png')
                                    }
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        }
                    />

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setLembrar(!lembrar)}
                    >
                        <View style={[styles.checkbox, lembrar && styles.checkboxChecked]}>
                            {lembrar && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>Lembrar meus dados</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: height * 0.030 }}>
                    <Button title="Entrar" onPress={() => navigation.navigate('SignUpScreen1')} />
                </View>

                <TextLink style={styles.link} url={"https://youtube.com"}>
                    esqueceu a senha?
                </TextLink>

                <View style={styles.separator}>
                    <Text>_______________________</Text>
                    <Text style={styles.separatorText}> OU </Text>
                    <Text>_______________________</Text>
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialBox}>
                        <SocialButton
                            icon={require('../assets/imagens/apple_icon.png')}
                            onPress={() => alert('Login com Apple')}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBox}>
                        <SocialButton
                            icon={require('../assets/imagens/instagram_icon.png')}
                            onPress={() => alert('Login com Instagram')}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBox}>
                        <SocialButton
                            icon={require('../assets/imagens/google_icon.png')}
                            onPress={() => alert('Login com Google')}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.link}>
                    <TextComponent>Ainda não possui Conta? </TextComponent>
                    <TextLink url={"https://youtube.com"}>Cadastre-se</TextLink>
                </View>
            </View>
        </BackgroundDefault>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: height * 0.10,
    },
    topText: {
        marginBottom: height * 0.08,
        flexDirection: 'row',
    },
    containerInput: {
        width: width * 0.9 ,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.08,
        marginBottom: height * 0.02,
    },
    link: {
        marginTop: height * 0.015,
        marginBottom: height * 0.015,
        color: '#1DB954',
        flexDirection: 'row',
        fontSize: width / 20,
    },
    icon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: width * 0.02,
    },
    checkbox: {
        width: width * 0.06,
        height: width * 0.06,
        borderWidth: 2,
        borderColor: '#00D95F',
        borderRadius: 6,
        marginRight: width * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#1DB954',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.01,
        marginBottom: height * 0.02,
        marginLeft: width * 0.08,
        alignSelf: 'flex-start',
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    checkboxLabel: {
        color: '#fff',
        fontSize: 16,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: height * 0.025,
    },
    socialBox: {
        width: width * 0.14,
        height: width * 0.14,
        backgroundColor: '#4F4F4F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: width * 0.07,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separatorText: {
        marginHorizontal: 8,
        marginTop: 4,
    },
});
