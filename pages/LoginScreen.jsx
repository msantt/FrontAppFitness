import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import TextComponent from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';

import BackgroundDefault from '../components/BackgroundDefault';
import TextLink from '../components/Links';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'native-base';

export function LoginScreen() {

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
        if (usuarioEncontrado) {
            alert('Login realizado com Sucesso');
        } else {
            alert('Usuario nao foi encontrado.');
        }
    };


    return (
        <BackgroundDefault>
            <View style={styles.screen}>
                <View style={styles.topText}>
                    <TextComponent style={{ fontSize: 45, }}>
                        Faça Login com{"\n"}
                        Sua Conta
                    </TextComponent>
                </View>
                <View style={styles.containerInput}>
                    <View>
                        <Input
                            leftIcon={
                                <Image
                                    source={require('../assets/imagens/perfil_icon.png')}
                                    style={{ width: 24, height: 24, marginRight: 8 }}
                                    resizeMode="contain"
                                />
                            }
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View>
                        <Input
                            leftIcon={
                                <Image
                                    source={require('../assets/imagens/senha_icon.png')}
                                    style={{ width: 24, height: 24, marginRight: 8 }}
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
                                        style={{ width: 24, height: 24 }}

                                    />
                                </TouchableOpacity>
                            }
                        >

                        </Input>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setLembrar(!lembrar)}>
                            <View
                                style={[styles.checkbox, lembrar && styles.checkboxChecked]}>
                                {lembrar && <Text style={styles.checkmark}>✓</Text>}
                            </View>

                            <Text style={styles.checkboxLabel}>Lembrar meus dados</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginBottom: 40, marginTop: -80 }}>
                    <Button
                        title="Entrar"
                        onPress={handleLogin}
                    ></Button>
                </View>
                <View>
                    <TextLink style={styles.link} url={"https://youtube.com"}>esqueceu a senha?</TextLink>
                </View>

                <View style={{ flexDirection: 'row' }} >
                    <Text>_______________________</Text>
                    <Text style={{ marginTop: 4 }}> OU </Text>
                    <Text>_______________________</Text>
                </View>

                {/*//Adicione este trecho onde deseja exibir os boxes de login social*/}

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
                    <View>
                        <TextComponent>Ainda não possui Conta? </TextComponent>
                    </View>

                    <View>
                        <TextLink url={"https://youtube.com"}>Cadastre-se</TextLink>
                    </View>
                </View>


            </View>
        </BackgroundDefault >
    );
};


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 200,
    },
    topText: {
        marginTop: -10,
        fontFamily: 'bold',
        flexDirection: "row"
    },
    containerInput: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100,
        marginTop: 120,
    },
    link: {
        marginTop: 20,
        marginBottom: 20,
        color: '#1DB954',
        flexDirection: 'row',
        fontSize: 16,
    },
    //{/* Styles para por a checkbox */}
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 3,
        borderColor: '#00D95F',
        borderRadius: 6,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#1DB954',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5,
        marginRight: 180,
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    checkboxLabel: {
        color: '#fff',
        fontSize: 18,
    },
    //{/*Styles para por as imagens */}
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    socialBox: {
        width: 60,
        height: 60,
        backgroundColor: '#4F4F4F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 40,
        elevation: 4, // sombra no Android
        shadowColor: '#000', // sombra no iOS
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    socialImage: {
        width: 36,
        height: 36,
    },
});